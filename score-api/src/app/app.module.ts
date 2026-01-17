import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesController } from './controllers/games.controller';
import { EmployeeModule } from './employee.module';
import { AuthModule } from './auth.module';
import { ThreadsModule } from './threads.module';
import { MessagesModule } from './messages.module';
import { BotModule } from './bot.module';
import { ExercisesModule } from './exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
    AuthModule,
    ThreadsModule,
    MessagesModule,
    BotModule,
    ExercisesModule,
  ],
  controllers: [AppController, GamesController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
