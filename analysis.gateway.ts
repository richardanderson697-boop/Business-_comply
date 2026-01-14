// src/analysis/gateways/analysis.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../../auth/guards/ws-jwt.guard';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'analysis' })
export class AnalysisGateway {
  @WebSocketServer() server: Server;

  // Users join a "room" named after their OrgID so they only see their own updates
  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-org-updates')
  handleJoinRoom(client: Socket, orgId: string) {
    client.join(`org-${orgId}`);
  }

  // Helper to send progress to a specific organization
  sendProgress(orgId: string, data: { analysisId: string; progress: number; message: string }) {
    this.server.to(`org-${orgId}`).emit('analysis-progress', data);
  }
}
