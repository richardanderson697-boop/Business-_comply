// src/billing/billing.controller.ts
@Controller('billing')
@UseGuards(JwtAuthGuard) // Only logged-in users can buy a subscription
export class BillingController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout')
  async createCheckout(@Body('priceId') priceId: string, @Request() req) {
    // We get the orgId from the JWT token (req.user)
    const session = await this.stripeService.createSubscriptionSession(
      req.user.stripeCustomerId, 
      priceId
    );
    
    return { url: session.url };
  }
}
