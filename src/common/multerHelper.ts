import { Request } from 'express';
import { join } from 'path';
import * as fs from 'fs';

export class MulterHelper {
  public static destination(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ): void {
    const path = join(__dirname, '../../uploads/');
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    callback(null, path);
  }

  public static filenameHandler(
    request: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ): void {
    const { originalname } = file;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    if (request.params.meetingId !== undefined) {
      callback(null, `${request.params.meetingId}-${originalname}`);
      return;
    }
    callback(null, `${timestamp}-${originalname}`);
    return;
  }
}
