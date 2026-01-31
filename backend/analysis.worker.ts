// src/analysis/queues/analysis.worker.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('compliance-analysis')
export class AnalysisWorker extends WorkerHost {
  constructor(
    private aiAnalysisService: AIAnalysisService, // Phase 2
    private analysisService: AnalysisService,
    private pdfService: PDFGeneratorService      // Phase 3
  ) {}

  async process(job: Job<any>): Promise<any> {
    const { analysisId, s3Key, frameworks } = job.data;

    try {
      // 1. Mark status as 'processing' in DB
      await this.analysisService.updateStatus(analysisId, 'processing');

      // 2. RUN THE RAG (Phase 2 code you provided)
      const results = await this.aiAnalysisService.analyzeCompliance(s3Key, frameworks);

      // 3. Save findings to DB
      await this.analysisService.saveResults(analysisId, results);

      // 4. TRIGGER THE PDF GENERATION (Phase 3 code you provided)
      const pdfS3Key = await this.pdfService.generateComplianceReport(results);
      
      // 5. Finalize
      await this.analysisService.updateStatus(analysisId, 'completed', pdfS3Key);

    } catch (error) {
      await this.analysisService.updateStatus(analysisId, 'failed');
      throw error; // BullMQ will handle the retry
    }
  }
}
