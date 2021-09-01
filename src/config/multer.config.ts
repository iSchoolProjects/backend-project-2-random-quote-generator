import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { v4 } from 'uuid';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common';

const getMulterConfig = (folderName: string): MulterOptions => {
  const multerConfig: MulterOptions = {
    storage: diskStorage({
      destination: `./uploads/${folderName}`,
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

  return multerConfig;
};

export default getMulterConfig;
