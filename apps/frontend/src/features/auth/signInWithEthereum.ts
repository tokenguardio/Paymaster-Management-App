import axios from 'axios';
import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const API_URL = import.meta.env.VITE_API_URL;

export async function signInWithEthereum() {
  try {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet – install MetaMask.');
    }

    // --- GET NONCE ---
    const nonceRes = await axios.get(`${API_URL}/siwe/nonce`, {
      withCredentials: true,
    });

    const nonce = nonceRes.data; // bo backend zwraca tekst

    // --- SIGN MESSAGE ---
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
      nonce,
      issuedAt: new Date().toISOString(),
    });

    const signature = await signer.signMessage(message.prepareMessage());

    // --- VERIFY SIWE ---
    const res = await axios.post(
      `${API_URL}/siwe/verify`,
      {
        message: message.toMessage(),
        signature,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const { address: loggedAddress } = res.data;

    console.log('Logged in as:', loggedAddress);
    return loggedAddress;
  } catch (err) {
    console.error('Login error:', err);

    throw err;
  }
}
