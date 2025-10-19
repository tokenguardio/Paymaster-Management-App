import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SiweAuthGuard } from './auth.guard';
import { ISessionData, IAuthenticatedRequest } from '../shared/interfaces/session.interface';
import { SiweService } from '../siwe/siwe.service';

describe('SiweAuthGuard', () => {
  let guard: SiweAuthGuard;
  let siweService: SiweService;

  const mockSiweService = {
    isAuthenticated: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SiweAuthGuard,
        {
          provide: SiweService,
          useValue: mockSiweService,
        },
      ],
    }).compile();

    guard = module.get<SiweAuthGuard>(SiweAuthGuard);
    siweService = module.get<SiweService>(SiweService);
  });

  const createMockExecutionContext = (session: ISessionData): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          session,
        }),
      }),
    } as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when user is authenticated', () => {
      const mockSession: ISessionData = {
        siwe: {
          address: '0x1234567890123456789012345678901234567890',
          chainId: 1,
        },
      } as ISessionData;

      mockSiweService.isAuthenticated.mockReturnValue(true);

      const context = createMockExecutionContext(mockSession);
      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(siweService.isAuthenticated).toHaveBeenCalledWith(mockSession);
    });

    it('should throw UnauthorizedException when user is not authenticated', () => {
      const mockSession: ISessionData = {
        siwe: null,
      } as ISessionData;

      mockSiweService.isAuthenticated.mockReturnValue(false);

      const context = createMockExecutionContext(mockSession);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow('You must sign in with Ethereum wallet');
      expect(siweService.isAuthenticated).toHaveBeenCalledWith(mockSession);
    });

    it('should throw UnauthorizedException when session siwe is null after authentication check', () => {
      const mockSession: ISessionData = {
        siwe: null,
      } as ISessionData;

      mockSiweService.isAuthenticated.mockReturnValue(true);

      const context = createMockExecutionContext(mockSession);

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(context)).toThrow('Invalid session');
    });

    it('should attach user info to request when authenticated', () => {
      const mockSession: ISessionData = {
        siwe: {
          address: '0x1234567890123456789012345678901234567890',
          chainId: 1,
        },
      } as ISessionData;

      mockSiweService.isAuthenticated.mockReturnValue(true);

      const mockRequest: Partial<IAuthenticatedRequest> = {
        session: mockSession,
        user: undefined,
      };

      const context = {
        switchToHttp: () => ({
          getRequest: (): Partial<IAuthenticatedRequest> => mockRequest,
        }),
      } as ExecutionContext;

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockRequest.user).toEqual({
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
      });
    });
  });
});
