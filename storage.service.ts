// src/storage/storage.service.ts
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private client = new S3Client({ region: process.env.AWS_REGION });

  async getPresignedPost(orgId: string, fileName: string, fileType: string) {
    const key = `uploads/${orgId}/${Date.now()}-${fileName}`;
    
    return createPresignedPost(this.client, {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // Max 10MB
        ['starts-with', '$Content-Type', 'application/'],
      ],
      Expires: 600, // 10 minutes
    });
  }
}
