import * as fs from 'fs';
import * as path from 'path';
import { Wallet } from 'ethers';

const generateAndSaveWallet = (): void => {
  console.log('Checking for existing paymaster signer wallet...');

  const envPath = path.resolve(__dirname, '../../.env');
  const privateKeyVariableName = 'PAYMASTER_SIGNER_PRIVATE_KEY';
  const addressVariableName = 'PAYMASTER_SIGNER_ADDRESS';
  const placeholder = '<INSERT_YOUR_SIGNER_PRIVATE_KEY_HERE>';

  // Read the current .env file content, or start with an empty string if it doesn't exist.
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';

  const privateKeyRegex = new RegExp(`^${privateKeyVariableName}=(.*)$`, 'm');
  const privateKeyMatch = envContent.match(privateKeyRegex);
  const existingPrivateKey = privateKeyMatch ? privateKeyMatch[1].trim() : '';

  const addressRegex = new RegExp(`^${addressVariableName}=(.*)$`, 'm');
  const addressMatch = envContent.match(addressRegex);
  const existingAddress = addressMatch ? addressMatch[1].trim() : '';

  // A valid private key exists; the primary task is to ensure its address is also present and correct.
  if (existingPrivateKey && existingPrivateKey !== placeholder) {
    console.log('Signer private key found in .env file.');

    // If the address also exists, we must verify it matches the private key.
    if (existingAddress) {
      try {
        const wallet = new Wallet(existingPrivateKey);
        const derivedAddress = wallet.address;

        // Compare addresses in a case-insensitive manner.
        if (derivedAddress.toLowerCase() !== existingAddress.toLowerCase()) {
          console.error('\n' + '-'.repeat(60));
          console.error('ERROR: Mismatch between private key and address in .env file!');
          console.error(`Address derived from key: ${derivedAddress}`);
          console.error(`Address found in .env:     ${existingAddress}`);
          console.error(
            '\nPlease remove the incorrect PAYMASTER_SIGNER_ADDRESS from the .env file and run this script again to fix it.',
          );
          console.error('-'.repeat(60) + '\n');
        } else {
          console.log('Signer address found and verified. Setup is complete.');
        }
      } catch (error) {
        console.error(
          'Error: The existing private key is invalid. Please check it or remove it from the .env file.',
          error,
        );
      }
      return;
    }

    // The address is missing, so derive it from the existing key to ensure consistency.
    console.log('Signer address is missing. Deriving from private key...');
    try {
      const wallet = new Wallet(existingPrivateKey);
      const derivedAddress = wallet.address;
      const addressEntry = `\n${addressVariableName}=${derivedAddress}`;

      // Append the derived address to the .env file content.
      fs.writeFileSync(envPath, envContent.trim() + addressEntry);

      console.log(`\nDerived Address: ${derivedAddress}`);
      console.log('Successfully added signer address to .env file.');
    } catch (error) {
      console.error(
        'Error: The existing private key is invalid. Please check it or remove it from the .env file.',
        error,
      );
    }
    return;
  }

  console.log('No existing wallet found. Generating a new one...');
  const wallet = Wallet.createRandom();
  const { privateKey, address } = wallet;

  console.log('\n' + '-'.repeat(60));
  console.log('New wallet generated successfully!');
  console.log(`\nAddress: ${address}`);
  console.log(`Private Key: ${privateKey}`);
  console.log('-'.repeat(60) + '\n');

  // This block dynamically updates or appends the wallet credentials to the .env file content.
  const variablesToUpdate: Record<string, string> = {
    [privateKeyVariableName]: privateKey,
    [addressVariableName]: address,
  };

  for (const [key, value] of Object.entries(variablesToUpdate)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const entry = `${key}=${value}`;

    if (envContent.match(regex)) {
      // If the variable exists (e.g., as a placeholder), replace it.
      envContent = envContent.replace(regex, entry);
      console.log(`Updating ${key} in ${envPath}`);
    } else {
      // Otherwise, append it to the end of the file content.
      envContent += `\n${entry}`;
      console.log(`Adding ${key} to ${envPath}`);
    }
  }

  fs.writeFileSync(envPath, envContent.trim());
  console.log('\nThe .env file has been updated with the new private key and address.');
};

generateAndSaveWallet();
