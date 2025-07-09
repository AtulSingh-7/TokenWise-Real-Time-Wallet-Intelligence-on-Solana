
import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = "https://api.mainnet-beta.solana.com";
const TOKEN_ADDRESS = new PublicKey("9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump");

export function initLiveSolanaMonitor(clients) {
  const connection = new Connection(RPC_URL, "confirmed");

  connection.onLogs(TOKEN_ADDRESS, (logInfo) => {
    const { signature, err, logs } = logInfo;
    if (err) return;

    const parsedData = {
      signature,
      logs,
      timestamp: new Date().toISOString(),
    };

    clients.forEach((ws) => {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(parsedData));
      }
    });

    console.log("Sent real-time tx:", signature);
  }, "confirmed");
}