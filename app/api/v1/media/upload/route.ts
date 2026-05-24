import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = path.extname(file.name) || '.png';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}${fileExt}`;

    const hasS3Config =
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_BUCKET_NAME;

    if (hasS3Config) {
      console.log("Configuring AWS S3/R2 Client for direct stream upload...");
      const s3 = new S3Client({
        region: process.env.S3_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: process.env.S3_ENDPOINT ? true : false,
      });

      const key = `media/${uniqueName}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type || 'image/png',
        })
      );

      // Construct CDN / access URL
      let publicUrl = '';
      if (process.env.S3_PUBLIC_URL) {
        publicUrl = `${process.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
      } else if (process.env.S3_ENDPOINT) {
        publicUrl = `${process.env.S3_ENDPOINT.replace(/\/$/, '')}/${process.env.S3_BUCKET_NAME}/${key}`;
      } else {
        publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION || 'us-east-1'}.amazonaws.com/${key}`;
      }

      return NextResponse.json({
        url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size_bytes: buffer.length,
      });
    } else {
      console.log("S3 credentials not found in env. Gracefully falling back to local filesystem storage...");
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, uniqueName);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;

      return NextResponse.json({
        url: publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size_bytes: buffer.length,
      });
    }
  } catch (error: any) {
    console.error("Media Upload API Error:", error);
    return NextResponse.json({ message: error.message || 'File upload failed' }, { status: 500 });
  }
}
