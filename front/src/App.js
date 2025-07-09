import React, { useEffect, useState, useRef } from "react";
import TopWallets from "./components/TopWallets";
import RealTimeTransactions from "./components/RealTimeTransactions";
import Dashboard from "./components/Dashboard";
import HistoricalQuery from "./components/HistoricalQuery";
import Header from "./components/Header";

function App() {
  const [transactions, setTransactions] = useState([]);
  const logRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };
   

    socket.onmessage = (event) => {
      try {
        const tx = JSON.parse(event.data);
        setTransactions((prev) => [...prev.slice(-49), tx]); 
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

   

    socket.onclose = () => {
      console.warn("🔌 WebSocket disconnected");
    };

   

    return () => {
      socket.close();
    }; 
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [transactions]);

  return (
    <>
    <div className="w-full bg-gray-900 pb-10">
    <Header />
    <div className="flex gap-4 p-4 bg-transparent pt-10 " >

    <TopWallets />
     <div className=" gap-4">

    <Dashboard />
    <HistoricalQuery />
     </div>
    </div>
    <RealTimeTransactions />

    <div className=" bg-transparent p-6 border rounded border-gray-600 ml-10  mr-10 mt-5 mb-5">
      <h1 className="text-2xl font-bold text-white text-center mb-4">
        🔁 Live Solana Token Transactions
      </h1>
      <div
        ref={logRef}
        className="bg-gray-800 rounded shadow p-4 max-h-[500px] overflow-y-auto"
      >
        {transactions.length === 0 ? (
          <p className="text-gray-500">Waiting for transactions...</p>
        ) : (
          transactions.map((tx, index) => (
            <div key={index} className="text-sm border-b py-2 hover:bg-blue-600">
              <span className="text-blue-600 font-mono text-white">
                [{new Date(tx.timestamp).toLocaleTimeString()}]
              </span>{" "}
              <a
                href={`https://solscan.io/tx/${tx.signature}`}
                target="_blank"
                rel="noreferrer"
                className="text-white ml-10 text-center"
              >
                {tx.signature}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
    </>
  );
}

export default App;
