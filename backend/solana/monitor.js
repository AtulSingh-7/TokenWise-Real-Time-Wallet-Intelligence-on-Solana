
import { Connection, PublicKey } from "@solana/web3.js";
import { Holder } from "../models/Holder.js";
import { Transaction } from "../models/Transaction.js";

const RPC_URL = "https://api.mainnet-beta.solana.com";
const TOKEN_ADDRESS = new PublicKey("9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump");

const protocolMap = {
  "JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB": "Jupiter",
  "RVKd61ztZW9GdKz5vKnjL6hjiTUzNtcMGm8Fz6uY2zQ": "Raydium",
  "82yxjeMsE2LaFLezFdfFxznkzrmn28EtdV9aZqBZQhTo": "Orca",
};

function sleep(delay){
  setTimeout(() => {}, delay);
}

export function initSolanaMonitor(clients) {
  const connection = new Connection(RPC_URL, "confirmed");

  connection.onLogs(TOKEN_ADDRESS, async (logInfo) => {
    const { signature, err } = logInfo;
    if (err) return;







    try {
      const tx = await connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });
      sleep(1000);



      if (!tx || !tx.meta) return;

      const pre = tx.meta.preTokenBalances || [];
      const post = tx.meta.postTokenBalances || [];

      for (let i = 0; i < pre.length; i++) {
        const preBal = pre[i];
        const postBal = post[i];

        if (!preBal || !postBal || preBal.mint !== TOKEN_ADDRESS.toBase58()) continue;

        const owner = preBal.owner;

        const topHolder = await Holder.findOne({ wallet_address: owner });
        if (!topHolder) continue;

        const before = preBal.uiTokenAmount.uiAmount || 0;
        const after = postBal.uiTokenAmount.uiAmount || 0;
        const diff = after - before;

        if (diff === 0) continue;

        const direction = diff > 0 ? "buy" : "sell";

        const keys = tx.transaction.message.accountKeys.map((k) =>
          typeof k === "string" ? k : k.pubkey.toBase58()
        );

        const protocol = keys.map((k) => protocolMap[k]).find((p) => p) || "Unknown";

        const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();

        const parsedTx = {
          signature,
          wallet_address: owner,
          amount: Math.abs(diff),
          direction,
          protocol,
          timestamp,
        };

        

        await Transaction.create(parsedTx);

        clients.forEach((ws) => {
          if (ws.readyState === 1) {
            ws.send(JSON.stringify(parsedTx));
          }
        });

        console.log(`✅ ${direction.toUpperCase()}: ${owner} ${Math.abs(diff)} via ${protocol}`);
      }
    } catch (err) {
      if (!err.message.includes("duplicate key")) {
        console.error("❌ Error parsing tx:", signature, err.message);
      }
    }
  });
}
