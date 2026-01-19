import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  createOrder(payload: any) {
    // Placeholder for now
    // Later: insert into DB + outbox transaction
    
    return { success: true, payload };
  }
}
