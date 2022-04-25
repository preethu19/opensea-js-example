import React, {useEffect, useState} from "react";
//import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import './App.css';
import { OrderSide, WyvernSchemaName } from 'opensea-js/lib/types'
import Web3 from 'web3';
import { ethers } from "ethers"
import Navigation from './Navbar.js'
const HDWalletProvider = require("@truffle/hdwallet-provider");

const provider = new HDWalletProvider({
    mnemonic: "better custom whisper wave chapter helmet kick power require castle frog picture",
    providerOrUrl: "https://rinkeby.infura.io/v3/be296185674548aaa1153abab140512b",
    addressIndex: 1
});



const web3 = new Web3(provider)

//const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/be296185674548aaa1153abab140512b')

const seaport = new OpenSeaPort(provider, {
  networkName: Network.Rinkeby,
  apiKey: "5bec8ae0372044cab1bef0d866c98618"
})



function App() {

  const [assets, setAssets] = useState("");
  const [asset, setAsset] = useState();
  const [account, setAccount] = useState(null)
  const [price, setPrice] = useState(0)
  // const [seaport, setSeaport] = useState(null);
  
  const [tokenAddress, setTokenAddress] = useState("0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656")
  const [token_id, setTokenId] = useState("85101716527489200964561093658122220458119461830071050062355304213666030682113")

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

    // const loadAccount = async() => {
    //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //   setAccount(accounts[0])
    // }
    
    // // Get provider from Metamask
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // // Set signer
    // const signer = provider.getSigner()

    // window.ethereum.on('chainChanged', (chainId) => {
    //   window.location.reload();
    // })

    // window.ethereum.on('accountsChanged', async function (accounts) {
    //   setAccount(accounts[0])
    //   await loadAccount()
    // })

   
    

    // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // // Set signer
    // const signer = provider.getSigner()

    
    
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    
  }

    

  useEffect( async()=>{
   await web3Handler()
   console.log("All assets:")
   await getAllAssets("")
   //await setTokenAddress(assets.assets[0].tokenAddress)
   //await setTokenId(assets.assets[0].tokenId)
   await setTokenAddress("0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656")
   await setTokenId("85101716527489200964561093658122220458119461830071050062355304213666030682113")
   console.log("Get asset:")
   await getSpecificAsset(tokenAddress, token_id)
   console.log("Get price:")
   await getAssetOrder(tokenAddress, token_id)
   console.log("Create buy order")
   await createBuyOrder(tokenAddress, token_id, price, account)
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
    //   const order = await seaport.api.getOrder({
    //     asset_contract_address: tokenAddress,
    //     token_id: token_id,
    //     side: OrderSide.Sell
    //   }, 1)
    //   console.log(web3.utils.fromWei(order.currentPrice.toString(), "ether" ) );
    
    // await sleep(1000*60)
    // const accountAddress = "0xbC25Dd57C738548Cf67991FFA9dc51E17c6CD624" // The buyer's wallet address, also the taker
    // const transactionHash = await seaport.fulfillOrder({ order, accountAddress })
    // console.log(transactionHash)

  }, [])

  const getAllAssets = async (collectionName) => {
    const allAssets = await seaport.api.getAssets({
      collection: collectionName
    })
    await setAssets(allAssets)
    console.log(allAssets)
  }

  const getSpecificAsset = async (tokenAddress, token_id) => {
    const eachAsset = await seaport.api.getAsset({
      tokenAddress: tokenAddress, // CryptoKitties
      tokenId: token_id, // Token ID
    })
    await setAsset(eachAsset)
    console.log(eachAsset)
  }

  const getAssetOrder = async(tokenAddress, token_id) => {
    const order = await seaport.api.getOrder({
          asset_contract_address: tokenAddress,
          token_id: token_id,
          side: OrderSide.Sell
        }, 1)
        console.log(web3.utils.fromWei(order.currentPrice.toString(), "ether" ) );
      await setPrice(web3.utils.fromWei(order.currentPrice.toString(), "ether" ) )
  }

  const createBuyOrder = async (tokenAddress, token_id, price, account) => {
    const buyOrder = await seaport.createBuyOrder({
      asset: {
        tokenId: token_id,
        tokenAddress: tokenAddress,
        schemaName: WyvernSchemaName.ERC1155
      },
      accountAddress: "0xbC25Dd57C738548Cf67991FFA9dc51E17c6CD624",
      startAmount: 0.000001
    })
    console.log(buyOrder)
  }

  return (
    <div className="App">
       <Navigation web3Handler={web3Handler} account={account} />
       
    </div>
  );
}

export default App;
