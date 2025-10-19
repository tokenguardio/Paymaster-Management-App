import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

export async function signInWithEthereum() {
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet – install MetaMask.');
    }

    // First, get nonce from backend
    const nonceRes = await fetch('http://localhost:3000/siwe/nonce', {
      credentials: 'include',
    });

    if (!nonceRes.ok) {
      throw new Error('Failed to get nonce');
    }

    const nonce = await nonceRes.text();

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const chainId = Number((await provider.getNetwork()).chainId);

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Log in to app',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce: nonce,
      issuedAt: new Date().toISOString(),
    });

    const signature = await signer.signMessage(message.prepareMessage());

    const res = await fetch('http://localhost:3000/siwe/verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.toMessage(),
        signature,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'SIWE verification error');
    }

    const { address: loggedAddress } = await res.json();
    console.log('Logged in as:', loggedAddress);
    return loggedAddress;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}
