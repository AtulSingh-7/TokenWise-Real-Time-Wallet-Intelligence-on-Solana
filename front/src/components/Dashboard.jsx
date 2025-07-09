import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching dashboard stats:", err));
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div className="p-4 bg-transparent shadow border rounded border-gray-600 ">
      <h2 className="text-xl font-bold mb-6 text-white text-center">📊 Market Insights Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded shadow border-2 border-gray-600 ">
          <h3 className="text-lg font-bold mb-2 text-white text-center">Total Buys vs Sells</h3>
          <p className="text-white text-left">🟢 Buys: <b>{stats.totalBuys}</b></p>
          <p className="text-white text-left">🔴 Sells: <b>{stats.totalSells}</b></p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow border-2 border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-white text-center">Market Direction</h3>
          <p className={`font-bold text-center ${stats.netDirection === "buy-heavy" ? "text-green-600" : "text-red-600"}`}>
            {stats.netDirection.toUpperCase()}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow border-2 border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-white text-center">🔁 Repeated Wallets</h3>
          <ul className="text-sm font-mono max-h-40 overflow-y-auto">
            {stats.repeatedWallets.slice(0, 10).map(([wallet, count]) => (
              <li className="text-white text-center pt-2" key={wallet}>
                <a
                  href={`https://solscan.io/account/${wallet}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </a>{" "}
                — {count} txs
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow border-2 border-gray-600">
          <h3 className="text-lg font-bold mb-2 text-white text-center">⚙️ Protocol Usage</h3>
          <ul className="text-sm">
            {Object.entries(stats.protocolCounts).map(([protocol, count]) => (
              <li className="text-white text-center pt-2" key={protocol}>
                {protocol}: <b>{count}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
