// src/analysis/queues/analysis.worker.ts
async process(job: Job<any>): Promise<any> {
  const { analysisId, orgId, s3Key, frameworks } = job.data;

  const emit = (progress: number, message: string) => {
    this.gateway.sendProgress(orgId, { analysisId, progress, message });
  };

  try {
    emit(10, 'Initializing AI audit engine...');
    
    emit(30, 'Extracting text and generating embeddings...');
    const context = await this.docProcessor.processFile(s3Key);

    emit(60, 'Consulting vector database for regulatory requirements...');
    const rules = await this.vectorService.searchRelevantRules(context, frameworks);

    emit(80, 'Claude is performing agentic gap analysis...');
    const results = await this.aiAnalysisService.analyzeRulesWithAgent(context, rules);

    emit(95, 'Finalizing PDF report generation...');
    const pdfUrl = await this.pdfService.generateComplianceReport(results);

    emit(100, 'Analysis complete!');
    return { pdfUrl };
    
  } catch (error) {
    emit(-1, 'Analysis failed. Please check your document format.');
    throw error;
  }
}
