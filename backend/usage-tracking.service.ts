// src/admin/services/usage-tracking.service.ts
@Injectable()
export class UsageTrackingService {
  constructor(private auditRepo: Repository<AILog>) {}

  async logAIRequest(orgId: string, model: string, tokens: number) {
    const costPerThousand = model.includes('sonnet') ? 0.003 : 0.015; // Current Claude Pricing
    const totalCost = (tokens / 1000) * costPerThousand;

    await this.auditRepo.save({
      orgId,
      model,
      tokensUsed: tokens,
      estimatedCost: totalCost,
      timestamp: new Date()
    });
  }
}
