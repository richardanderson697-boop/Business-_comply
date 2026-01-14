// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private orgService: OrganizationsService,
    private stripeService: StripeService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Create the Organization first
    const organization = await this.orgService.create({
      name: dto.organizationName,
    });

    // 3. Register the Organization as a Customer in Stripe
    const stripeCustomer = await this.stripeService.createCustomer(
      dto.email,
      dto.organizationName
    );

    // 4. Update Org with Stripe ID
    await this.orgService.update(organization.id, {
      stripeCustomerId: stripeCustomer.id,
      subscriptionStatus: 'incomplete', // Will become 'active' after payment
    });

    // 5. Hash password and Create the User linked to the Org
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      organizationId: organization.id,
      role: 'admin', // First user is the admin
    });

    // 6. Issue JWT immediately so they are logged in
    const payload = { sub: user.id, email: user.email, orgId: organization.id };
    
    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        organizationId: organization.id,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
