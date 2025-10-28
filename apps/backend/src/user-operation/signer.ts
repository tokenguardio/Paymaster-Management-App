import { ethers, type TypedDataDomain, type TypedDataField } from 'ethers';
import { RequestUserOperationDto } from './dto/sign-user-operation.dto';

/**
 * Contract between Service <-> Signer:
 * - The signer ONLY builds paymasterData (no account signature).
 */
export interface IPaymasterSigner {
  buildPaymasterData(
    chainId: bigint,
    uo: RequestUserOperationDto,
    opts?: { validityWindowSeconds?: number },
  ): Promise<{ paymasterData: string; validAfter: bigint; validUntil: bigint }>;
}

/**
 * EIP-712 Paymaster signer that mirrors your working script.
 * It binds all relevant UO fields + EntryPoint + chainId into the signature.
 */
export class Eip712PaymasterSigner implements IPaymasterSigner {
  private readonly wallet: ethers.Wallet;
  private readonly name: string;
  private readonly version: string;
  private readonly ttlSeconds: number;

  public constructor(opts: {
    privateKey: string; // PAYMASTER_SIGNER_PK
    name?: string; // "MyPaymasterECDSASigner"
    version?: string; // "1"
    ttlSeconds?: number; // default 600 (10 min)
  }) {
    this.wallet = new ethers.Wallet(opts.privateKey);
    this.name = opts.name ?? 'MyPaymasterECDSASigner';
    this.version = opts.version ?? '1';
    this.ttlSeconds = opts.ttlSeconds ?? 600;
  }

  public async buildPaymasterData(
    chainId: bigint,
    uo: RequestUserOperationDto,
    opts?: { validityWindowSeconds?: number },
  ): Promise<{ paymasterData: string; validAfter: bigint; validUntil: bigint }> {
    const bi = (x: string): bigint => BigInt(x);

    const accountGasLimits = ethers.solidityPacked(
      ['uint128', 'uint128'],
      [bi(uo.verificationGasLimit), bi(uo.callGasLimit)],
    );

    const gasFees = ethers.solidityPacked(
      ['uint128', 'uint128'],
      [bi(uo.maxPriorityFeePerGas), bi(uo.maxFeePerGas)],
    );

    const now = BigInt(Math.floor(Date.now() / 1000));
    const validAfter = 0n;
    const validUntil = now + BigInt(opts?.validityWindowSeconds ?? this.ttlSeconds);

    const domain: TypedDataDomain = {
      name: this.name,
      version: this.version,
      chainId,
      verifyingContract: uo.paymaster,
    };

    const types: Record<string, TypedDataField[]> = {
      UserOperationRequest: [
        { name: 'sender', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'initCode', type: 'bytes' },
        { name: 'callData', type: 'bytes' },
        { name: 'accountGasLimits', type: 'bytes32' },
        { name: 'preVerificationGas', type: 'uint256' },
        { name: 'gasFees', type: 'bytes32' },
        { name: 'paymasterVerificationGasLimit', type: 'uint256' },
        { name: 'paymasterPostOpGasLimit', type: 'uint256' },
        { name: 'validAfter', type: 'uint48' },
        { name: 'validUntil', type: 'uint48' },
      ],
    };

    const value = {
      sender: uo.sender,
      nonce: bi(uo.nonce),
      initCode: uo.factoryData ?? '0x',
      callData: uo.callData,
      accountGasLimits,
      preVerificationGas: bi(uo.preVerificationGas),
      gasFees,
      paymasterVerificationGasLimit: bi(uo.paymasterVerificationGasLimit),
      paymasterPostOpGasLimit: bi(uo.paymasterPostOpGasLimit),
      validAfter,
      validUntil,
    };

    const signature = await this.wallet.signTypedData(domain, types, value);

    // Pack paymasterData = [uint48 validAfter][uint48 validUntil][65-byte sig]
    const validAfterHex = validAfter.toString(16).padStart(12, '0'); // 6 bytes
    const validUntilHex = validUntil.toString(16).padStart(12, '0'); // 6 bytes
    const sigHex = signature.slice(2);

    const paymasterData = '0x' + validAfterHex + validUntilHex + sigHex;
    return { paymasterData, validAfter, validUntil };
  }
}
