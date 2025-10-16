import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ISessionData } from '../shared/interfaces/session.interface';
import { SiweService } from '../siwe/siwe.service';

export interface IAuthenticatedRequest extends Request {
  user: {
    address: string;
    chainId: number;
  };
  session: ISessionData;
}

@Injectable()
export class SiweAuthGuard implements CanActivate {
  public constructor(private readonly siweService: SiweService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const session = request.session;

    if (!this.siweService.isAuthenticated(session)) {
      throw new UnauthorizedException('You must sign in with Ethereum');
    }

    const siwe = session.siwe;
    if (!siwe) {
      throw new UnauthorizedException('Invalid session');
    }

    // Attach user info to request
    request.user = {
      address: siwe.address,
      chainId: siwe.chainId,
    };

    return true;
  }
}
