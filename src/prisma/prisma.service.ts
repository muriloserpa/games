import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { queryGPT } from 'prisma-gpt';

const createPrismaClient = () => {
  const prisma = new PrismaClient();
  return prisma.$extends(
    queryGPT({
      db: 'sqlite',
      model: 'gpt-3.5-turbo',
    }),
  );
};

export type CustomPrismaClient = ReturnType<typeof createPrismaClient>;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public prismaExt: CustomPrismaClient;
  constructor() {
    super();
    this.prismaExt = this.$extends(
      queryGPT({ db: 'sqlite', model: 'gpt-3.5-turbo' }),
    );
  }
  async onModuleInit() {
    await this.$connect();
    await this.prismaExt.$connect();
  }
}
