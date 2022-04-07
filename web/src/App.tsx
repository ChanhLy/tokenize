import './App.css'
import { useQuery } from 'react-query'
import axios from 'axios'
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

const socket = io("http://localhost:3000");

type Data = { bids: [number, number][], asks: [number, number][], totalAsks: number, totalBids: number }

function App() {

  const [data, setData] = useState<Data>();

  useEffect(() => {
    socket.on("ETHBTC", (data) => {
      setData(data);
    });

    return () => {
      socket.close();
    }

  }, [])

  return (
    <div className="App" style={{ display: 'flex' }}>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Bid</th>
          </tr>
        </thead>
        <tbody>
          {data?.bids.map(([bid, size]) => (
            <tr>
              <td>{size}</td>
              <td>{bid}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              {data?.totalBids}
            </td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Ask</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          {data?.asks.map(([size, bid]) => (
            <tr>
              <td>{size}</td>
              <td>{bid}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              {data?.totalAsks}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default App
