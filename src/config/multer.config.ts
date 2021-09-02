import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { v4 } from 'uuid';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

const getMulterConfig = (dest: string): MulterOptions => {
  return {
    storage: diskStorage({
      destination(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void,
      ) {
        const userId = req.user['id'];
        const destination = `.${process.env.PHOTOS_DEST}${dest}/${userId}`;
        fs.mkdir(destination, function (error) {});
        callback(null, destination);
      },
      filename(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void,
      ) {
        callback(null, v4() + path.extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 1000000,
    },
    fileFilter(
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(
          new BadRequestException('Selected file is not image!'),
          false,
        );
      }
      callback(null, true);
    },
  };
};

export default getMulterConfig;
