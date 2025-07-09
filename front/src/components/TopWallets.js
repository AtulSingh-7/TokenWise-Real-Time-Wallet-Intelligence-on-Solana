import React, { useEffect, useState } from "react";
import "./utility.css";

export default function TopWallets() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/holders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setWallets(data);
      })
      .catch((err) => console.error("Failed to fetch wallets:", err));
  }, []);

  return (
    <div className="w-4/10 shadow border rounded border-gray-600  bg-transparent">
      <h2 className="text-xl font-bold mb-5 text-white text-center mt-5">🏆 Top 60 Token Holders</h2>
      <div className="bg-gray-800 rounded shadow p-2 overflow-x-auto overflow-y-auto max-h-[520px] ">
        <table className="w-full text-sm text-center ">
          <thead className=" text-white font-bold">
            <tr className="text-white">
              <th className="px-2 py-2">Rank</th>
              <th className="px-2 py-2">Wallet Address</th>
              <th className="px-2 py-2">Token Amount</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w, idx) => (
              <tr key={w._id || idx} className="border-t hover:bg-blue-600">
                <td className="px-4 py-2 text-white hover:text-blue-600">{idx + 1}</td>
                <td className="px-4 py-2 font-mono text-white truncate max-w-xs">
                  <a
                    href={`https://solscan.io/account/${w.wallet_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {w.wallet_address}
                  </a>
                </td>
                <td className="px-4 py-2 text-white hover:text-blue-600">{w.token_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
