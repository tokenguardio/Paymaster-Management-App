import { Session } from 'express-session';
import { SiweMessage } from 'siwe';

export interface ISessionData extends Session {
  nonce?: string | null;
  siwe?: SiweMessage | null;
}

export interface IAuthenticatedRequest extends Request {
  user: {
    address: string;
    chainId: number;
  };
  session: ISessionData;
}
