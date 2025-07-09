import React, { useState } from "react";

export default function HistoricalQuery() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);

  const handleFetch = async () => {
    const res = await fetch(`http://localhost:3001/api/historical?from=${from}&to=${to}`);
    const data = await res.json();
    setResults(data);
  };

  const handleCSVDownload = () => {
    window.open(
      `http://localhost:3001/api/historical?from=${from}&to=${to}&format=csv`,
      "_blank"
    );
  };

  return (
    <div className="p-4 shadow border rounded border-gray-600  mt-5">
      <h2 className="text-xl font-bold mb-4 text-white text-center">📆 Historical Transaction Query</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleFetch} className="bg-blue-600 text-white px-4 py-2 rounded text-center">
          Fetch
        </button>
        <button onClick={handleCSVDownload} className="bg-green-600 text-white px-4 py-2 rounded text-center">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800  rounded shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-transparent">
            <tr className="text-white">
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Wallet</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Direction</th>
              <th className="px-4 py-2">Protocol</th>
            </tr>
          </thead>
          <tbody>
            {results.map((tx, idx) => (
              <tr key={idx} className="border-t hover:bg-blue-600">
                <td className="px-4 py-2 text-white ">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 font-mono text-white">
                  <a
                    href={`https://solscan.io/account/${tx.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.wallet_address.slice(0, 6)}...{tx.wallet_address.slice(-4)}
                  </a>
                </td>
                <td className="px-4 py-2 text-white">{tx.amount.toFixed(4)}</td>
                <td className={`px-4 py-2 text-center ${tx.direction === "buy" ? "text-green-600" : "text-red-600"}`}>
                  {tx.direction.toUpperCase()}
                </td>
                <td className="px-4 py-2 text-white">{tx.protocol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
