import { MostRxMessage } from 'socketmost'

export abstract class Message {
  data: MostRxMessage

  constructor(data: MostRxMessage) {
    this.data = data
  }

  abstract parseMessage(): void
}

export class AmFmTuner {}
