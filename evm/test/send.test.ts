import { beforeEach, describe, expect, it} from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { parseEther, formatEther } from 'viem';
import { WalletClient, PublicClient } from 'viem/clients'; // Assuming these are the correct imports

import { send } from '../lib/transactions';

import hre from 'hardhat';

describe('send.ts', () => {
  beforeEach(async () => {
    // Mocking WalletClient and PublicClient
    const walletClient = vi.mocked(new WalletClient());
    const publicClient = vi.mocked(new PublicClient());

    // Mocking hre.viem.getWalletClients to return the mocked walletClient
    vi.spyOn(hre.viem, 'getWalletClients').mockResolvedValue([walletClient]);

    // Mocking hre.viem.getPublicClient to return the mocked publicClient
    vi.spyOn(hre.viem, 'getPublicClient').mockResolvedValue(publicClient);
  });

  it('sends a transaction successfully', async () => {
    // Use the HRE to access Viem clients
    const [walletClient] = await hre.viem.getWalletClients(); // This will now use the mocked function
    const publicClient = await hre.viem.getPublicClient(); // This will now use the mocked function

    const recipient = privateKeyToAccount(generatePrivateKey()).address;

    let balance = await publicClient.getBalance({ address: recipient });
    expect(formatEther(balance)).toBe('0');
    console.log(walletClient.privateKey);

    const hash = send(recipient, privateKey);
    await publicClient.waitForTransactionReceipt({ hash });

    // Assertions to verify the transaction was sent
    expect(hash).toBeDefined();
    balance = await publicClient.getBalance({ address: recipient });
    expect(formatEther(balance)).toBe('1.0');
  });
});
