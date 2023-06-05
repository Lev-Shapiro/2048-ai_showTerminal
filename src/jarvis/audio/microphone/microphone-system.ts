import { spawn } from "child_process";
import { ReadStream, createReadStream, createWriteStream, truncate } from "fs";

import { RecordDto } from "../../../dtos/record.dto";
import { Recorder } from "./recorder";
import { RecordingOptions } from "./recording-options";

export class MicrophoneSystem extends RecordingOptions {
  recordDto: RecordDto | null = null;

  constructor(private readonly microphoneAudioPath: string) {
    super();
  }

  private readonly audioPath = this.microphoneAudioPath + "/input.wav";

  clearFile() {
    // clear all contents in file
    truncate(this.audioPath, 0, () => null);
  }

  record() {
    return new Promise<ReadStream>((resolve) => {
      /** recording audio from microphone */
      const childProcess = spawn("sox", this.args, {
        env: process.env,
      });

      const recordProcess = new Recorder(false).start(childProcess);

      /** save audio to file */
      const recordSaveProcess = createWriteStream(this.audioPath, {
        encoding: "binary",
      });

      recordProcess.stream()?.pipe(recordSaveProcess);

      this.recordDto = new RecordDto(recordProcess, recordSaveProcess);

      childProcess.on("close", async (exitCode: number) => {
        const readStream = createReadStream(this.audioPath);

        resolve(readStream);

        return exitCode;
      });
    });
  }

  stop() {
    if (this.recordDto) {
      console.log("Stopping microphone");
      return this.recordDto.close();
    }

    console.log("There is no microphone process to stop");
  }
}
