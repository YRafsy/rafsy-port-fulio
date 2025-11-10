declare module 'wav' {
  import { Transform } from 'stream';

  export class Reader extends Transform {
    constructor(options?: any);
  }

  export class Writer extends Transform {
    constructor(options?: {
      format?: string;
      channels?: number;
      sampleRate?: number;
      bitDepth?: number;
    });
  }
}
