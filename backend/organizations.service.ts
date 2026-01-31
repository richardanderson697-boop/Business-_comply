// src/organizations/organizations.service.ts
async updateSubscription(stripeCustomerId: string, status: string, plan: string) {
  const org = await this.repo.findOne({ where: { stripeCustomerId } });
  if (org) {
    org.subscriptionStatus = status; // e.g., 'active'
    org.planTier = plan;
    await this.repo.save(org);
  }
}
