
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function runVerification() {
  console.log('Starting verification...');

  // 1. Trigger the logic via API (Simulating Frontend)
  console.log('1. Sending POST request to create lead (triggers auto-admin creation)...');
  try {
    const response = await axios.post('http://localhost:3000/crm/leads', {
        name: 'Verification Bot',
        email: 'bot@verification.com',
        phone: '0000000000',
        budget: 0,
        userId: 'demo-user-id' 
    });
    console.log('   API Response Status:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
        console.error('   ERROR: API is not running on localhost:3000. Please run "npm run start:api" first.');
        process.exit(1);
    }
    console.error('   API Request failed:', error.message);
    if (error.response) {
        console.error('   Response Status:', error.response.status);
        console.error('   Response Data:', JSON.stringify(error.response.data));
    }
    // Proceeding anyway to check DB, may be useful debugging
  }

  // 2. Verify Database State
  console.log('2. checking Database for Admin User...');
  const adminEmail = 'infoservicos@imovelintel.com';
  const user = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!user) {
    console.error(`   FAIL: User ${adminEmail} NOT found in database.`);
    process.exit(1);
  } else {
    console.log(`   SUCCESS: User ${adminEmail} found!`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Role: ${user.role}`);
    
    if (user.role !== 'ADMIN') {
        console.error('   FAIL: Role is not ADMIN.');
    } else {
        console.log('   SUCCESS: Role is ADMIN.');
    }

    // 3. Verify Password Hash
    console.log('3. Verifying Password Hash...');
    const isMatch = await bcrypt.compare('14082025Eu*', user.passwordHash);
    if (isMatch) {
        console.log('   SUCCESS: Password hash matches "14082025Eu*".');
    } else {
        console.error('   FAIL: Password hash does NOT match.');
    }
  }

  // Clean up test lead? (Optional, skipping for safety)
}

runVerification()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
