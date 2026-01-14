// src/analysis/analysis.service.ts

async finalizeAndPrint(analysisId: string) {
  // 1. Get the RAG findings we just generated in Phase 2
  const analysis = await this.complianceAnalysisRepo.findOne(analysisId);
  
  // 2. Format the data to match your Phase 3 Handlebars templates
  const reportData = {
    organizationName: analysis.organization.name,
    score: analysis.overallComplianceScore,
    summary: analysis.executiveSummary,
    findings: analysis.findings.map(f => ({
      title: f.ruleName,
      status: f.status,
      evidence: f.evidence.join(' '),
      recommendation: f.recommendations[0]
    }))
  };

  // 3. Call your original Phase 3 PDF service
  return await this.pdfGeneratorService.generateComplianceReport(reportData);
}
