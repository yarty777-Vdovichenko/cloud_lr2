import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { StorageConfig } from './storage.config';

@Module({
  controllers: [StorageController],
  providers: [StorageService, StorageConfig],
})
export class StorageModule {}
