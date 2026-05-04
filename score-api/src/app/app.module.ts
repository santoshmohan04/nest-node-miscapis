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
import { GoalsModule } from './goals.module';
import { WorkoutPlansModule } from './workout-plans.module';
import { ProductModule } from './product.module';
import { CartModule } from './cart.module';
import { OrderModule } from './order.module';
import { AddressModule } from './address.module';
import { RecipesModule } from './recipes.module';
import { FavoritesModule } from './favorites.module';
import { RatingsModule } from './ratings.module';
import { CommentsModule } from './comments.module';
import { UploadsModule } from './uploads.module';
import { ShoppingListModule } from './shopping-list.module';
import { RecipeCategoriesModule } from './recipe-categories.module';
import { MealsModule } from './meals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Default connection for 'test' database (existing functionality)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Named connection for 'estore' database (e-commerce functionality)
    MongooseModule.forRootAsync({
      connectionName: 'estore',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_ESTORE_URI'),
      }),
      inject: [ConfigService],
    }),
    // Named connection for 'recipes' database (recipes functionality)
    MongooseModule.forRootAsync({
      connectionName: 'recipes',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_RECIPES_URI'),
      }),
      inject: [ConfigService],
    }),
    // Named connection for 'meals' database (meals functionality)
    MongooseModule.forRootAsync({
      connectionName: 'meals',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_MEALS_URI'),
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
    AuthModule,
    ThreadsModule,
    MessagesModule,
    BotModule,
    ExercisesModule,
    GoalsModule,
    WorkoutPlansModule,
    ProductModule,
    CartModule,
    OrderModule,
    AddressModule,
    RecipesModule,
    FavoritesModule,
    RatingsModule,
    CommentsModule,
    UploadsModule,
    ShoppingListModule,
    RecipeCategoriesModule,
    MealsModule,
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
