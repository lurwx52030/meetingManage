import { Request } from 'express';
import * as fs from 'fs';
import { join } from 'path';

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
    let { originalname } = file;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    // 將檔名編碼轉成utf8
    originalname = Buffer.from(originalname, 'latin1').toString('utf-8');

    if (request.params.meetingId !== undefined) {
      callback(null, `${request.params.meetingId}-${originalname}`);
      return;
    }
    callback(null, `${timestamp}-${originalname}`);
    return;
  }
}
