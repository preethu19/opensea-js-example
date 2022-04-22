import React, {useEffect, useState} from "react";
import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import './App.css';

const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})



function App() {

  const [asset, setAsset] = useState();

  useEffect( async()=>{
    const a = await seaport.api.getAsset({
      tokenAddress: "0x06012c8cf97bead5deae237070f9587f8e7a266d", // CryptoKitties
      tokenId: "1", // Token ID
    })
    setAsset(a)
    console.log(a)
  }, [])

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
