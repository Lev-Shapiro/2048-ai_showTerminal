interface AudioOptions {
  program: string;
  device: string | null;
  driver: string | null;
  bits: number;
  channels: number;
  encoding: string;
  format: string;
  rate: number;
  type: string;

  silence: number;
  thresholdStart: number;
  thresholdStop: number;
  keepSilence: boolean;
}

export class RecordingOptions {
  options: AudioOptions = {
    program: "sox",
    device: null, // Recording device to use.
    driver: null, // Recording driver to use.

    bits: 16, // Sample size. (only for `rec` and `sox`)
    channels: 1, // Channel count.
    encoding: "signed-integer", // Encoding type. (only for `rec` and `sox`)
    format: "S16_LE", // Format type. (only for `arecord`)
    rate: 16000, // Sample rate.
    type: "wav", // File type.

    // Following options only available when using `rec` or `sox`.
    silence: 1, // Duration of silence in seconds before it stops recording.
    thresholdStart: 0.5, // Silence threshold to start recording.
    thresholdStop: 0.5, // Silence threshold to stop recording.
    keepSilence: false, // Keep the silence in the recording.
  };

  get args() {
    const options = this.options;

    return [
      "-d",
      // Show no progress
      "-q",
      // Channel count
      "-c",
      options.channels.toString(),
      // Sample rate
      "-r",
      options.rate.toString(),
      // Format type
      "-t",
      options.type,
      // Show no error messages
      //   Use the `close` event to listen for an exit code.
      "-V0",
      // Endian
      //   -L = little
      //   -B = big
      //   -X = swap
      "-L",
      // Bit rate
      "-b",
      options.bits.toString(),
      // Encoding type
      "-e",
      options.encoding,
      // Pipe
      "-",
      // Effect
      "silence",
      // Stop recording after duration has passed below threshold.
      // Enable above-periods
      "1",
      // Duration
      "0.1",
      // Starting threshold
      options.thresholdStart.toFixed(1).concat("%"),
      // Enable below-periods
      "1",
      // Duration
      options.silence.toFixed(1),
      // Stopping threshold
      options.thresholdStop.toFixed(1).concat("%"),
    ];
  }
}
