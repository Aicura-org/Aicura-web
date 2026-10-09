import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

async function main() {
  console.log('🔒 Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const email = 'admin@aicuradiagnostics.com';
    const newPassword = 'Aicura@2620!';
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await prisma.adminUser.upsert({
      where: { email },
      update: {
        passwordHash,
      },
      create: {
        email,
        name: 'Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    console.log(`✅ Successfully updated password for: ${user.email}`);

    const isValid = await bcrypt.compare(newPassword, user.passwordHash);
    if (isValid) {
      console.log('✅ Password verification check PASSED!');
      console.log(`New credentials: Email: ${email} | Password: ${newPassword}`);
    } else {
      console.error('❌ Password verification check FAILED!');
    }
  } catch (error) {
    console.error('❌ Failed to update password:', error);
  } finally {
    await pool.end();
  }
}

main();
