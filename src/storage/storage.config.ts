import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable()
export class StorageConfig {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerClientInstance: ContainerClient;

  constructor(private readonly configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    const containerName = this.configService.get<string>(
      'AZURE_CONTAINER_NAME',
    );

    if (!connectionString || !containerName) {
      throw new Error(
        'Missing AZURE_STORAGE_CONNECTION_STRING or AZURE_CONTAINER_NAME in .env',
      );
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClientInstance =
      this.blobServiceClient.getContainerClient(containerName);
  }

  get containerClient(): ContainerClient {
    return this.containerClientInstance;
  }
}
