// src/analysis/analysis.controller.ts
@Post()
async createAnalysis(@Request() req, @Body() dto: any) {
  // 1. Create a "Pending" record in the DB
  const analysis = await this.analysisService.createPending(req.user.orgId);

  // 2. Hand off the work to the background queue
  await this.analysisProducer.startAnalysisTask(analysis.id, dto.s3Key, dto.frameworks);

  // 3. Return immediately
  return {
    message: "Analysis started. You will be notified when the report is ready.",
    analysisId: analysis.id,
    status: 'processing'
  };
}
