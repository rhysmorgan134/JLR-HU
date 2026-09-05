import { RingBuffer } from 'ringbuf.js'

const RENDER_QUANTUM_FRAMES = 128
const MAX_BLOCKS = 100

export class PcmPlayer {
  private readonly workletName = 'pcm-worklet-processor'
  private context: AudioContext | undefined
  private gainNode: GainNode | undefined
  private readonly channels: number
  private worklet: AudioWorkletNode | undefined
  private readonly buffers: Int16Array[] = []
  private readonly sharedBuffer = new SharedArrayBuffer(
    RENDER_QUANTUM_FRAMES * Float32Array.BYTES_PER_ELEMENT * MAX_BLOCKS
  )
  private readonly ringBuffer = new RingBuffer(this.sharedBuffer, Int16Array)

  constructor(sampleRate: number, channels: number) {
    this.context = new AudioContext({ latencyHint: 'playback', sampleRate })
    this.gainNode = this.context.createGain()
    this.gainNode.gain.value = 1
    this.gainNode.connect(this.context.destination)
    this.channels = channels
  }

  private feedWorklet(data: Int16Array): void {
    this.ringBuffer.push(data)
  }

  getRawBuffer(): SharedArrayBuffer {
    return this.sharedBuffer
  }

  feed(source: Int16Array): void {
    if (!this.worklet) {
      this.buffers.push(source)
      return
    }
    this.feedWorklet(source)
  }

  volume(volume: number, duration = 0): void {
    if (!this.gainNode || !this.context) return
    this.gainNode.gain.setTargetAtTime(volume, this.context.currentTime + duration, duration / 3)
  }

  async start(): Promise<void> {
    if (!this.context || !this.gainNode) throw new Error('PCM player has already been stopped')

    const workletUrl = new URL('./audio.worklet.js', document.baseURI).href
    await this.context.audioWorklet.addModule(workletUrl)

    this.worklet = new AudioWorkletNode(this.context, this.workletName, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [this.channels],
      processorOptions: { sab: this.sharedBuffer, channels: this.channels }
    })
    this.worklet.connect(this.gainNode)

    for (const source of this.buffers) this.feedWorklet(source)
    this.buffers.length = 0
  }

  async stop(): Promise<void> {
    if (!this.context) return
    if (this.context.state !== 'closed') await this.context.close()
    this.gainNode?.disconnect()
    this.worklet?.disconnect()
    this.context = undefined
    this.gainNode = undefined
    this.worklet = undefined
  }
}
