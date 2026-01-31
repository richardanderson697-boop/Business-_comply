// src/pdf/pdf.controller.ts
@Controller('pdf')
@UseGuards(JwtAuthGuard, SubscriptionGuard) // Secure + Paid
export class PDFController {
  // ... all routes here are now protected by the "Paywall"
}
