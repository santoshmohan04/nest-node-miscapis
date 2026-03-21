import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { recipeImageStorage, imageFileFilter, MAX_FILE_SIZE, getFileUrl, MulterFile } from '../utils/file-upload.util';
import { FileUploadResponseDto } from '../dto/file-upload-response.dto';

@Controller('api/uploads')
export class UploadsController {
  @Post('recipe-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: recipeImageStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    })
  )
  uploadRecipeImage(
    @UploadedFile() file: MulterFile,
  ): FileUploadResponseDto {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      url: getFileUrl(file.filename),
    };
  }
}
