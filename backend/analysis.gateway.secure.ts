// src/analysis/gateways/analysis.gateway.ts
@WebSocketGateway({ 
  cors: { origin: '*' }, 
  transports: ['websocket'], // Faster, more stable
})
export class AnalysisGateway {
  @WebSocketServer() server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-org-updates')
  async handleJoinRoom(client: any, orgId: string) {
    // FIX 1: SECURITY VERIFICATION
    // Check if the orgId the user wants to join is the one they actually belong to
    if (client.user.orgId !== orgId) {
      return { event: 'error', data: 'Unauthorized access to organization data.' };
    }

    client.join(`org-${orgId}`);

    // FIX 2: CONNECTION RESILIENCE (SYNC)
    // Immediately send the latest status from the DB so the UI isn't at 0%
    const latestStatus = await this.analysisService.getLatestProgress(orgId);
    return { event: 'sync-status', data: latestStatus };
  }
}
