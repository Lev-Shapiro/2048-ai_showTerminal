import { ChildProcessWithoutNullStreams } from "child_process";
import EventEmitter from "events";
import { Readable } from "stream";

export class Recorder extends EventEmitter {
  childProcess: ChildProcessWithoutNullStreams | null = null;

  env: { [key: string]: string } = {};

  constructor(private readonly isLogSilence: boolean) {
    super();
  }

  private log(text: string) {
    if (this.isLogSilence) {
      console.log(text);
    }
  }

  /**
   * Creates and starts the audio recording process.
   * @returns {Recorder} this
   */
  start(childProcess: ChildProcessWithoutNullStreams): Recorder {
    if (this.childProcess) {
      console.warn(
        "AudioRecorder: Process already active, killed old one started new process."
      );

      this.stopRecording();
    }

    // Store this in `self` so it can be accessed in the callback.
    let self = this;
    childProcess.on("close", function (exitCode) {
      self.log(`AudioRecorder: Exit code '${exitCode}'.`);
      self.emit("close", exitCode);
    });

    childProcess.on("error", function (error) {
      self.emit("error", error);
    });

    childProcess.on("end", function () {
      self.emit("end");
    });

    this.log("AudioRecorder: Started recording.");

    this.childProcess = childProcess;

    return this;
  }
  /**
   * Stops and removes the audio recording process.
   * @returns {Recorder} this
   */
  stop(): Recorder {
    if (!this.childProcess) {
      console.warn(
        "AudioRecorder: Unable to stop recording, no process active."
      );
      return this;
    }

    this.stopRecording();

    this.log("AudioRecorder: Stopped recording.");

    return this;
  }
  /**
   * Get the audio stream of the recording process.
   * @returns {Readable} The stream.
   */
  stream(): Readable | null {
    if (!this.childProcess) {
      console.warn(
        "AudioRecorder: Unable to retrieve stream, because no process not active. Call the start or resume function first."
      );

      return null;
    }

    return this.childProcess.stdout;
  }

  stopRecording() {
    if (!this.childProcess) throw new Error("No recorder active");

    this.childProcess.kill();
    this.childProcess = null;
  }
}
