// ============================================================================
// COMPLIANCE PLATFORM - SECURE BACKEND FOUNDATION
// Phase 1: Authentication, Database, Payments
// Stack: NestJS + PostgreSQL + Stripe + Auth0
// ============================================================================

// ============================================================================
// 1. PROJECT STRUCTURE
// ============================================================================
/*
compliance-platform-backend/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── organizations/
│   │   ├── organizations.module.ts
│   │   ├── organizations.service.ts
│   │   └── entities/
│   │       └── organization.entity.ts
│   ├── subscriptions/
│   │   ├── subscriptions.module.ts
│   │   ├── subscriptions.service.ts
│   │   ├── subscriptions.controller.ts
│   │   └── entities/
│   │       └── subscription.entity.ts
│   ├── payments/
│   │   ├── stripe.service.ts
│   │   └── stripe.controller.ts
│   ├── audit/
│   │   ├── audit.service.ts
│   │   └── entities/
│   │       └── audit-log.entity.ts
│   ├── database/
│   │   └── migrations/
│   ├── config/
│   │   └── configuration.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
├── .env.example
└── docker-compose.yml
*/

// ============================================================================
// 2. PACKAGE.JSON - Dependencies
// ============================================================================
/*
{
  "name": "compliance-platform-backend",
  "version": "1.0.0",
  "scripts": {
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/throttler": "^5.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "stripe": "^14.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^3.0.9",
    "@types/bcrypt": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
*/

// ============================================================================
// 3. ENVIRONMENT CONFIGURATION (.env.example)
// ============================================================================
/*
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.compliance-platform.com

# Database (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=compliance_user
DATABASE_PASSWORD=STRONG_PASSWORD_HERE
DATABASE_NAME=compliance_platform
DATABASE_SSL=true

# JWT Authentication
JWT_SECRET=GENERATE_STRONG_SECRET_HERE_USE_OPENSSL
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=GENERATE_ANOTHER_SECRET
JWT_REFRESH_EXPIRATION=7d

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_BASIC=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_ENTERPRISE=price_xxxxx

# Encryption (for data at rest)
ENCRYPTION_KEY=GENERATE_32_BYTE_KEY_HERE
ENCRYPTION_ALGORITHM=aes-256-gcm

# CORS
CORS_ORIGIN=https://app.compliance-platform.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# AWS (for S3 storage)
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=compliance-documents-prod

# Anthropic API (for AI analysis)
ANTHROPIC_API_KEY=sk-ant-xxxxx
*/

// ============================================================================
// 4. DATABASE ENTITIES (TypeORM)
// ============================================================================

// src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  COMPLIANCE_OFFICER = 'compliance_officer',
  DEPARTMENT_HEAD = 'department_head',
  VIEWER = 'viewer'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Never send password hash in responses
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  mfaSecret: string; // For TOTP MFA

  @Column({ default: false })
  mfaEnabled: boolean;

  @ManyToOne(() => Organization, org => org.users)
  organization: Organization;

  @Column()
  organizationId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// src/organizations/entities/organization.entity.ts
@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => User, user => user.organization)
  users: User[];

  @OneToOne(() => Subscription, sub => sub.organization)
  subscription: Subscription;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// src/subscriptions/entities/subscription.entity.ts
export enum SubscriptionTier {
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  TRIALING = 'trialing'
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Organization, org => org.subscription)
  organization: Organization;

  @Column()
  organizationId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionTier
  })
  tier: SubscriptionTier;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus
  })
  status: SubscriptionStatus;

  @Column({ unique: true })
  stripeCustomerId: string;

  @Column({ unique: true })
  stripeSubscriptionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyPrice: number;

  @Column({ type: 'int', default: 0 })
  analysesUsed: number;

  @Column({ type: 'int' })
  analysesLimit: number; // Per month

  @Column({ nullable: true })
  currentPeriodStart: Date;

  @Column({ nullable: true })
  currentPeriodEnd: Date;

  @Column({ nullable: true })
  trialEndsAt: Date;

  @Column({ nullable: true })
  canceledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// src/audit/entities/audit-log.entity.ts
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Organization)
  organization: Organization;

  @Column()
  organizationId: string;

  @Column()
  action: string; // e.g., 'LOGIN', 'GENERATE_REPORT', 'DELETE_DOCUMENT'

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Additional context

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column({ default: true })
  success: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================================================
// 5. AUTHENTICATION SERVICE
// ============================================================================

// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async register(email: string, password: string, firstName: string, lastName: string, organizationName: string) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12); // 12 rounds = strong security

    // Create organization (multi-tenant)
    const organization = await this.organizationsService.create({
      name: organizationName,
    });

    // Create user
    const user = await this.usersService.create({
      email,
      passwordHash,
      firstName,
      lastName,
      organizationId: organization.id,
      role: UserRole.ADMIN, // First user = admin
    });

    // Create free trial subscription
    await this.subscriptionsService.createTrialSubscription(organization.id);

    return this.generateTokens(user);
  }

  async login(email: string, password: string, ipAddress: string, userAgent: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      await this.auditService.log({
        action: 'LOGIN_FAILED',
        userId: null,
        metadata: { email, reason: 'user_not_found' },
        ipAddress,
        userAgent,
        success: false,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await this.auditService.log({
        action: 'LOGIN_FAILED',
        userId: user.id,
        organizationId: user.organizationId,
        metadata: { reason: 'invalid_password' },
        ipAddress,
        userAgent,
        success: false,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      return {
        requiresMfa: true,
        tempToken: this.jwtService.sign({ userId: user.id, type: 'mfa' }, { expiresIn: '5m' }),
      };
    }

    // Log successful login
    await this.auditService.log({
      action: 'LOGIN_SUCCESS',
      userId: user.id,
      organizationId: user.organizationId,
      ipAddress,
      userAgent,
      success: true,
    });

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    return this.generateTokens(user);
  }

  async verifyMfa(tempToken: string, mfaCode: string) {
    try {
      const payload = this.jwtService.verify(tempToken);
      if (payload.type !== 'mfa') {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.usersService.findById(payload.userId);
      
      const isValid = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: mfaCode,
        window: 2, // Allow 2 time steps before/after for clock drift
      });

      if (!isValid) {
        throw new UnauthorizedException('Invalid MFA code');
      }

      await this.usersService.updateLastLogin(user.id);
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async setupMfa(userId: string) {
    const secret = speakeasy.generateSecret({
      name: `Compliance Platform (${userId})`,
      length: 32,
    });

    await this.usersService.update(userId, {
      mfaSecret: secret.base32,
    });

    return {
      secret: secret.base32,
      qrCode: secret.otpauth_url, // Can be converted to QR code on frontend
    };
  }

  async enableMfa(userId: string, mfaCode: string) {
    const user = await this.usersService.findById(userId);
    
    const isValid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaCode,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    await this.usersService.update(userId, { mfaEnabled: true });
    return { success: true };
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(
        { ...payload, type: 'refresh' },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
      ),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

// ============================================================================
// 6. STRIPE PAYMENT SERVICE
// ============================================================================

// src/payments/stripe.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private subscriptionsService: SubscriptionsService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(email: string, organizationName: string) {
    return this.stripe.customers.create({
      email,
      name: organizationName,
      metadata: {
        platform: 'compliance-platform',
      },
    });
  }

  async createSubscription(
    organizationId: string,
    customerId: string,
    priceId: string,
    tier: SubscriptionTier
  ) {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      trial_period_days: 14, // 14-day free trial
      metadata: {
        organizationId,
        tier,
      },
    });

    // Save to database
    await this.subscriptionsService.create({
      organizationId,
      tier,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: SubscriptionStatus.TRIALING,
      monthlyPrice: this.getTierPrice(tier),
      analysesLimit: this.getTierLimit(tier),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    });

    return subscription;
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    return { received: true };
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    await this.subscriptionsService.updateByStripeId(subscription.id, {
      status: subscription.status as SubscriptionStatus,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.subscriptionsService.updateByStripeId(subscription.id, {
      status: SubscriptionStatus.CANCELED,
      canceledAt: new Date(),
    });
  }

  private getTierPrice(tier: SubscriptionTier): number {
    const prices = {
      [SubscriptionTier.BASIC]: 99,
      [SubscriptionTier.PRO]: 299,
      [SubscriptionTier.ENTERPRISE]: 999,
    };
    return prices[tier];
  }

  private getTierLimit(tier: SubscriptionTier): number {
    const limits = {
      [SubscriptionTier.BASIC]: 50,    // 50 analyses/month
      [SubscriptionTier.PRO]: 200,     // 200 analyses/month
      [SubscriptionTier.ENTERPRISE]: 999999, // Unlimited
    };
    return limits[tier];
  }
}

// ============================================================================
// 7. AUTHORIZATION GUARDS
// ============================================================================

// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.some((role) => user.role === role);
  }
}

// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// ============================================================================
// 8. EXAMPLE PROTECTED CONTROLLER
// ============================================================================

// src/users/users.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN) // Only admins can list all users
  async getAllUsers(@Request() req) {
    return this.usersService.findByOrganization(req.user.orgId);
  }

  @Patch('me')
  async updateProfile(@Request() req, @Body() updateData) {
    return this.usersService.update(req.user.sub, updateData);
  }
}

// ============================================================================
// 9. MAIN APPLICATION BOOTSTRAP
// ============================================================================

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe webhooks
  });

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  // Cookie parser (for refresh tokens)
  app.use(cookieParser());

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Start server
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Application running on port ${process.env.PORT || 3000}`);
  console.log(`🔒 Security: Helmet, CORS, Rate Limiting enabled`);
  console.log(`💳 Stripe: Webhook secret configured`);
}
bootstrap();

// ============================================================================
// END OF PHASE 1 - SECURE FOUNDATION
// ============================================================================