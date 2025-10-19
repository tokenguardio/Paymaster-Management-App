import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SiweMessage } from 'siwe';
import { SiweController } from './siwe.controller';
import { SiweService } from './siwe.service';
import { ISessionData } from '../shared/interfaces/session.interface';

describe('SiweController', () => {
  let controller: SiweController;
  let service: SiweService;

  const mockSession: ISessionData = {
    nonce: null,
    siwe: null,
    cookie: {
      expires: null,
    },
  } as ISessionData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiweController],
      providers: [
        {
          provide: SiweService,
          useValue: {
            generateNonce: jest.fn().mockReturnValue('test-nonce-123'),
            verify: jest.fn(),
            isAuthenticated: jest.fn(),
            getAuthenticatedAddress: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SiweController>(SiweController);
    service = module.get<SiweService>(SiweService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockSession.nonce = null;
    mockSession.siwe = null;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNonce', () => {
    it('should generate and return a nonce', async () => {
      const result = await controller.getNonce(mockSession);

      expect(result).toBe('test-nonce-123');
      expect(service.generateNonce).toHaveBeenCalled();
      expect(mockSession.nonce).toBe('test-nonce-123');
    });
  });

  describe('verify', () => {
    const verifyDto = {
      message: 'test-message',
      signature: 'test-signature',
    };

    it('should verify signature and return address', async () => {
      mockSession.nonce = 'test-nonce';
      const mockSiweMessage = {
        address: '0x1234567890123456789012345678901234567890',
        expirationTime: null,
        domain: 'localhost:3000',
        statement: 'Sign in',
        uri: 'http://localhost:3000',
        version: '1',
        chainId: 1,
        nonce: 'test-nonce',
        issuedAt: new Date().toISOString(),
        toMessage: jest.fn(),
        prepareMessage: jest.fn(),
        verify: jest.fn(),
      } as unknown as SiweMessage;

      const mockVerifyResult = {
        success: true,
        data: mockSiweMessage,
      };

      jest.spyOn(service, 'verify').mockResolvedValue(mockVerifyResult);

      const result = await controller.verify(verifyDto, mockSession);

      expect(result).toEqual({ address: '0x1234567890123456789012345678901234567890' });
      expect(service.verify).toHaveBeenCalledWith(
        verifyDto.message,
        verifyDto.signature,
        'test-nonce',
      );
      expect(mockSession.siwe).toEqual(mockSiweMessage);
      expect(mockSession.nonce).toBeNull();
    });

    it('should set session cookie expiration if expirationTime is provided', async () => {
      mockSession.nonce = 'test-nonce';
      const expirationTime = '2025-12-31T23:59:59.000Z';
      const mockSiweMessage = {
        address: '0x1234567890123456789012345678901234567890',
        expirationTime,
        domain: 'localhost:3000',
        statement: 'Sign in',
        uri: 'http://localhost:3000',
        version: '1',
        chainId: 1,
        nonce: 'test-nonce',
        issuedAt: new Date().toISOString(),
        toMessage: jest.fn(),
        prepareMessage: jest.fn(),
        verify: jest.fn(),
      } as unknown as SiweMessage;

      const mockVerifyResult = {
        success: true,
        data: mockSiweMessage,
      };

      jest.spyOn(service, 'verify').mockResolvedValue(mockVerifyResult);

      await controller.verify(verifyDto, mockSession);

      expect(mockSession.cookie.expires).toEqual(new Date(expirationTime));
    });

    it('should throw BadRequestException on verification error', async () => {
      mockSession.nonce = 'test-nonce';
      jest.spyOn(service, 'verify').mockRejectedValue(new Error('Invalid signature'));

      await expect(controller.verify(verifyDto, mockSession)).rejects.toThrow(BadRequestException);
      await expect(controller.verify(verifyDto, mockSession)).rejects.toThrow('Invalid signature');

      expect(mockSession.siwe).toBeNull();
      expect(mockSession.nonce).toBeNull();
    });

    it('should throw BadRequestException with default message for non-Error exceptions', async () => {
      mockSession.nonce = 'test-nonce';
      jest.spyOn(service, 'verify').mockRejectedValue('string error');

      await expect(controller.verify(verifyDto, mockSession)).rejects.toThrow(BadRequestException);
      await expect(controller.verify(verifyDto, mockSession)).rejects.toThrow(
        'Verification failed',
      );
    });
  });

  describe('getMe', () => {
    it('should return address for authenticated user', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      jest.spyOn(service, 'isAuthenticated').mockReturnValue(true);
      jest.spyOn(service, 'getAuthenticatedAddress').mockReturnValue(mockAddress);

      const result = await controller.getMe(mockSession);

      expect(result).toEqual({ address: mockAddress });
      expect(service.isAuthenticated).toHaveBeenCalledWith(mockSession);
      expect(service.getAuthenticatedAddress).toHaveBeenCalledWith(mockSession);
    });

    it('should throw UnauthorizedException if not authenticated', async () => {
      jest.spyOn(service, 'isAuthenticated').mockReturnValue(false);

      await expect(controller.getMe(mockSession)).rejects.toThrow(UnauthorizedException);
      await expect(controller.getMe(mockSession)).rejects.toThrow('Not authenticated');
    });

    it('should throw UnauthorizedException if address is null', async () => {
      jest.spyOn(service, 'isAuthenticated').mockReturnValue(true);
      jest.spyOn(service, 'getAuthenticatedAddress').mockReturnValue(null);

      await expect(controller.getMe(mockSession)).rejects.toThrow(UnauthorizedException);
      await expect(controller.getMe(mockSession)).rejects.toThrow('Invalid session');
    });
  });
});
