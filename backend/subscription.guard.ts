// src/auth/guards/subscription.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { OrganizationsService } from '../../organizations/organizations.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private orgService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Populated by JwtAuthGuard

    if (!user || !user.orgId) return false;

    const organization = await this.orgService.findById(user.orgId);

    // Only allow 'active' or 'trialing' statuses
    const allowedStatuses = ['active', 'trialing'];
    
    if (!allowedStatuses.includes(organization.subscriptionStatus)) {
      throw new HttpException({
        status: HttpStatus.PAYMENT_REQUIRED,
        error: 'Subscription Required',
        message: 'Your current plan does not allow access to this feature.',
      }, HttpStatus.PAYMENT_REQUIRED);
    }

    return true;
  }
}
