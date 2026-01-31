// src/auth/guards/admin.guard.ts
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (user.role !== 'super_admin') {
      throw new ForbiddenException('Restricted to System Administrators');
    }
    return true;
  }
}
