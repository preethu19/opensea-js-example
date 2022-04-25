import React, {useEffect, useState} from "react";
//import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import './App.css';
import { OrderSide } from 'opensea-js/lib/types'
import Web3 from 'web3';
import { ethers } from "ethers"

const web3 = new Web3(Web3.givenProvider);

// const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/be296185674548aaa1153abab140512b')





function App() {

  const [asset, setAsset] = useState();
  const [account, setAccount] = useState(null)
  
  const tokenAddress = "0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656"
  const token_id = "85101716527489200964561093658122220458119461830071050062355304214765542309889"

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

    const loadAccount = async() => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
    }
    
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await loadAccount()
    })

    const seaport = new OpenSeaPort(provider, {
      networkName: Network.Rinkeby
    })
  

  useEffect( async()=>{
   loadAccount()
    // const a = await seaport.api.getAsset({
    //   tokenAddress: tokenAddress, // CryptoKitties
    //   tokenId: token_id, // Token ID
    // })
    // setAsset(a)
    // console.log(a)
    // await sleep(1000*60)

      // // Get offers (bids), a.k.a. orders where `side == 0`
      // const { orders, count } = await seaport.api.getOrders({
      //   asset_contract_address: tokenAddress,
      //   token_id: token_id,
      //   side: OrderSide.Buy
      // })
      
      // Get page 2 of all auctions, a.k.a. orders where `side == 1`
      const order = await seaport.api.getOrder({
        asset_contract_address: tokenAddress,
        token_id: token_id,
        side: OrderSide.Sell
      }, 1)
      console.log(web3.utils.fromWei(order.currentPrice.toString(), "ether" ) );
    
    await sleep(1000*60)
    const accountAddress = "0xbC25Dd57C738548Cf67991FFA9dc51E17c6CD624" // The buyer's wallet address, also the taker
    const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
    console.log(transactionHash)

  }, [])

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
