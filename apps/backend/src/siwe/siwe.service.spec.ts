import { Test, TestingModule } from '@nestjs/testing';
import { SiweMessage } from 'siwe';
import { SiweService } from './siwe.service';
import { ISessionData } from '../shared/interfaces/session.interface';

jest.mock('siwe', () => ({
  generateNonce: jest.fn(() => 'generated-nonce-123'),
  SiweMessage: jest.fn(),
}));

describe('SiweService', () => {
  let service: SiweService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SiweService],
    }).compile();

    service = module.get<SiweService>(SiweService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateNonce', () => {
    it('should generate and return a nonce', () => {
      const result = service.generateNonce();

      expect(result).toBe('generated-nonce-123');
    });
  });

  describe('verify', () => {
    const mockMessage = 'test-siwe-message';
    const mockSignature = '0xsignature';
    const mockNonce = 'test-nonce';

    it('should verify a valid SIWE message', async () => {
      const mockVerifyResponse = {
        success: true,
        data: {
          address: '0x1234567890123456789012345678901234567890',
          chainId: 1,
          nonce: mockNonce,
        },
      };

      const mockVerify = jest.fn().mockResolvedValue(mockVerifyResponse);
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: mockVerify,
      }));

      const result = await service.verify(mockMessage, mockSignature, mockNonce);

      expect(SiweMessage).toHaveBeenCalledWith(mockMessage);
      expect(mockVerify).toHaveBeenCalledWith({ signature: mockSignature, nonce: mockNonce });
      expect(result).toEqual(mockVerifyResponse);
    });

    it('should throw error when nonce is null', async () => {
      await expect(service.verify(mockMessage, mockSignature, null)).rejects.toThrow(
        'Nonce is required for verification',
      );
    });

    it('should throw error when nonce is undefined', async () => {
      await expect(service.verify(mockMessage, mockSignature, undefined)).rejects.toThrow(
        'Nonce is required for verification',
      );
    });

    it('should throw error when nonce is empty string', async () => {
      await expect(service.verify(mockMessage, mockSignature, '')).rejects.toThrow(
        'Nonce is required for verification',
      );
    });

    it('should propagate verification errors', async () => {
      const mockError = new Error('Invalid signature');
      const mockVerify = jest.fn().mockRejectedValue(mockError);
      (SiweMessage as jest.Mock).mockImplementation(() => ({
        verify: mockVerify,
      }));

      await expect(service.verify(mockMessage, mockSignature, mockNonce)).rejects.toThrow(
        'Invalid signature',
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when session has siwe address', () => {
      const session: ISessionData = {
        siwe: {
          address: '0x1234567890123456789012345678901234567890',
        },
      } as ISessionData;

      expect(service.isAuthenticated(session)).toBe(true);
    });

    it('should return false when session has no siwe', () => {
      const session: ISessionData = {
        siwe: null,
      } as ISessionData;

      expect(service.isAuthenticated(session)).toBe(false);
    });

    it('should return false when session has siwe but no address', () => {
      const session: ISessionData = {
        siwe: {},
      } as ISessionData;

      expect(service.isAuthenticated(session)).toBe(false);
    });

    it('should return false when session siwe address is empty string', () => {
      const session: ISessionData = {
        siwe: {
          address: '',
        },
      } as ISessionData;

      expect(service.isAuthenticated(session)).toBe(false);
    });
  });

  describe('getAuthenticatedAddress', () => {
    it('should return address when session has siwe address', () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const session: ISessionData = {
        siwe: {
          address: mockAddress,
        },
      } as ISessionData;

      expect(service.getAuthenticatedAddress(session)).toBe(mockAddress);
    });

    it('should return null when session has no siwe', () => {
      const session: ISessionData = {
        siwe: null,
      } as ISessionData;

      expect(service.getAuthenticatedAddress(session)).toBeNull();
    });

    it('should return null when session has siwe but no address', () => {
      const session: ISessionData = {
        siwe: {},
      } as ISessionData;

      expect(service.getAuthenticatedAddress(session)).toBeNull();
    });
  });
});
