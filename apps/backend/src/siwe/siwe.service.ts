import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage, SiweResponse } from 'siwe';
import { ISessionData } from '../shared/interfaces/session.interface';

@Injectable()
export class SiweService {
  public generateNonce(): string {
    return generateNonce();
  }

  public async verify(
    message: string,
    signature: string,
    nonce: string | null | undefined,
  ): Promise<SiweResponse> {
    if (!nonce) {
      throw new Error('Nonce is required for verification');
    }

    const siweMessage = new SiweMessage(message);
    return await siweMessage.verify({ signature, nonce });
  }

  public isAuthenticated(session: ISessionData): boolean {
    return !!session.siwe?.address;
  }

  public getAuthenticatedAddress(session: ISessionData): string | null {
    return session.siwe?.address || null;
  }
}
