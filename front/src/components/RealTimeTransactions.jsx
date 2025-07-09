import React, { useEffect, useState } from "react";

export default function RealTimeTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // 1. Initial fetch of past transactions (optional)
    fetch("http://localhost:3001/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Failed to fetch transactions:", err));

    // 2. Connect to backend WebSocket server
    // const socket = new WebSocket("ws://localhost:3001"); // Or your deployed WS URL

    // socket.onmessage = (event) => {
    //   const tx = JSON.parse(event.data);
    //   setTransactions((prev) => [tx, ...prev.slice(0, 49)]); // Keep latest 50
    // };

    // return () => socket.close();
  }, []);

  return (
    <div className="w-8/10 bg-transparent p-10 border rounded border-gray-600 ml-10  mr-10 mt-5 mb-5 justify-center items-center">
      <h2 className="text-xl font-bold text-center text-white mt-5 mb-5">📡 Real-Time Token Transactions</h2>
      <div className="overflow-x-auto overflow-y-auto  bg-transparent rounded shadow p-2 custom-scrollbar">
        <table className="w-full text-sm text-center bg-gray-800">
          <thead className=" text-white font-bold">
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Wallet</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Direction</th>
              <th className="px-4 py-2">Protocol</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="border-t hover:bg-blue-600">
                <td className="px-4 py-2 text-white hover:text-blue-600">
                  {new Date(tx.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-white font-mono">
                  <a
                    href={`https://solscan.io/account/${tx.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.wallet_address.slice(0, 6)}...{tx.wallet_address.slice(-4)}
                  </a>
                </td>
                <td className="px-4 py-2 text-white hover:text-blue-600">{tx.amount.toFixed(4)}</td>
                <td
                  className={`px-4 py-2 font-bold ${
                    tx.direction === "buy" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.direction.toUpperCase()}
                </td>
                <td className="px-4 py-2 text-white hover:text-blue-600">{tx.protocol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
