// main.ts
const app = await NestFactory.create(AppModule, {
  rawBody: true, // This is essential for Stripe Signature Verification
});
