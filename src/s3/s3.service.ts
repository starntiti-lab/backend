import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    const accessKeyId = this.config.get<string>('S3_ACCESS_KEY', '');
    const secretAccessKey = this.config.get<string>('S3_SECRET_KEY', '');
    const endpoint = this.config.get<string>('S3_ENDPOINT', '');
    const region = this.config.get<string>('S3_REGION', 'auto');

    this.bucket = this.config.get<string>('S3_BUCKET', '');
    this.publicUrl = this.config.get<string>('S3_PUBLIC_URL', '');

    this.client = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    const ext = file.originalname.split('.').pop();
    const key = `uploads/${uuidv4()}.${ext}`;

    try {
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await upload.done();
      return { key, url: `${this.publicUrl}/${key}` };
    } catch (error) {
      throw new InternalServerErrorException(`Échec upload S3 : ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
    } catch (error) {
      throw new InternalServerErrorException(`Échec suppression S3 : ${error.message}`);
    }
  }
}