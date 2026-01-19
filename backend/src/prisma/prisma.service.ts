import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
  log: ['query', 'info', 'warn', 'error'], // optional
});
  }
 
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {  
    await this.$disconnect();
  }
}

/*Ask yourself:

Can I insert an order and outbox event atomically? → Yes

Can I reprocess unprocessed events after a crash? → Yes

Can duplicate client requests be blocked? → Yes

Can I audit failures later? → Yes */