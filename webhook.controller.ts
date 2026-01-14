// src/billing/controllers/webhook.controller.ts
import { Controller, Post, Headers, Req, BadRequestException, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from '../services/stripe.service';
import { OrganizationsService } from '../../organizations/organizations.service';

@Controller('webhooks/stripe')
export class WebhookController {
  constructor(
    private stripeService: StripeService,
    private orgService: OrganizationsService
  ) {}

  @Post()
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    let event;

    try {
      // Verify signature using the rawBody
      event = this.stripeService.constructEvent(req.rawBody, sig);
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await this.handleSubscriptionCreated(session);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await this.handleSubscriptionCanceled(subscription);
        break;

      // Add other cases like 'invoice.payment_failed' as needed
    }

    return { received: true };
  }

  private async handleSubscriptionCreated(session: any) {
    const customerId = session.customer;
    // Find organization by stripeCustomerId and mark as active
    await this.orgService.updateByStripeId(customerId, {
      subscriptionStatus: 'active',
      planTier: 'pro',
    });
  }

  private async handleSubscriptionCanceled(subscription: any) {
    const customerId = subscription.customer;
    await this.orgService.updateByStripeId(customerId, {
      subscriptionStatus: 'canceled',
    });
  }
}
