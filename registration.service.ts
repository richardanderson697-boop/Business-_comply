// src/auth/services/auth.service.ts
@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // 2. Create Organization
    const org = await this.orgService.create({ name: dto.orgName });
    
    // 3. Create Stripe Customer
    const customer = await this.stripeService.createCustomer(dto.email, dto.orgName);
    await this.orgService.update(org.id, { stripeCustomerId: customer.id });

    // 4. Create User
    return this.usersService.create({
      ...dto,
      password: hashedPassword,
      organizationId: org.id
    });
  }
}
