import { connect, set } from 'mongoose';
import { UserModel } from '../models/user.model.js';
import { FoodModel } from '../models/food.model.js';
import { sample_users, sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';

const PASSWORD_HASH_SALT_ROUNDS = 10;
set('strictQuery', true);

export const dbconnect = async () => {
  try {
    // Verify environment variable
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is not defined in .env');
    
    console.log('Connecting to MongoDB...');
    await connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    await seedUsers();
    await seedFoods();
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
};

async function seedUsers() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) {
    console.log('⏩ Users seed already done');
    return;
  }

  for (let user of sample_users) {
    // Completely remove any existing id fields
    const userToCreate = {
      name: user.name,
      email: user.email,
      password: await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS),
      address: user.address,
      isAdmin: user.isAdmin
    };
    
    await UserModel.create(userToCreate);
  }
  console.log('🌱 Users seeded successfully');
}

async function seedFoods() {
  const foodsCount = await FoodModel.countDocuments();
  if (foodsCount > 0) {
    console.log('⏩ Foods seed already done');
    return;
  }

  for (const food of sample_foods) {
    // Let MongoDB generate _id automatically
    const foodToCreate = {
      name: food.name,
      price: food.price,
      cookTime: food.cookTime,
      favorite: food.favorite,
      origins: food.origins,
      stars: food.stars,
      imageUrl: `/foods/${food.imageUrl}`,
      tags: food.tags
    };
    
    await FoodModel.create(foodToCreate);
  }
  console.log('🌱 Foods seeded successfully');
}