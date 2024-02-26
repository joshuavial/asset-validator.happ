import { createPublicClient, http, formatEther } from 'viem';
import 'dotenv/config';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';

async function getBalance() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Please set your PRIVATE_KEY in the environment");
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey);
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance for ${account.address}: ${formatEther(balance)}`);
}

getBalance().catch((error) => {
  console.error(error);
  process.exit(1);
});
