// src/pdf/pdf.controller.ts
@UseGuards(JwtAuthGuard, SubscriptionGuard) // Layer 1: Logged in? Layer 2: Paid?
@Controller('pdf')
export class PDFController {
  @Post('generate/:id')
  async generate(@Param('id') id: string, @Request() req) {
    // req.user.orgId is automatically populated from the JWT payload
    return this.pdfService.generateReport(id, req.user.orgId);
  }
}
