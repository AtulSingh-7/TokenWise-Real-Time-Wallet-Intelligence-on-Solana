import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { fetchTopHolders } from "./solana/fetchTopHolders.js";
import { initSolanaMonitor } from "./solana/monitor.js";
import { Holder } from "./models/Holder.js";
import { Transaction } from "./models/Transaction.js";
import { connectMongo } from './db/db.js';
import { initLiveSolanaMonitor } from "./solana/Signatures.js";
import cors from "cors";
await connectMongo();


const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

// await fetchTopHolders();



app.get("/api/holders", async (req, res) => {
  try {
    const holders = await Holder.find().sort({ token_balance: -1 }).limit(60);
    res.json(holders);
  } catch (err) {
    console.error("Error fetching holders:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/transactions", async (req, res) => {
  const txs = await Transaction.find().sort({ timestamp: -1 }).limit(50);
  res.json(txs);
});

app.get("/api/dashboard-stats", async (req, res) => {
  try {
    const transactions = await Transaction.find();

    const totalBuys = transactions.filter(tx => tx.direction === "buy").length;
    const totalSells = transactions.filter(tx => tx.direction === "sell").length;

    const netDirection = totalBuys > totalSells ? "buy-heavy" : totalSells > totalBuys ? "sell-heavy" : "neutral";

    const walletMap = {};
    for (let tx of transactions) {
      walletMap[tx.wallet_address] = (walletMap[tx.wallet_address] || 0) + 1;
    }
    const repeatedWallets = Object.entries(walletMap).filter(([_, count]) => count > 1);

    const protocolCounts = {};
    for (let tx of transactions) {
      protocolCounts[tx.protocol] = (protocolCounts[tx.protocol] || 0) + 1;
    }

    res.json({
      totalBuys,
      totalSells,
      netDirection,
      repeatedWallets,
      protocolCounts,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


import { Parser as Json2csvParser } from "json2csv";

app.get("/api/historical", async (req, res) => {
  const { from, to, format = "json" } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing 'from' or 'to' query parameters." });
  }

  try {
    const start = new Date(from);
    const end = new Date(to);

    const transactions = await Transaction.find({
      timestamp: { $gte: start, $lte: end },
    }).sort({ timestamp: -1 });

    if (format === "csv") {
      const fields = ["timestamp", "wallet_address", "amount", "direction", "protocol", "signature"];
      const json2csv = new Json2csvParser({ fields });
      const csv = json2csv.parse(transactions);
      res.header("Content-Type", "text/csv");
      res.attachment("transactions.csv");
      return res.send(csv);
    }

    res.json(transactions);
  } catch (err) {
    console.error("Historical query error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




wss.on("connection", (ws) => {
  console.log("Client connected to WebSocket");
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected");
  });
});

initLiveSolanaMonitor(clients);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server and WebSocket running on port ${PORT}`);
});




