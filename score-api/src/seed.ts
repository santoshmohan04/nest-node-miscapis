import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AvailableExercise } from './app/schema/exercise.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const availableExerciseModel = app.get<Model<AvailableExercise>>(
    getModelToken(AvailableExercise.name)
  );

  // Sample exercises data
  const exercises = [
    { name: 'Crunches', duration: 30, calories: 8 },
    { name: 'Touch Toes', duration: 180, calories: 15 },
    { name: 'Side Lunges', duration: 120, calories: 18 },
    { name: 'Burpees', duration: 60, calories: 8 },
    { name: 'Push-ups', duration: 60, calories: 10 },
    { name: 'Squats', duration: 90, calories: 12 },
    { name: 'Plank', duration: 60, calories: 5 },
    { name: 'Jumping Jacks', duration: 120, calories: 20 },
    { name: 'Mountain Climbers', duration: 90, calories: 15 },
    { name: 'Lunges', duration: 120, calories: 18 },
  ];

  try {
    // Check if exercises already exist
    const count = await availableExerciseModel.countDocuments();
    
    if (count > 0) {
      console.log(`Database already contains ${count} exercises. Skipping seed.`);
      console.log('To re-seed, delete existing exercises first.');
    } else {
      await availableExerciseModel.insertMany(exercises);
      console.log(`✅ Successfully seeded ${exercises.length} available exercises!`);
    }
  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
  } finally {
    await app.close();
  }
}

seed();
