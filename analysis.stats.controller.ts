// src/analysis/analysis.controller.ts
@Get('dashboard-stats')
@UseGuards(JwtAuthGuard)
async getDashboardStats(@Request() req) {
  const orgId = req.user.orgId;
  
  return {
    stats: await this.analysisService.getOrgStats(orgId),
    recentAnalyses: await this.analysisService.findRecentByOrg(orgId),
    activeFrameworks: await this.orgService.getActiveFrameworks(orgId),
  };
}
