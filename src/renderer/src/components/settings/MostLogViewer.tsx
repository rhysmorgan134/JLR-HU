import { Box, Button, Chip, Typography } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../store/store'

type LogFile = { name: string; size: number; modified: string }
type LogMessage = { direction: 'rx' | 'tx' | 'error'; timestamp?: string; sourceAddress?: string | number; targetAddress?: string | number; fBlockID?: string | number; instanceID?: string | number; fktID?: string | number; opType?: string | number; telID?: string | number; data?: Array<string | number>; line?: number }
type MessageChain = { id: number; kind: 'exchange' | 'multipart' | 'message'; messages: LogMessage[] }

const numeric = (value: string | number | undefined) => typeof value === 'number' ? value : value == null ? -1 : Number.parseInt(value, value.toLowerCase().startsWith('0x') ? 16 : 10)
const displayHex = (value: string | number | undefined, width = 2) => value == null ? '—' : `0x${numeric(value).toString(16).toUpperCase().padStart(width, '0')}`
const messageAddress = (message: LogMessage) => numeric(message.sourceAddress ?? message.targetAddress)
const identity = (message: LogMessage) => `${messageAddress(message)}:${numeric(message.fBlockID)}:${numeric(message.instanceID)}:${numeric(message.fktID)}`
const reverseMatch = (tx: LogMessage, rx: LogMessage) => numeric(tx.targetAddress) === numeric(rx.sourceAddress) && numeric(tx.fBlockID) === numeric(rx.fBlockID) && numeric(tx.instanceID) === numeric(rx.instanceID) && numeric(tx.fktID) === numeric(rx.fktID)

function buildChains(messages: LogMessage[]): MessageChain[] {
  const chains: MessageChain[] = []
  const multipart = new Map<string, MessageChain>()
  messages.forEach((message, index) => {
    const telID = numeric(message.telID)
    if (message.direction === 'rx' && telID === 1) {
      const parent = [...chains].reverse().find((chain) => chain.messages[0]?.direction === 'tx' && reverseMatch(chain.messages[0], message) && !chain.messages.some((entry) => entry.direction === 'rx'))
      const chain = parent || { id: index, kind: 'multipart' as const, messages: [] }
      chain.kind = parent ? 'exchange' : 'multipart'
      chain.messages.push(message)
      if (!parent) chains.push(chain)
      multipart.set(identity(message), chain)
      return
    }
    if (message.direction === 'rx' && (telID === 2 || telID === 3)) {
      const chain = multipart.get(identity(message))
      if (chain) {
        chain.messages.push(message)
        if (telID === 3) multipart.delete(identity(message))
        return
      }
    }
    if (message.direction === 'rx') {
      const parent = [...chains].reverse().find((chain) => chain.messages[0]?.direction === 'tx' && reverseMatch(chain.messages[0], message) && !chain.messages.some((entry) => entry.direction === 'rx' && numeric(entry.opType) !== 0x0a))
      if (parent) {
        parent.kind = 'exchange'
        parent.messages.push(message)
        return
      }
    }
    chains.push({ id: index, kind: 'message', messages: [message] })
  })
  return chains
}

function MessageRow({ message, sequence }: { message: LogMessage; sequence?: number }) {
  const color = message.direction === 'rx' ? '#65e2a8' : message.direction === 'tx' ? '#67d8ff' : '#ff7188'
  return <Box sx={{ display: 'grid', gridTemplateColumns: '40px 56px 36px 36px 54px 38px minmax(0,1fr)', gap: .65, px: 1, py: .55, alignItems: 'center', borderTop: '1px solid rgba(189,221,255,.055)', fontFamily: 'monospace', fontSize: 10.5 }}>
    <Typography sx={{ font: 'inherit', fontWeight: 800, color }}>{message.direction.toUpperCase()}{sequence == null ? '' : ` ${sequence}`}</Typography><Typography sx={{ font: 'inherit', color: 'text.secondary' }}>{displayHex(message.sourceAddress ?? message.targetAddress, 4)}</Typography><Typography sx={{ font: 'inherit' }}>{displayHex(message.fBlockID)}</Typography><Typography sx={{ font: 'inherit' }}>{displayHex(message.instanceID)}</Typography><Typography sx={{ font: 'inherit' }}>{displayHex(message.fktID, 3)}</Typography><Typography sx={{ font: 'inherit', color: 'text.secondary' }}>{displayHex(message.opType)}</Typography><Typography noWrap sx={{ font: 'inherit' }}>{(message.data || []).map((byte) => displayHex(byte).slice(2)).join(' ') || '—'}</Typography>
  </Box>
}

