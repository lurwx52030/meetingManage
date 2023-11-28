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
    const { originalname } = file;
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    // 將檔名編碼轉成utf8
    // 替換特殊字元
    // reference -> https://blog.miniasp.com/post/2010/04/27/How-to-filter-special-characters-using-NET-Regex
    const filename = Buffer.from(file.originalname, 'latin1')
      .toString('utf8')
      .toString()
      .split('.')[0]
      .replace(/@"[\W_]+/g, '_');

    const fileExt = Buffer.from(file.originalname, 'latin1')
      .toString('utf8')
      .split('.')[1];

    if (request.params.meetingId !== undefined) {
      callback(null, `${request.params.meetingId}-${filename}.${fileExt}`);
      return;
    }
    callback(null, `${timestamp}-${filename}.${fileExt}`);
    return;
  }
}
