import { AbiCoder, keccak256, concat } from 'ethers';

type THex = `0x${string}`;

function asHex(v: string): THex {
  return (v.startsWith('0x') ? v : `0x${v}`) as THex;
}

const abi = new AbiCoder();

function toHex32(n: bigint): THex {
  let hex = n.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  const bytesLen = hex.length / 2;
  if (bytesLen > 32) {
    hex = hex.slice(hex.length - 64);
  }
  return ('0x' + hex.padStart(64, '0')) as THex;
}

function hashBytes(data?: string | null): THex {
  const input = data && data !== '' ? asHex(data) : ('0x' as THex);
  return keccak256(input) as THex;
}

function toBigIntStrict(v: unknown): bigint {
  if (typeof v === 'bigint') return v;
  if (typeof v === 'number') return BigInt(v);
  if (typeof v === 'string') {
    if (v.startsWith('0x') || v.startsWith('0X')) return BigInt(v);
    return BigInt(v);
  }
  throw new Error(`Cannot convert value to bigint: ${v}`);
}

function packAccountGasLimits(callGasLimit: unknown, verificationGasLimit: unknown): THex {
  const callGas = toBigIntStrict(callGasLimit);
  const verifGas = toBigIntStrict(verificationGasLimit);
  // verificationGasLimit in upper 128 bits, callGasLimit in lower 128 bits
  const packed = (verifGas << 128n) | (callGas & ((1n << 128n) - 1n));
  return toHex32(packed);
}

function packGasFees(maxFeePerGas: unknown, maxPriorityFeePerGas: unknown): THex {
  const maxFee = toBigIntStrict(maxFeePerGas);
  const maxPrio = toBigIntStrict(maxPriorityFeePerGas);
  // maxPriorityFeePerGas in upper 128 bits, maxFeePerGas in lower 128 bits
  const packed = (maxPrio << 128n) | (maxFee & ((1n << 128n) - 1n));
  return toHex32(packed);
}

/**
 * Compute ERC-4337 EntryPoint v0.7 userOp hash.
 * Mirrors EntryPoint.getUserOpHash (signature excluded).
 */
export function computeUserOpHashV07(
  uo: {
    sender: string;
    nonce: unknown;
    initCode?: THex | string;
    callData: THex | string;
    callGasLimit: unknown;
    verificationGasLimit: unknown;
    preVerificationGas: unknown;
    maxFeePerGas: unknown;
    maxPriorityFeePerGas: unknown;
    paymaster?: string | null;
    paymasterVerificationGasLimit?: unknown;
    paymasterPostOpGasLimit?: unknown;
    paymasterData?: THex | string | null;
  },
  entryPoint: string,
  chainId: bigint | number,
): THex {
  // Build paymasterData: paymaster (20 bytes) + packed gas limits (32 bytes) + paymasterData
  let paymasterAndData: THex;
  if (!uo.paymaster || uo.paymaster === '0x0000000000000000000000000000000000000000') {
    paymasterAndData = '0x' as THex;
  } else {
    const verifGasLimit = toBigIntStrict(uo.paymasterVerificationGasLimit ?? 0);
    const postOpGasLimit = toBigIntStrict(uo.paymasterPostOpGasLimit ?? 0);
    // Pack: paymasterVerificationGasLimit in upper 128 bits, paymasterPostOpGasLimit in lower 128 bits
    const gasLimits = (verifGasLimit << 128n) | (postOpGasLimit & ((1n << 128n) - 1n));
    const gasLimitsHex = toHex32(gasLimits);
    const data =
      uo.paymasterData && uo.paymasterData !== '0x' ? asHex(uo.paymasterData) : ('0x' as THex);
    paymasterAndData = concat([asHex(uo.paymaster), gasLimitsHex, data]) as THex;
  }

  const userOpPack = keccak256(
    abi.encode(
      [
        'address', // sender
        'uint256', // nonce
        'bytes32', // keccak(initCode) - empty bytes hash for deployed accounts
        'bytes32', // keccak(callData)
        'bytes32', // accountGasLimits (verificationGasLimit << 128 | callGasLimit)
        'uint256', // preVerificationGas
        'bytes32', // gasFees (maxPriorityFeePerGas << 128 | maxFeePerGas)
        'bytes32', // keccak(paymasterData)
      ],
      [
        asHex(uo.sender),
        toBigIntStrict(uo.nonce),
        hashBytes(uo.initCode ?? '0x'),
        hashBytes(uo.callData),
        packAccountGasLimits(uo.callGasLimit, uo.verificationGasLimit),
        toBigIntStrict(uo.preVerificationGas),
        packGasFees(uo.maxFeePerGas, uo.maxPriorityFeePerGas),
        hashBytes(paymasterAndData),
      ],
    ),
  );

  return keccak256(
    abi.encode(['bytes32', 'address', 'uint256'], [userOpPack, asHex(entryPoint), BigInt(chainId)]),
  ) as THex;
}
