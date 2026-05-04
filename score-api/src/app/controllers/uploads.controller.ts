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
import {
  recipeImageStorage,
  mealImageStorage,
  imageFileFilter,
  MAX_FILE_SIZE,
  getFileUrl,
  getMealImageUrl,
  MulterFile,
} from '../utils/file-upload.util';
import { FileUploadResponseDto } from '../dto/file-upload-response.dto';

@Controller('uploads')
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

  @Post('images')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: mealImageStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: MAX_FILE_SIZE,
      },
    })
  )
  uploadMealImage(
    @UploadedFile() file: MulterFile,
  ): FileUploadResponseDto {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return {
      url: getMealImageUrl(file.filename),
    };
  }
}
