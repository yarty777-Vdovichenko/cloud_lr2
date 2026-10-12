import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageConfig } from './storage.config';

@Injectable()
export class StorageService {
  constructor(private readonly storageConfig: StorageConfig) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const blobClient = this.storageConfig.containerClient.getBlockBlobClient(
      file.originalname,
    );
    await blobClient.uploadData(file.buffer, {
      overwrite: true,
    } as any);
    return file.originalname;
  }

  async listFiles(): Promise<string[]> {
    const names: string[] = [];
    for await (const blob of this.storageConfig.containerClient.listBlobsFlat()) {
      names.push(blob.name);
    }
    return names;
  }

  async downloadFile(filename: string): Promise<string> {
    const blobClient =
      this.storageConfig.containerClient.getBlobClient(filename);
    const exists = await blobClient.exists();
    if (!exists) {
      throw new NotFoundException(`File '${filename}' not found`);
    }
    const downloadResponse = await blobClient.download();
    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody!) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  async deleteFile(filename: string): Promise<void> {
    const blobClient =
      this.storageConfig.containerClient.getBlobClient(filename);
    const exists = await blobClient.exists();
    if (!exists) {
      throw new NotFoundException(`File '${filename}' not found`);
    }
    await blobClient.delete();
  }
}
