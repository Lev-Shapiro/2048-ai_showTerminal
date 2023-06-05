import { MicrophoneSystem } from "./microphone-system";

export class Microphone {
  constructor(private readonly microphoneSystem: MicrophoneSystem) {}

  async connect() {
    return this.microphoneSystem.record();
  }

  disconnect() {
    return this.microphoneSystem.stop();
  }

  isConnected() {
    return !!this.microphoneSystem.recordDto;
  }
}
