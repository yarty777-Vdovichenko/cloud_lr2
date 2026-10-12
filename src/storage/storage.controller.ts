import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('Azure Blob Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filename = await this.storageService.uploadFile(file);
    return {
      message: `File '${filename}' successfully uploaded to Azure Blob Storage.`,
    };
  }

  @Get('files')
  async listFiles() {
    return { files: await this.storageService.listFiles() };
  }

  @Get('files/:filename')
  async downloadFile(@Param('filename') filename: string) {
    const content = await this.storageService.downloadFile(filename);
    return { filename, content };
  }

  @Delete('files/:filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.storageService.deleteFile(filename);
    return {
      message: `File '${filename}' successfully deleted from Azure Blob Storage.`,
    };
  }
}
