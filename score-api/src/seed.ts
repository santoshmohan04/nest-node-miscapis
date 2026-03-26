import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AvailableExercise } from './app/schema/exercise.schema';
import { User } from './app/schema/user.schema';
import { RecipeCategory } from './app/schema/recipe-category.schema';
import { Recipe, Difficulty } from './app/schema/recipe.schema';
import { Rating } from './app/schema/rating.schema';
import { Favorite } from './app/schema/favorite.schema';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from score-api/.env
config({ path: resolve(__dirname, '../.env') });

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const availableExerciseModel = app.get<Model<AvailableExercise>>(
    getModelToken(AvailableExercise.name)
  );
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const recipeCategoryModel = app.get<Model<RecipeCategory>>(
    getModelToken(RecipeCategory.name, 'recipes')
  );
  const recipeModel = app.get<Model<Recipe>>(getModelToken(Recipe.name, 'recipes'));
  const ratingModel = app.get<Model<Rating>>(getModelToken(Rating.name, 'recipes'));
  const favoriteModel = app.get<Model<Favorite>>(
    getModelToken(Favorite.name, 'recipes')
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

  // Sample users data
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [
    {
      email: 'john.doe@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    },
    {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      isActive: true,
    },
    {
      email: 'chef.mike@example.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Johnson',
      isActive: true,
    },
    {
      email: 'sarah.baker@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Baker',
      isActive: true,
    },
    {
      email: 'tony.chef@example.com',
      password: hashedPassword,
      firstName: 'Tony',
      lastName: 'Chen',
      isActive: true,
    },
  ];

  // Recipe categories
  const categories = [
    { name: 'Breakfast', icon: '🍳' },
    { name: 'Lunch', icon: '🥗' },
    { name: 'Dinner', icon: '🍽️' },
    { name: 'Dessert', icon: '🍰' },
    { name: 'Snacks', icon: '🍿' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Appetizers', icon: '🍢' },
    { name: 'Salads', icon: '🥙' },
    { name: 'Soups', icon: '🍲' },
    { name: 'Vegetarian', icon: '🥦' },
    { name: 'Vegan', icon: '🌱' },
    { name: 'Seafood', icon: '🦞' },
    { name: 'Pasta', icon: '🍝' },
    { name: 'Asian', icon: '🍜' },
    { name: 'Mexican', icon: '🌮' },
    { name: 'Italian', icon: '🍕' },
  ];

  try {
    // Seed exercises
    const exerciseCount = await availableExerciseModel.countDocuments();
    if (exerciseCount === 0) {
      await availableExerciseModel.insertMany(exercises);
      console.log(`✅ Successfully seeded ${exercises.length} exercises!`);
    } else {
      console.log(`ℹ️  Skipping exercises (${exerciseCount} already exist)`);
    }

    // Seed users
    const userCount = await userModel.countDocuments();
    let createdUsers;
    if (userCount === 0) {
      createdUsers = await userModel.insertMany(users);
      console.log(`✅ Successfully seeded ${createdUsers.length} users!`);
    } else {
      console.log(`ℹ️  Skipping users (${userCount} already exist)`);
      createdUsers = await userModel.find().limit(5).exec();
    }

    // Check if we have users
    if (!createdUsers || createdUsers.length === 0) {
      console.error('❌ No users found in database! Cannot proceed with recipe seeding.');
      return;
    }
    
    console.log(`✓ Found ${createdUsers.length} users for recipe authorship`);

    // Seed categories
    const categoryCount = await recipeCategoryModel.countDocuments();
    let createdCategories;
    if (categoryCount === 0) {
      createdCategories = await recipeCategoryModel.insertMany(categories);
      console.log(
        `✅ Successfully seeded ${createdCategories.length} categories!`
      );
    } else {
      console.log(`ℹ️  Skipping categories (${categoryCount} already exist)`);
      createdCategories = await recipeCategoryModel.find().exec();
    }

    // Seed recipes (50+ recipes)
    const recipeCount = await recipeModel.countDocuments();
    let createdRecipes;
    if (recipeCount === 0) {
      const recipes = [
        // Breakfast Recipes (8)
        {
          title: 'Classic Pancakes',
          description: 'Fluffy homemade pancakes perfect for weekend breakfast',
          imageUrl: '/uploads/recipes/pancakes.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'All-purpose flour', quantity: 2, unit: 'cups' },
            { name: 'Milk', quantity: 1.5, unit: 'cups' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Sugar', quantity: 2, unit: 'tablespoons' },
            { name: 'Baking powder', quantity: 2, unit: 'teaspoons' },
            { name: 'Salt', quantity: 0.5, unit: 'teaspoon' },
          ],
          instructions: [
            'Mix dry ingredients in a large bowl',
            'Whisk eggs and milk together',
            'Combine wet and dry ingredients',
            'Heat a griddle and pour batter',
            'Cook until bubbles form, then flip',
            'Serve with maple syrup and butter',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Avocado Toast',
          description: 'Healthy and delicious avocado toast with poached egg',
          imageUrl: '/uploads/recipes/avocado-toast.jpg',
          cookingTime: 10,
          servings: 2,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Whole wheat bread', quantity: 4, unit: 'slices' },
            { name: 'Ripe avocados', quantity: 2, unit: 'pieces' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Lemon juice', quantity: 1, unit: 'tablespoon' },
            { name: 'Salt', quantity: 1, unit: 'pinch' },
            { name: 'Red pepper flakes', quantity: 1, unit: 'pinch' },
          ],
          instructions: [
            'Toast the bread slices',
            'Mash avocados with lemon juice and salt',
            'Poach the eggs',
            'Spread avocado on toast',
            'Top with poached egg',
            'Sprinkle with red pepper flakes',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'French Toast',
          description: 'Golden crispy French toast with cinnamon',
          imageUrl: '/uploads/recipes/french-toast.jpg',
          cookingTime: 15,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Bread slices', quantity: 8, unit: 'pieces' },
            { name: 'Eggs', quantity: 4, unit: 'pieces' },
            { name: 'Milk', quantity: 0.5, unit: 'cup' },
            { name: 'Cinnamon', quantity: 1, unit: 'teaspoon' },
            { name: 'Vanilla extract', quantity: 1, unit: 'teaspoon' },
            { name: 'Butter', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Whisk eggs, milk, cinnamon, and vanilla',
            'Dip bread slices in egg mixture',
            'Heat butter in a pan',
            'Cook bread until golden on both sides',
            'Serve with maple syrup and fresh berries',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Scrambled Eggs with Herbs',
          description: 'Creamy scrambled eggs with fresh herbs',
          imageUrl: '/uploads/recipes/scrambled-eggs.jpg',
          cookingTime: 10,
          servings: 2,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Eggs', quantity: 6, unit: 'pieces' },
            { name: 'Butter', quantity: 2, unit: 'tablespoons' },
            { name: 'Heavy cream', quantity: 2, unit: 'tablespoons' },
            { name: 'Fresh chives', quantity: 2, unit: 'tablespoons' },
            { name: 'Salt', quantity: 1, unit: 'pinch' },
            { name: 'Black pepper', quantity: 1, unit: 'pinch' },
          ],
          instructions: [
            'Beat eggs with cream, salt, and pepper',
            'Melt butter in a non-stick pan over low heat',
            'Pour in eggs and stir gently',
            'Cook slowly, stirring constantly',
            'Remove from heat when still slightly runny',
            'Garnish with fresh chives',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Breakfast Burrito',
          description: 'Hearty breakfast burrito with eggs, cheese, and bacon',
          imageUrl: '/uploads/recipes/breakfast-burrito.jpg',
          cookingTime: 25,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Large tortillas', quantity: 4, unit: 'pieces' },
            { name: 'Eggs', quantity: 6, unit: 'pieces' },
            { name: 'Bacon strips', quantity: 8, unit: 'pieces' },
            { name: 'Cheddar cheese', quantity: 1, unit: 'cup' },
            { name: 'Bell peppers', quantity: 1, unit: 'piece' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
          ],
          instructions: [
            'Cook bacon until crispy',
            'Sauté peppers and onions',
            'Scramble eggs',
            'Warm tortillas',
            'Fill tortillas with eggs, bacon, veggies, and cheese',
            'Roll up tightly and serve',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Oatmeal with Berries',
          description: 'Nutritious steel-cut oatmeal topped with fresh berries',
          imageUrl: '/uploads/recipes/oatmeal.jpg',
          cookingTime: 30,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Steel-cut oats', quantity: 1, unit: 'cup' },
            { name: 'Water', quantity: 3, unit: 'cups' },
            { name: 'Mixed berries', quantity: 2, unit: 'cups' },
            { name: 'Honey', quantity: 3, unit: 'tablespoons' },
            { name: 'Cinnamon', quantity: 1, unit: 'teaspoon' },
            { name: 'Almond milk', quantity: 0.5, unit: 'cup' },
          ],
          instructions: [
            'Bring water to boil',
            'Add oats and reduce heat',
            'Simmer for 25 minutes, stirring occasionally',
            'Stir in cinnamon and almond milk',
            'Top with berries and drizzle with honey',
            'Serve hot',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Greek Yogurt Parfait',
          description: 'Layered yogurt parfait with granola and fruit',
          imageUrl: '/uploads/recipes/yogurt-parfait.jpg',
          cookingTime: 10,
          servings: 2,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Greek yogurt', quantity: 2, unit: 'cups' },
            { name: 'Granola', quantity: 1, unit: 'cup' },
            { name: 'Mixed berries', quantity: 1.5, unit: 'cups' },
            { name: 'Honey', quantity: 2, unit: 'tablespoons' },
            { name: 'Sliced almonds', quantity: 0.25, unit: 'cup' },
          ],
          instructions: [
            'Layer yogurt in serving glasses',
            'Add a layer of berries',
            'Sprinkle granola',
            'Repeat layers',
            'Drizzle with honey',
            'Top with sliced almonds',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Breakfast',
        },
        {
          title: 'Banana Smoothie Bowl',
          description: 'Thick and creamy smoothie bowl topped with fresh fruits',
          imageUrl: '/uploads/recipes/smoothie-bowl.jpg',
          cookingTime: 10,
          servings: 2,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Frozen bananas', quantity: 3, unit: 'pieces' },
            { name: 'Greek yogurt', quantity: 1, unit: 'cup' },
            { name: 'Almond milk', quantity: 0.5, unit: 'cup' },
            { name: 'Fresh berries', quantity: 1, unit: 'cup' },
            { name: 'Granola', quantity: 0.5, unit: 'cup' },
            { name: 'Chia seeds', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Blend frozen bananas, yogurt, and almond milk',
            'Pour into bowls',
            'Top with fresh berries',
            'Add granola and chia seeds',
            'Serve immediately',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Breakfast',
        },

        // Lunch Recipes (7)
        {
          title: 'Caesar Salad',
          description: 'Classic Caesar salad with homemade dressing and croutons',
          imageUrl: '/uploads/recipes/caesar-salad.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Romaine lettuce', quantity: 2, unit: 'heads' },
            { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
            { name: 'Croutons', quantity: 2, unit: 'cups' },
            { name: 'Caesar dressing', quantity: 0.75, unit: 'cup' },
            { name: 'Garlic', quantity: 2, unit: 'cloves' },
            { name: 'Lemon juice', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Wash and chop romaine lettuce',
            'Make dressing with garlic, lemon, and parmesan',
            'Toss lettuce with dressing',
            'Add croutons',
            'Top with shaved parmesan',
            'Serve immediately',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Grilled Chicken Wrap',
          description: 'Healthy grilled chicken wrap with fresh vegetables',
          imageUrl: '/uploads/recipes/chicken-wrap.jpg',
          cookingTime: 25,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Chicken breast', quantity: 500, unit: 'grams' },
            { name: 'Whole wheat tortillas', quantity: 4, unit: 'pieces' },
            { name: 'Lettuce', quantity: 2, unit: 'cups' },
            { name: 'Tomatoes', quantity: 2, unit: 'pieces' },
            { name: 'Ranch dressing', quantity: 0.5, unit: 'cup' },
            { name: 'Shredded cheese', quantity: 1, unit: 'cup' },
          ],
          instructions: [
            'Season and grill chicken breast',
            'Slice chicken into strips',
            'Warm tortillas',
            'Layer lettuce, tomatoes, chicken, and cheese',
            'Drizzle with ranch dressing',
            'Roll up tightly and serve',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Tomato Basil Soup',
          description: 'Creamy tomato soup with fresh basil',
          imageUrl: '/uploads/recipes/tomato-soup.jpg',
          cookingTime: 40,
          servings: 6,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Tomatoes', quantity: 1000, unit: 'grams' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Garlic', quantity: 4, unit: 'cloves' },
            { name: 'Heavy cream', quantity: 1, unit: 'cup' },
            { name: 'Fresh basil', quantity: 0.5, unit: 'cup' },
            { name: 'Vegetable broth', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Sauté onion and garlic',
            'Add tomatoes and broth',
            'Simmer for 20 minutes',
            'Blend until smooth',
            'Stir in cream and basil',
            'Season and serve hot',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Quinoa Buddha Bowl',
          description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini',
          imageUrl: '/uploads/recipes/buddha-bowl.jpg',
          cookingTime: 35,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Quinoa', quantity: 1.5, unit: 'cups' },
            { name: 'Sweet potato', quantity: 2, unit: 'pieces' },
            { name: 'Chickpeas', quantity: 400, unit: 'grams' },
            { name: 'Kale', quantity: 2, unit: 'cups' },
            { name: 'Tahini', quantity: 0.5, unit: 'cup' },
            { name: 'Avocado', quantity: 1, unit: 'piece' },
          ],
          instructions: [
            'Cook quinoa according to package instructions',
            'Roast sweet potatoes and chickpeas',
            'Massage kale with olive oil',
            'Assemble bowls with quinoa as base',
            'Add roasted veggies, chickpeas, and kale',
            'Top with sliced avocado and tahini dressing',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Tuna Salad Sandwich',
          description: 'Classic tuna salad sandwich on whole grain bread',
          imageUrl: '/uploads/recipes/tuna-sandwich.jpg',
          cookingTime: 15,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Canned tuna', quantity: 400, unit: 'grams' },
            { name: 'Mayonnaise', quantity: 0.5, unit: 'cup' },
            { name: 'Celery', quantity: 2, unit: 'stalks' },
            { name: 'Red onion', quantity: 0.25, unit: 'cup' },
            { name: 'Whole grain bread', quantity: 8, unit: 'slices' },
            { name: 'Lettuce', quantity: 4, unit: 'leaves' },
          ],
          instructions: [
            'Drain tuna and place in bowl',
            'Chop celery and onion finely',
            'Mix tuna with mayo, celery, and onion',
            'Season with salt and pepper',
            'Spread tuna mixture on bread',
            'Add lettuce and top with another slice',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Mediterranean Pita Pocket',
          description: 'Fresh pita pocket filled with falafel and veggies',
          imageUrl: '/uploads/recipes/pita-pocket.jpg',
          cookingTime: 30,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Pita bread', quantity: 4, unit: 'pieces' },
            { name: 'Falafel', quantity: 12, unit: 'pieces' },
            { name: 'Cucumber', quantity: 1, unit: 'piece' },
            { name: 'Tomatoes', quantity: 2, unit: 'pieces' },
            { name: 'Tahini sauce', quantity: 0.5, unit: 'cup' },
            { name: 'Lettuce', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Prepare or heat falafel',
            'Dice cucumber and tomatoes',
            'Warm pita bread',
            'Cut pita to create pockets',
            'Fill with falafel, veggies, and lettuce',
            'Drizzle with tahini sauce',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Lunch',
        },
        {
          title: 'Chicken Noodle Soup',
          description: 'Comforting homemade chicken noodle soup',
          imageUrl: '/uploads/recipes/chicken-soup.jpg',
          cookingTime: 45,
          servings: 8,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Chicken breast', quantity: 500, unit: 'grams' },
            { name: 'Egg noodles', quantity: 300, unit: 'grams' },
            { name: 'Carrots', quantity: 3, unit: 'pieces' },
            { name: 'Celery', quantity: 3, unit: 'stalks' },
            { name: 'Chicken broth', quantity: 8, unit: 'cups' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
          ],
          instructions: [
            'Boil chicken in broth until cooked',
            'Remove chicken and shred',
            'Sauté onion, carrots, and celery',
            'Add vegetables to broth',
            'Add noodles and cook until tender',
            'Return chicken to pot and serve',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Lunch',
        },

        // Dinner Recipes (10)
        {
          title: 'Spaghetti Carbonara',
          description: 'Creamy Italian pasta with pancetta and parmesan',
          imageUrl: '/uploads/recipes/carbonara.jpg',
          cookingTime: 30,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Spaghetti', quantity: 400, unit: 'grams' },
            { name: 'Pancetta', quantity: 200, unit: 'grams' },
            { name: 'Eggs', quantity: 4, unit: 'pieces' },
            { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
            { name: 'Black pepper', quantity: 1, unit: 'teaspoon' },
            { name: 'Salt', quantity: 1, unit: 'pinch' },
          ],
          instructions: [
            'Cook spaghetti according to package',
            'Fry pancetta until crispy',
            'Beat eggs with parmesan and pepper',
            'Drain pasta, reserving some water',
            'Toss hot pasta with egg mixture',
            'Add pancetta and serve immediately',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Grilled Salmon with Asparagus',
          description: 'Perfectly grilled salmon with roasted asparagus',
          imageUrl: '/uploads/recipes/grilled-salmon.jpg',
          cookingTime: 25,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Salmon fillets', quantity: 4, unit: 'pieces' },
            { name: 'Asparagus', quantity: 500, unit: 'grams' },
            { name: 'Lemon', quantity: 2, unit: 'pieces' },
            { name: 'Olive oil', quantity: 3, unit: 'tablespoons' },
            { name: 'Garlic', quantity: 3, unit: 'cloves' },
            { name: 'Fresh dill', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Preheat grill to medium-high',
            'Season salmon with salt, pepper, and dill',
            'Toss asparagus with olive oil and garlic',
            'Grill salmon for 4-5 minutes per side',
            'Roast asparagus alongside salmon',
            'Serve with lemon wedges',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Beef Tacos',
          description: 'Flavorful beef tacos with all the toppings',
          imageUrl: '/uploads/recipes/beef-tacos.jpg',
          cookingTime: 30,
          servings: 6,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Ground beef', quantity: 750, unit: 'grams' },
            { name: 'Taco shells', quantity: 12, unit: 'pieces' },
            { name: 'Lettuce', quantity: 2, unit: 'cups' },
            { name: 'Tomatoes', quantity: 3, unit: 'pieces' },
            { name: 'Cheddar cheese', quantity: 2, unit: 'cups' },
            { name: 'Taco seasoning', quantity: 3, unit: 'tablespoons' },
          ],
          instructions: [
            'Brown ground beef in a skillet',
            'Add taco seasoning and water',
            'Simmer until thickened',
            'Warm taco shells',
            'Fill shells with beef',
            'Top with lettuce, tomatoes, and cheese',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Chicken Tikka Masala',
          description: 'Indian curry with tender chicken in creamy tomato sauce',
          imageUrl: '/uploads/recipes/tikka-masala.jpg',
          cookingTime: 50,
          servings: 6,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Chicken thighs', quantity: 800, unit: 'grams' },
            { name: 'Yogurt', quantity: 1, unit: 'cup' },
            { name: 'Tomato sauce', quantity: 400, unit: 'grams' },
            { name: 'Heavy cream', quantity: 1, unit: 'cup' },
            { name: 'Garam masala', quantity: 2, unit: 'tablespoons' },
            { name: 'Ginger-garlic paste', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Marinate chicken in yogurt and spices',
            'Grill or pan-fry chicken pieces',
            'Sauté onions and ginger-garlic paste',
            'Add tomato sauce and spices',
            'Stir in cream and cooked chicken',
            'Simmer and serve with rice or naan',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Margherita Pizza',
          description: 'Classic Italian pizza with fresh mozzarella and basil',
          imageUrl: '/uploads/recipes/margherita-pizza.jpg',
          cookingTime: 45,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Pizza dough', quantity: 500, unit: 'grams' },
            { name: 'Tomato sauce', quantity: 1, unit: 'cup' },
            { name: 'Fresh mozzarella', quantity: 300, unit: 'grams' },
            { name: 'Fresh basil', quantity: 0.5, unit: 'cup' },
            { name: 'Olive oil', quantity: 2, unit: 'tablespoons' },
            { name: 'Salt', quantity: 1, unit: 'pinch' },
          ],
          instructions: [
            'Preheat oven to 475°F (245°C)',
            'Roll out pizza dough',
            'Spread tomato sauce over dough',
            'Add sliced mozzarella',
            'Bake for 12-15 minutes until golden',
            'Top with fresh basil and drizzle with olive oil',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Vegetable Stir Fry',
          description: 'Colorful vegetable stir fry with savory sauce',
          imageUrl: '/uploads/recipes/stir-fry.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Mixed vegetables', quantity: 600, unit: 'grams' },
            { name: 'Soy sauce', quantity: 3, unit: 'tablespoons' },
            { name: 'Ginger', quantity: 1, unit: 'tablespoon' },
            { name: 'Garlic', quantity: 3, unit: 'cloves' },
            { name: 'Sesame oil', quantity: 2, unit: 'tablespoons' },
            { name: 'Rice', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Cook rice according to package',
            'Heat sesame oil in wok',
            'Stir-fry garlic and ginger',
            'Add vegetables and cook until tender-crisp',
            'Add soy sauce and toss',
            'Serve over rice',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Beef Stroganoff',
          description: 'Tender beef in rich creamy mushroom sauce',
          imageUrl: '/uploads/recipes/beef-stroganoff.jpg',
          cookingTime: 45,
          servings: 6,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Beef sirloin', quantity: 750, unit: 'grams' },
            { name: 'Mushrooms', quantity: 400, unit: 'grams' },
            { name: 'Sour cream', quantity: 1, unit: 'cup' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Beef broth', quantity: 1, unit: 'cup' },
            { name: 'Egg noodles', quantity: 400, unit: 'grams' },
          ],
          instructions: [
            'Slice beef into thin strips',
            'Brown beef in batches',
            'Sauté onions and mushrooms',
            'Add beef broth and simmer',
            'Stir in sour cream',
            'Serve over cooked egg noodles',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Baked Chicken Parmesan',
          description: 'Crispy breaded chicken with marinara and mozzarella',
          imageUrl: '/uploads/recipes/chicken-parm.jpg',
          cookingTime: 45,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Chicken breasts', quantity: 4, unit: 'pieces' },
            { name: 'Breadcrumbs', quantity: 2, unit: 'cups' },
            { name: 'Marinara sauce', quantity: 2, unit: 'cups' },
            { name: 'Mozzarella cheese', quantity: 2, unit: 'cups' },
            { name: 'Parmesan cheese', quantity: 0.5, unit: 'cup' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
          ],
          instructions: [
            'Pound chicken breasts to even thickness',
            'Dip in beaten eggs, then breadcrumbs',
            'Bake at 400°F for 20 minutes',
            'Top with marinara and cheeses',
            'Bake until cheese melts',
            'Serve with pasta',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Shrimp Scampi',
          description: 'Garlic butter shrimp with white wine and lemon',
          imageUrl: '/uploads/recipes/shrimp-scampi.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Large shrimp', quantity: 500, unit: 'grams' },
            { name: 'Butter', quantity: 4, unit: 'tablespoons' },
            { name: 'Garlic', quantity: 6, unit: 'cloves' },
            { name: 'White wine', quantity: 0.5, unit: 'cup' },
            { name: 'Lemon juice', quantity: 3, unit: 'tablespoons' },
            { name: 'Linguine', quantity: 400, unit: 'grams' },
          ],
          instructions: [
            'Cook linguine according to package',
            'Melt butter and sauté garlic',
            'Add shrimp and cook until pink',
            'Add white wine and lemon juice',
            'Simmer for 2 minutes',
            'Toss with pasta and serve',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dinner',
        },
        {
          title: 'Lamb Curry',
          description: 'Aromatic lamb curry with warming spices',
          imageUrl: '/uploads/recipes/lamb-curry.jpg',
          cookingTime: 90,
          servings: 6,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Lamb shoulder', quantity: 1000, unit: 'grams' },
            { name: 'Onions', quantity: 2, unit: 'pieces' },
            { name: 'Tomatoes', quantity: 3, unit: 'pieces' },
            { name: 'Curry powder', quantity: 3, unit: 'tablespoons' },
            { name: 'Coconut milk', quantity: 400, unit: 'ml' },
            { name: 'Ginger-garlic paste', quantity: 2, unit: 'tablespoons' },
          ],
          instructions: [
            'Cut lamb into cubes',
            'Brown lamb in batches',
            'Sauté onions until golden',
            'Add ginger-garlic paste and spices',
            'Add tomatoes and coconut milk',
            'Simmer for 60 minutes until tender',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Dinner',
        },

        // Dessert Recipes (8)
        {
          title: 'Chocolate Chip Cookies',
          description: 'Classic chewy chocolate chip cookies',
          imageUrl: '/uploads/recipes/choc-chip-cookies.jpg',
          cookingTime: 25,
          servings: 24,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'All-purpose flour', quantity: 2.25, unit: 'cups' },
            { name: 'Butter', quantity: 1, unit: 'cup' },
            { name: 'Brown sugar', quantity: 0.75, unit: 'cup' },
            { name: 'White sugar', quantity: 0.75, unit: 'cup' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Chocolate chips', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Cream butter and sugars',
            'Beat in eggs',
            'Mix in flour gradually',
            'Fold in chocolate chips',
            'Drop spoonfuls onto baking sheet',
            'Bake at 375°F for 12 minutes',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'New York Cheesecake',
          description: 'Rich and creamy classic cheesecake',
          imageUrl: '/uploads/recipes/cheesecake.jpg',
          cookingTime: 90,
          servings: 12,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Cream cheese', quantity: 900, unit: 'grams' },
            { name: 'Sugar', quantity: 1.25, unit: 'cups' },
            { name: 'Eggs', quantity: 4, unit: 'pieces' },
            { name: 'Sour cream', quantity: 1, unit: 'cup' },
            { name: 'Graham crackers', quantity: 2, unit: 'cups' },
            { name: 'Vanilla extract', quantity: 2, unit: 'teaspoons' },
          ],
          instructions: [
            'Make graham cracker crust',
            'Beat cream cheese and sugar',
            'Add eggs one at a time',
            'Mix in sour cream and vanilla',
            'Pour into crust',
            'Bake at 325°F for 60 minutes, then cool slowly',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Tiramisu',
          description: 'Italian coffee-flavored dessert with mascarpone',
          imageUrl: '/uploads/recipes/tiramisu.jpg',
          cookingTime: 30,
          servings: 8,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Mascarpone cheese', quantity: 500, unit: 'grams' },
            { name: 'Ladyfinger cookies', quantity: 24, unit: 'pieces' },
            { name: 'Espresso', quantity: 1.5, unit: 'cups' },
            { name: 'Eggs', quantity: 6, unit: 'pieces' },
            { name: 'Sugar', quantity: 0.75, unit: 'cup' },
            { name: 'Cocoa powder', quantity: 3, unit: 'tablespoons' },
          ],
          instructions: [
            'Whisk egg yolks and sugar',
            'Fold in mascarpone',
            'Beat egg whites to stiff peaks',
            'Gently fold egg whites into mascarpone mixture',
            'Dip ladyfingers in espresso and layer',
            'Dust with cocoa powder and refrigerate 4 hours',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Apple Pie',
          description: 'Traditional apple pie with flaky crust',
          imageUrl: '/uploads/recipes/apple-pie.jpg',
          cookingTime: 75,
          servings: 8,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Apples', quantity: 6, unit: 'pieces' },
            { name: 'Pie crust', quantity: 2, unit: 'pieces' },
            { name: 'Sugar', quantity: 0.75, unit: 'cup' },
            { name: 'Cinnamon', quantity: 2, unit: 'teaspoons' },
            { name: 'Butter', quantity: 2, unit: 'tablespoons' },
            { name: 'Lemon juice', quantity: 1, unit: 'tablespoon' },
          ],
          instructions: [
            'Peel and slice apples',
            'Toss apples with sugar, cinnamon, and lemon',
            'Line pie dish with bottom crust',
            'Fill with apple mixture and dot with butter',
            'Cover with top crust and seal edges',
            'Bake at 375°F for 50 minutes',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Chocolate Lava Cake',
          description: 'Decadent chocolate cake with molten center',
          imageUrl: '/uploads/recipes/lava-cake.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Dark chocolate', quantity: 200, unit: 'grams' },
            { name: 'Butter', quantity: 100, unit: 'grams' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Egg yolks', quantity: 2, unit: 'pieces' },
            { name: 'Sugar', quantity: 0.5, unit: 'cup' },
            { name: 'Flour', quantity: 0.25, unit: 'cup' },
          ],
          instructions: [
            'Melt chocolate and butter together',
            'Whisk eggs, yolks, and sugar',
            'Combine chocolate mixture with eggs',
            'Fold in flour',
            'Pour into greased ramekins',
            'Bake at 425°F for 12 minutes',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Crème Brûlée',
          description: 'French custard dessert with caramelized sugar top',
          imageUrl: '/uploads/recipes/creme-brulee.jpg',
          cookingTime: 60,
          servings: 6,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Heavy cream', quantity: 2, unit: 'cups' },
            { name: 'Egg yolks', quantity: 6, unit: 'pieces' },
            { name: 'Sugar', quantity: 0.5, unit: 'cup' },
            { name: 'Vanilla bean', quantity: 1, unit: 'piece' },
            { name: 'Sugar for topping', quantity: 6, unit: 'tablespoons' },
          ],
          instructions: [
            'Heat cream with vanilla bean',
            'Whisk egg yolks with sugar',
            'Slowly add hot cream to eggs',
            'Pour into ramekins',
            'Bake in water bath at 325°F for 40 minutes',
            'Chill, then top with sugar and torch',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Brownies',
          description: 'Fudgy chocolate brownies',
          imageUrl: '/uploads/recipes/brownies.jpg',
          cookingTime: 35,
          servings: 16,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Butter', quantity: 0.75, unit: 'cup' },
            { name: 'Sugar', quantity: 1.5, unit: 'cups' },
            { name: 'Eggs', quantity: 3, unit: 'pieces' },
            { name: 'Cocoa powder', quantity: 0.75, unit: 'cup' },
            { name: 'Flour', quantity: 1, unit: 'cup' },
            { name: 'Vanilla extract', quantity: 1, unit: 'teaspoon' },
          ],
          instructions: [
            'Melt butter and mix with sugar',
            'Beat in eggs and vanilla',
            'Sift in cocoa and flour',
            'Mix until just combined',
            'Pour into greased pan',
            'Bake at 350°F for 25 minutes',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Dessert',
        },
        {
          title: 'Lemon Bars',
          description: 'Tangy lemon bars with shortbread crust',
          imageUrl: '/uploads/recipes/lemon-bars.jpg',
          cookingTime: 50,
          servings: 12,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Butter', quantity: 0.5, unit: 'cup' },
            { name: 'Flour', quantity: 2, unit: 'cups' },
            { name: 'Sugar', quantity: 1.5, unit: 'cups' },
            { name: 'Eggs', quantity: 4, unit: 'pieces' },
            { name: 'Lemon juice', quantity: 0.5, unit: 'cup' },
            { name: 'Powdered sugar', quantity: 0.25, unit: 'cup' },
          ],
          instructions: [
            'Make shortbread crust with butter, flour, and sugar',
            'Bake crust at 350°F for 15 minutes',
            'Whisk eggs, sugar, and lemon juice',
            'Pour lemon mixture over crust',
            'Bake for 25 more minutes',
            'Cool and dust with powdered sugar',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Dessert',
        },

        // Appetizers (6)
        {
          title: 'Bruschetta',
          description: 'Italian appetizer with tomatoes and basil on toasted bread',
          imageUrl: '/uploads/recipes/bruschetta.jpg',
          cookingTime: 20,
          servings: 8,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Baguette', quantity: 1, unit: 'piece' },
            { name: 'Tomatoes', quantity: 4, unit: 'pieces' },
            { name: 'Garlic', quantity: 2, unit: 'cloves' },
            { name: 'Fresh basil', quantity: 0.25, unit: 'cup' },
            { name: 'Olive oil', quantity: 3, unit: 'tablespoons' },
            { name: 'Balsamic vinegar', quantity: 1, unit: 'tablespoon' },
          ],
          instructions: [
            'Slice baguette and toast',
            'Dice tomatoes finely',
            'Mix tomatoes with minced garlic, basil, and olive oil',
            'Add balsamic vinegar',
            'Rub toasted bread with garlic',
            'Top with tomato mixture',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Appetizers',
        },
        {
          title: 'Buffalo Chicken Wings',
          description: 'Spicy buffalo wings with blue cheese dip',
          imageUrl: '/uploads/recipes/buffalo-wings.jpg',
          cookingTime: 45,
          servings: 6,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Chicken wings', quantity: 1000, unit: 'grams' },
            { name: 'Buffalo sauce', quantity: 1, unit: 'cup' },
            { name: 'Butter', quantity: 0.25, unit: 'cup' },
            { name: 'Blue cheese', quantity: 0.5, unit: 'cup' },
            { name: 'Sour cream', quantity: 0.5, unit: 'cup' },
            { name: 'Celery sticks', quantity: 8, unit: 'pieces' },
          ],
          instructions: [
            'Bake wings at 400°F for 40 minutes',
            'Melt butter and mix with buffalo sauce',
            'Toss cooked wings in buffalo sauce',
            'Make blue cheese dip with sour cream',
            'Serve wings with dip and celery',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Appetizers',
        },
        {
          title: 'Spinach Artichoke Dip',
          description: 'Creamy hot dip with spinach and artichokes',
          imageUrl: '/uploads/recipes/spinach-dip.jpg',
          cookingTime: 30,
          servings: 8,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Spinach', quantity: 300, unit: 'grams' },
            { name: 'Artichoke hearts', quantity: 400, unit: 'grams' },
            { name: 'Cream cheese', quantity: 250, unit: 'grams' },
            { name: 'Sour cream', quantity: 1, unit: 'cup' },
            { name: 'Parmesan cheese', quantity: 0.5, unit: 'cup' },
            { name: 'Garlic', quantity: 2, unit: 'cloves' },
          ],
          instructions: [
            'Chop spinach and artichokes',
            'Mix cream cheese, sour cream, and parmesan',
            'Add spinach, artichokes, and garlic',
            'Transfer to baking dish',
            'Bake at 350°F for 25 minutes',
            'Serve with chips or bread',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Appetizers',
        },
        {
          title: 'Spring Rolls',
          description: 'Fresh Vietnamese spring rolls with peanut sauce',
          imageUrl: '/uploads/recipes/spring-rolls.jpg',
          cookingTime: 30,
          servings: 8,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Rice paper', quantity: 12, unit: 'sheets' },
            { name: 'Shrimp', quantity: 250, unit: 'grams' },
            { name: 'Rice noodles', quantity: 150, unit: 'grams' },
            { name: 'Lettuce', quantity: 1, unit: 'head' },
            { name: 'Fresh mint', quantity: 0.5, unit: 'cup' },
            { name: 'Peanut butter', quantity: 0.5, unit: 'cup' },
          ],
          instructions: [
            'Cook shrimp and rice noodles',
            'Soak rice paper in warm water',
            'Place lettuce, noodles, shrimp, and mint on rice paper',
            'Roll tightly',
            'Make peanut sauce',
            'Serve rolls with peanut dipping sauce',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Appetizers',
        },
        {
          title: 'Stuffed Mushrooms',
          description: 'Mushroom caps stuffed with cheese and breadcrumbs',
          imageUrl: '/uploads/recipes/stuffed-mushrooms.jpg',
          cookingTime: 35,
          servings: 12,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Large mushrooms', quantity: 24, unit: 'pieces' },
            { name: 'Cream cheese', quantity: 200, unit: 'grams' },
            { name: 'Parmesan cheese', quantity: 0.5, unit: 'cup' },
            { name: 'Breadcrumbs', quantity: 0.5, unit: 'cup' },
            { name: 'Garlic', quantity: 3, unit: 'cloves' },
            { name: 'Fresh parsley', quantity: 0.25, unit: 'cup' },
          ],
          instructions: [
            'Remove mushroom stems and chop',
            'Mix cream cheese, parmesan, breadcrumbs, and garlic',
            'Add chopped stems',
            'Stuff mushroom caps with mixture',
            'Bake at 375°F for 25 minutes',
            'Garnish with parsley',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Appetizers',
        },
        {
          title: 'Guacamole',
          description: 'Fresh homemade guacamole with lime and cilantro',
          imageUrl: '/uploads/recipes/guacamole.jpg',
          cookingTime: 10,
          servings: 6,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Avocados', quantity: 4, unit: 'pieces' },
            { name: 'Lime juice', quantity: 2, unit: 'tablespoons' },
            { name: 'Tomato', quantity: 1, unit: 'piece' },
            { name: 'Red onion', quantity: 0.25, unit: 'cup' },
            { name: 'Fresh cilantro', quantity: 0.25, unit: 'cup' },
            { name: 'Jalapeño', quantity: 1, unit: 'piece' },
          ],
          instructions: [
            'Mash avocados in bowl',
            'Add lime juice',
            'Dice tomato, onion, and jalapeño',
            'Mix in vegetables and cilantro',
            'Season with salt',
            'Serve with tortilla chips',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Appetizers',
        },

        // Vegetarian/Vegan (6)
        {
          title: 'Lentil Soup',
          description: 'Hearty vegetarian lentil soup',
          imageUrl: '/uploads/recipes/lentil-soup.jpg',
          cookingTime: 45,
          servings: 8,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Red lentils', quantity: 2, unit: 'cups' },
            { name: 'Carrots', quantity: 3, unit: 'pieces' },
            { name: 'Celery', quantity: 3, unit: 'stalks' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Vegetable broth', quantity: 6, unit: 'cups' },
            { name: 'Cumin', quantity: 2, unit: 'teaspoons' },
          ],
          instructions: [
            'Sauté onion, carrots, and celery',
            'Add lentils and broth',
            'Add cumin and other spices',
            'Simmer for 30 minutes',
            'Blend partially for creamy texture',
            'Serve hot with crusty bread',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Vegetarian',
        },
        {
          title: 'Veggie Burger',
          description: 'Homemade black bean veggie burger',
          imageUrl: '/uploads/recipes/veggie-burger.jpg',
          cookingTime: 30,
          servings: 6,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Black beans', quantity: 400, unit: 'grams' },
            { name: 'Breadcrumbs', quantity: 1, unit: 'cup' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Garlic', quantity: 2, unit: 'cloves' },
            { name: 'Egg', quantity: 1, unit: 'piece' },
            { name: 'Burger buns', quantity: 6, unit: 'pieces' },
          ],
          instructions: [
            'Mash black beans',
            'Sauté onion and garlic',
            'Mix beans, onion, breadcrumbs, and egg',
            'Form into patties',
            'Pan-fry or grill patties',
            'Serve on buns with toppings',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Vegetarian',
        },
        {
          title: 'Tofu Stir Fry',
          description: 'Crispy tofu with vegetables in Asian sauce',
          imageUrl: '/uploads/recipes/tofu-stir-fry.jpg',
          cookingTime: 25,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Firm tofu', quantity: 400, unit: 'grams' },
            { name: 'Mixed vegetables', quantity: 500, unit: 'grams' },
            { name: 'Soy sauce', quantity: 3, unit: 'tablespoons' },
            { name: 'Ginger', quantity: 1, unit: 'tablespoon' },
            { name: 'Sesame oil', quantity: 2, unit: 'tablespoons' },
            { name: 'Rice', quantity: 2, unit: 'cups' },
          ],
          instructions: [
            'Press and cube tofu',
            'Pan-fry tofu until crispy',
            'Set tofu aside',
            'Stir-fry vegetables with ginger',
            'Add tofu back and toss with soy sauce',
            'Serve over rice',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Vegan',
        },
        {
          title: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil salad',
          imageUrl: '/uploads/recipes/caprese.jpg',
          cookingTime: 10,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Fresh mozzarella', quantity: 400, unit: 'grams' },
            { name: 'Tomatoes', quantity: 4, unit: 'pieces' },
            { name: 'Fresh basil', quantity: 0.5, unit: 'cup' },
            { name: 'Olive oil', quantity: 3, unit: 'tablespoons' },
            { name: 'Balsamic glaze', quantity: 2, unit: 'tablespoons' },
            { name: 'Salt', quantity: 1, unit: 'pinch' },
          ],
          instructions: [
            'Slice tomatoes and mozzarella',
            'Arrange alternating slices on plate',
            'Tuck basil leaves between slices',
            'Drizzle with olive oil',
            'Add balsamic glaze',
            'Season with salt and pepper',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Vegetarian',
        },
        {
          title: 'Mushroom Risotto',
          description: 'Creamy Italian rice dish with mushrooms',
          imageUrl: '/uploads/recipes/mushroom-risotto.jpg',
          cookingTime: 40,
          servings: 4,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Arborio rice', quantity: 1.5, unit: 'cups' },
            { name: 'Mushrooms', quantity: 400, unit: 'grams' },
            { name: 'Vegetable broth', quantity: 6, unit: 'cups' },
            { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
            { name: 'White wine', quantity: 0.5, unit: 'cup' },
            { name: 'Butter', quantity: 3, unit: 'tablespoons' },
          ],
          instructions: [
            'Sauté mushrooms and set aside',
            'Toast rice in butter',
            'Add wine and stir until absorbed',
            'Add broth one ladle at a time, stirring constantly',
            'Continue until rice is creamy',
            'Stir in mushrooms and parmesan',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Vegetarian',
        },
        {
          title: 'Falafel Bowl',
          description: 'Middle Eastern falafel bowl with hummus and veggies',
          imageUrl: '/uploads/recipes/falafel-bowl.jpg',
          cookingTime: 40,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Chickpeas', quantity: 400, unit: 'grams' },
            { name: 'Parsley', quantity: 1, unit: 'cup' },
            { name: 'Garlic', quantity: 4, unit: 'cloves' },
            { name: 'Cumin', quantity: 2, unit: 'teaspoons' },
            { name: 'Hummus', quantity: 1, unit: 'cup' },
            { name: 'Mixed vegetables', quantity: 3, unit: 'cups' },
          ],
          instructions: [
            'Blend chickpeas, parsley, garlic, and spices',
            'Form into balls',
            'Bake or fry falafel',
            'Prepare bowl with fresh vegetables',
            'Add falafel and hummus',
            'Drizzle with tahini sauce',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Vegan',
        },

        // More International Cuisine (7)
        {
          title: 'Pad Thai',
          description: 'Classic Thai noodle dish with tamarind sauce',
          imageUrl: '/uploads/recipes/pad-thai.jpg',
          cookingTime: 30,
          servings: 4,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Rice noodles', quantity: 300, unit: 'grams' },
            { name: 'Shrimp', quantity: 300, unit: 'grams' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Bean sprouts', quantity: 2, unit: 'cups' },
            { name: 'Tamarind paste', quantity: 3, unit: 'tablespoons' },
            { name: 'Peanuts', quantity: 0.5, unit: 'cup' },
          ],
          instructions: [
            'Soak rice noodles',
            'Cook shrimp',
            'Scramble eggs in wok',
            'Add noodles and tamarind sauce',
            'Toss with shrimp and bean sprouts',
            'Top with crushed peanuts',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Asian',
        },
        {
          title: 'Beef Enchiladas',
          description: 'Mexican rolled tortillas with beef and cheese',
          imageUrl: '/uploads/recipes/enchiladas.jpg',
          cookingTime: 45,
          servings: 6,
          difficulty: Difficulty.MEDIUM,
          ingredients: [
            { name: 'Ground beef', quantity: 500, unit: 'grams' },
            { name: 'Tortillas', quantity: 12, unit: 'pieces' },
            { name: 'Enchilada sauce', quantity: 3, unit: 'cups' },
            { name: 'Cheddar cheese', quantity: 3, unit: 'cups' },
            { name: 'Onion', quantity: 1, unit: 'piece' },
            { name: 'Sour cream', quantity: 1, unit: 'cup' },
          ],
          instructions: [
            'Brown ground beef with onion',
            'Warm tortillas',
            'Fill tortillas with beef and cheese',
            'Roll and place in baking dish',
            'Pour enchilada sauce over top',
            'Bake at 350°F for 25 minutes',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Mexican',
        },
        {
          title: 'Chicken Fried Rice',
          description: 'Chinese-style fried rice with chicken and vegetables',
          imageUrl: '/uploads/recipes/fried-rice.jpg',
          cookingTime: 20,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Cooked rice', quantity: 4, unit: 'cups' },
            { name: 'Chicken breast', quantity: 300, unit: 'grams' },
            { name: 'Eggs', quantity: 2, unit: 'pieces' },
            { name: 'Mixed vegetables', quantity: 2, unit: 'cups' },
            { name: 'Soy sauce', quantity: 3, unit: 'tablespoons' },
            { name: 'Green onions', quantity: 4, unit: 'pieces' },
          ],
          instructions: [
            'Cook and dice chicken',
            'Scramble eggs and set aside',
            'Stir-fry vegetables',
            'Add rice and chicken',
            'Add soy sauce and eggs',
            'Garnish with green onions',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Asian',
        },
        {
          title: 'Lasagna',
          description: 'Classic Italian layered pasta with meat sauce',
          imageUrl: '/uploads/recipes/lasagna.jpg',
          cookingTime: 90,
          servings: 8,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Lasagna noodles', quantity: 400, unit: 'grams' },
            { name: 'Ground beef', quantity: 500, unit: 'grams' },
            { name: 'Ricotta cheese', quantity: 500, unit: 'grams' },
            { name: 'Mozzarella cheese', quantity: 3, unit: 'cups' },
            { name: 'Marinara sauce', quantity: 4, unit: 'cups' },
            { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
          ],
          instructions: [
            'Cook lasagna noodles',
            'Brown ground beef and mix with marinara',
            'Layer noodles, meat sauce, ricotta, and mozzarella',
            'Repeat layers',
            'Top with parmesan',
            'Bake at 375°F for 45 minutes',
          ],
          authorId: createdUsers[0]._id.toString(),
          category: 'Italian',
        },
        {
          title: 'Sushi Rolls',
          description: 'Homemade California rolls',
          imageUrl: '/uploads/recipes/sushi.jpg',
          cookingTime: 45,
          servings: 6,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Sushi rice', quantity: 3, unit: 'cups' },
            { name: 'Nori sheets', quantity: 6, unit: 'pieces' },
            { name: 'Crab meat', quantity: 300, unit: 'grams' },
            { name: 'Avocado', quantity: 2, unit: 'pieces' },
            { name: 'Cucumber', quantity: 1, unit: 'piece' },
            { name: 'Rice vinegar', quantity: 3, unit: 'tablespoons' },
          ],
          instructions: [
            'Cook and season sushi rice',
            'Place nori on bamboo mat',
            'Spread rice on nori',
            'Add fillings in a line',
            'Roll tightly using mat',
            'Slice and serve with soy sauce',
          ],
          authorId: createdUsers[1]._id.toString(),
          category: 'Asian',
        },
        {
          title: 'Chicken Fajitas',
          description: 'Sizzling chicken fajitas with peppers and onions',
          imageUrl: '/uploads/recipes/fajitas.jpg',
          cookingTime: 30,
          servings: 4,
          difficulty: Difficulty.EASY,
          ingredients: [
            { name: 'Chicken breast', quantity: 600, unit: 'grams' },
            { name: 'Bell peppers', quantity: 3, unit: 'pieces' },
            { name: 'Onion', quantity: 2, unit: 'pieces' },
            { name: 'Fajita seasoning', quantity: 3, unit: 'tablespoons' },
            { name: 'Tortillas', quantity: 8, unit: 'pieces' },
            { name: 'Lime', quantity: 2, unit: 'pieces' },
          ],
          instructions: [
            'Slice chicken and vegetables',
            'Season chicken with fajita seasoning',
            'Cook chicken in hot skillet',
            'Add peppers and onions',
            'Warm tortillas',
            'Serve with lime wedges and toppings',
          ],
          authorId: createdUsers[2]._id.toString(),
          category: 'Mexican',
        },
        {
          title: 'Ramen Bowl',
          description: 'Japanese ramen with soft-boiled egg and pork',
          imageUrl: '/uploads/recipes/ramen.jpg',
          cookingTime: 60,
          servings: 4,
          difficulty: Difficulty.HARD,
          ingredients: [
            { name: 'Ramen noodles', quantity: 400, unit: 'grams' },
            { name: 'Pork belly', quantity: 400, unit: 'grams' },
            { name: 'Eggs', quantity: 4, unit: 'pieces' },
            { name: 'Chicken broth', quantity: 8, unit: 'cups' },
            { name: 'Green onions', quantity: 4, unit: 'pieces' },
            { name: 'Nori sheets', quantity: 4, unit: 'pieces' },
          ],
          instructions: [
            'Cook pork belly until tender',
            'Prepare soft-boiled eggs',
            'Make rich broth',
            'Cook ramen noodles',
            'Assemble bowls with broth and noodles',
            'Top with pork, eggs, green onions, and nori',
          ],
          authorId: createdUsers[3]._id.toString(),
          category: 'Asian',
        },
      ];

      createdRecipes = await recipeModel.insertMany(recipes);
      console.log(`✅ Successfully seeded ${createdRecipes.length} recipes!`);
    } else {
      console.log(`ℹ️  Skipping recipes (${recipeCount} already exist)`);
      createdRecipes = await recipeModel.find().exec();
    }

    // Seed ratings
    const ratingCount = await ratingModel.countDocuments();
    if (ratingCount === 0 && createdRecipes.length > 0) {
      const ratings = [];
      // Create diverse ratings
      for (let i = 0; i < createdRecipes.length; i++) {
        const recipe = createdRecipes[i];
        // Each recipe gets 3-8 random ratings
        const numRatings = Math.floor(Math.random() * 6) + 3;
        for (let j = 0; j < numRatings && j < createdUsers.length; j++) {
          ratings.push({
            recipeId: recipe._id.toString(),
            userId: createdUsers[j]._id.toString(),
            rating: Math.floor(Math.random() * 3) + 3, // ratings from 3-5
          });
        }
      }
      await ratingModel.insertMany(ratings);
      console.log(`✅ Successfully seeded ${ratings.length} ratings!`);
    } else {
      console.log(`ℹ️  Skipping ratings (${ratingCount} already exist)`);
    }

    // Seed favorites
    const favoriteCount = await favoriteModel.countDocuments();
    if (favoriteCount === 0 && createdRecipes.length > 0) {
      const favorites = [];
      // Each user favorites 10-20 random recipes
      for (const user of createdUsers) {
        const numFavorites = Math.floor(Math.random() * 11) + 10;
        const shuffled = [...createdRecipes].sort(() => 0.5 - Math.random());
        const selectedRecipes = shuffled.slice(0, numFavorites);

        for (const recipe of selectedRecipes) {
          favorites.push({
            userId: user._id.toString(),
            recipeId: recipe._id.toString(),
          });
        }
      }
      await favoriteModel.insertMany(favorites);
      console.log(`✅ Successfully seeded ${favorites.length} favorites!`);
    } else {
      console.log(`ℹ️  Skipping favorites (${favoriteCount} already exist)`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${await userModel.countDocuments()}`);
    console.log(`   Categories: ${await recipeCategoryModel.countDocuments()}`);
    console.log(`   Recipes: ${await recipeModel.countDocuments()}`);
    console.log(`   Ratings: ${await ratingModel.countDocuments()}`);
    console.log(`   Favorites: ${await favoriteModel.countDocuments()}`);
    console.log(`   Exercises: ${await availableExerciseModel.countDocuments()}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seed();
