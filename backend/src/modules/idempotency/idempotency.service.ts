//Middleware/guard that validates request keys before execution
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { IdempotencyGuard } from './idempotency.guard'; 
@Injectable()
export class IdempotencyService implements CanActivate {
  private idempotencyGuard = new IdempotencyGuard();  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['idempotency-key'];
        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required');
        }  
        const isDuplicate = this.idempotencyGuard.isDuplicate(idempotencyKey);
        if (isDuplicate) {
            throw new BadRequestException('Duplicate request');
        }
        return true;
    }
}