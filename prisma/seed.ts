import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: await bcrypt.hash('admin', 10),
      role: 'ADMIN',
      games: {
        create: [
          {
            name: 'Pong',
            description: 'Classic pong game',
            status: 'PLAYING',
            rate: 1,
          },
          {
            name: 'Snake',
            description: 'Classic snake game',
            status: 'FINISHED',
            rate: 8,
          },
        ],
      },
    },
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@user.com' },
    update: {},
    create: {
      email: 'user@user.com',
      name: 'User',
      password: await bcrypt.hash('admin', 10),
      role: 'USER',
      games: {
        create: [
          {
            name: 'Counter Strike',
            description: 'Classic CS game',
            status: 'PLAYING',
            rate: 10,
          },
          {
            name: 'Elden Ring',
            description: 'Classic Elden Ring game',
            status: 'DROPPED',
            rate: 6,
          },
        ],
      },
    },
  });
  console.log({ admin, user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
