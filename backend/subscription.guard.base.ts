// src/auth/guards/subscription.guard.ts
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private reflector: Reflector, private orgService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const org = await this.orgService.findById(user.orgId);

    if (org.subscriptionStatus !== 'active') {
      throw new HttpException('Subscription required', HttpStatus.PAYMENT_REQUIRED);
    }
    return true;
  }
}
