// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    
    // Validate password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT Payload
    const payload = { 
      sub: user.id, 
      email: user.email, 
      orgId: user.organizationId // Critical for multi-tenancy
    };

    return {
      [span_1](start_span)access_token: await this.jwtService.signAsync(payload),[span_1](end_span)
    };
  }
}
