// src/analysis/queues/analysis.producer.ts
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AnalysisProducer {
  constructor(@InjectQueue('compliance-analysis') private analysisQueue: Queue) {}

  async startAnalysisTask(analysisId: string, s3Key: string, frameworks: string[]) {
    // We "fire and forget" here. The API returns a 202 Accepted immediately.
    await this.analysisQueue.add('process-rag', {
      analysisId,
      s3Key,
      frameworks
    }, {
      attempts: 3, // Retry if the AI API fails
      backoff: { type: 'exponential', delay: 5000 }
    });
  }
}
