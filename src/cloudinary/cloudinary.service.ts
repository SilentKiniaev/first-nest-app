import { Injectable, Res } from '@nestjs/common';
import { Readable } from 'stream';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, VideoFormat, ImageFormat } from 'cloudinary';
import { UPLOAD_FOLDER } from './constants';
import { ResourceType } from './enums';

@Injectable()
export class CloudinaryService {
    constructor() { }

    // public async getSile() {
    //   cloudinary.video()
    // }

    public async uploadMultipleImage(files: Express.Multer.File[], folder?: string) {
      return this.uploadFileArray(files, ResourceType.Image);
    }

    public async uploadSingleImage(file: Express.Multer.File, folder?: string) {
      return this.uploadFile(file, ResourceType.Image, folder);
    }

    private async uploadFileArray(files: Express.Multer.File[], type?: ResourceType, folder?: string): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
      return Promise.all(
        files.map((file) => this.uploadFile(file, type, folder)))
          .then((results) => results);
    }

    private async uploadFile(file: Express.Multer.File, type: ResourceType = ResourceType.Image, folder?: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);
    
        return new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: folder ?? UPLOAD_FOLDER,
              // format: "mp4",
              // allowed_formats: ["mp4"],
              resource_type: type
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result);
            }
          ).end(file.buffer);
          // stream.pipe(uploadStream);
        });
    }
}