export default function MostLogViewer() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<LogFile[]>([])
  const [selected, setSelected] = useState('')
  const [messages, setMessages] = useState<LogMessage[]>([])
  const [error, setError] = useState('')
  const chains = useMemo(() => buildChains(messages), [messages])
  const loadList = () => socket.emit('mostLogs:list', (result: { files: LogFile[]; error?: string }) => { setFiles(result.files); setError(result.error || ''); if (!selected && result.files[0]) loadFile(result.files[0].name) })
  const loadFile = (name: string) => socket.emit('mostLogs:read', name, (result: { messages: LogMessage[]; error?: string }) => { setSelected(name); setMessages(result.messages); setError(result.error || '') })
  useEffect(() => { loadList() }, [])
  return <Box sx={{ height: '100%', p: 1, display: 'grid', gridTemplateRows: '46px minmax(0,1fr)', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box className="settings-back" onClick={() => navigate('/settings/most')}><ArrowBackRoundedIcon /></Box><FolderOpenRoundedIcon sx={{ ml: .3, color: 'primary.main' }} /><Box sx={{ mr: 'auto' }}><Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.05 }}>MOST log viewer</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: 1.1 }}>CORRELATED MESSAGE CHAINS</Typography></Box><Chip size="small" label={`${chains.length} chains · ${messages.length} messages`} variant="outlined" /><Button size="small" startIcon={<RefreshRoundedIcon />} onClick={() => selected ? loadFile(selected) : loadList()}>Refresh</Button></Box>
    <Box sx={{ minHeight: 0, display: 'grid', gridTemplateColumns: '225px minmax(0,1fr)', gap: 1 }}>
      <Box className="glass-panel" sx={{ borderRadius: 2.5, minHeight: 0, overflowY: 'auto', p: .7 }}>{files.length === 0 ? <Typography sx={{ p: 1, fontSize: 12, color: 'text.secondary' }}>No diagnostic logs found.</Typography> : files.map((file) => <Box key={file.name} onClick={() => loadFile(file.name)} sx={{ mb: .55, p: 1, borderRadius: 1.5, cursor: 'pointer', border: '1px solid', borderColor: selected === file.name ? 'primary.main' : 'transparent', background: selected === file.name ? 'var(--accent-soft)' : 'rgba(255,255,255,.025)' }}><Typography noWrap sx={{ fontSize: 11.5, fontWeight: 600 }}>{file.name.replace('most-diagnostics-', '').replace('.jsonl', '')}</Typography><Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{(file.size / 1024).toFixed(1)} KB · {new Date(file.modified).toLocaleString()}</Typography></Box>)}</Box>
      <Box className="glass-panel" sx={{ borderRadius: 2.5, minWidth: 0, minHeight: 0, overflowY: 'auto', p: .7 }}>{error ? <Typography sx={{ p: 1, color: 'error.main' }}>{error}</Typography> : chains.map((chain) => <Box key={chain.id} sx={{ mb: .65, overflow: 'hidden', borderRadius: 1.5, border: '1px solid', borderColor: chain.kind === 'exchange' ? 'rgba(139,156,255,.35)' : chain.kind === 'multipart' ? 'rgba(255,196,107,.3)' : 'rgba(189,221,255,.08)', background: 'rgba(4,9,15,.36)' }}><Box sx={{ px: 1, py: .45, display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.1, color: chain.kind === 'exchange' ? 'secondary.main' : chain.kind === 'multipart' ? '#ffc46b' : 'text.secondary' }}>{chain.kind.toUpperCase()}</Typography><Typography sx={{ fontSize: 9.5, color: 'text.secondary' }}>{chain.messages[0]?.timestamp ? new Date(chain.messages[0].timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 }) : `LINE ${chain.messages[0]?.line || '—'}`}</Typography><Typography sx={{ ml: 'auto', fontSize: 9.5, color: 'text.secondary' }}>{chain.messages.length} packet{chain.messages.length === 1 ? '' : 's'}</Typography></Box>{chain.messages.map((message, index) => <MessageRow key={index} message={message} sequence={chain.messages.length > 1 ? index + 1 : undefined} />)}</Box>)}</Box>
    </Box>
  </Box>
}
