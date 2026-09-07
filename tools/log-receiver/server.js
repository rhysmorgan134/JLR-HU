const http = require('http')
const fs = require('fs/promises')
const path = require('path')

const port = Number(process.env.PORT || 4318)
const dataDirectory = process.env.LOG_DIRECTORY || '/data'
const maximumBodyBytes = 5 * 1024 * 1024

const safeName = (value) => String(value || 'unknown').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)

async function receiveBody(request) {
  const chunks = []
  let length = 0
  for await (const chunk of request) {
    length += chunk.length
    if (length > maximumBodyBytes) throw new Error('request body exceeds 5 MB')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function storeLogs(payload, remoteAddress) {
  const entries = Array.isArray(payload.logs) ? payload.logs : [payload]
  const device = safeName(payload.deviceId)
  const application = safeName(payload.application || 'JLR-HU')
  const day = new Date().toISOString().slice(0, 10)
  const file = path.join(dataDirectory, `${application}-${device}-${day}.jsonl`)
  const receivedAt = new Date().toISOString()
  const lines = entries.map((entry) => JSON.stringify({
    receivedAt,
    remoteAddress,
    deviceId: payload.deviceId || 'unknown',
    application: payload.application || 'JLR-HU',
    entry
  })).join('\n') + '\n'

  await fs.mkdir(dataDirectory, { recursive: true })
  await fs.appendFile(file, lines, 'utf8')
  return { file: path.basename(file), stored: entries.length }
}

const server = http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json')

  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200)
    response.end(JSON.stringify({ ok: true, service: 'jlr-hu-log-receiver' }))
    return
  }

  if (request.method !== 'POST' || request.url !== '/logs') {
    response.writeHead(404)
    response.end(JSON.stringify({ error: 'not found' }))
    return
  }

  try {
    const body = await receiveBody(request)
    const payload = JSON.parse(body)
    if (!payload || (!Array.isArray(payload.logs) && typeof payload !== 'object')) {
      throw new Error('expected a JSON object or a logs array')
    }
    const result = await storeLogs(payload, request.socket.remoteAddress)
    response.writeHead(202)
    response.end(JSON.stringify({ ok: true, ...result }))
  } catch (error) {
    response.writeHead(error.message.includes('5 MB') ? 413 : 400)
    response.end(JSON.stringify({ error: error.message }))
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`JLR-HU log receiver listening on 0.0.0.0:${port}`)
  console.log(`Writing logs to ${dataDirectory}`)
})
