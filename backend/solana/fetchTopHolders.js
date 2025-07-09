import { Connection, PublicKey } from "@solana/web3.js";
import { Holder } from "../models/Holder.js";

// const RPC_URL = "https://api.mainnet-beta.solana.com";
const RPC_URL = "https://mainnet.helius-rpc.com/?api-key=99446498-bdc8-4282-84e3-6a17990bdee5";
const TOKEN_MINT = new PublicKey("9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump");

const connection = new Connection(RPC_URL, "confirmed");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchTopHolders() {
  console.log("Fetching top 60 token holders...");

  const accounts = await connection.getTokenLargestAccounts(TOKEN_MINT);
  const topAccounts = accounts.value.slice(0, 60);

  console.log("Top 60 accounts:", topAccounts);

  for (const acc of topAccounts) {
    const accountInfo = await connection.getParsedAccountInfo(acc.address);
    const owner = accountInfo.value?.data?.parsed?.info?.owner;
    const balance = acc.uiAmount;



    if (!owner || !balance) continue;

    await Holder.findOneAndUpdate(
      { wallet_address: owner },
      {
        token_balance: balance,
        updated_at: new Date(),
      },
      { upsert: true }
    );

    // await sleep(1000);

    console.log(`✔ Stored: ${owner} — ${balance}`);
  }

  console.log("✅ Done updating top 60 holders.");
}
