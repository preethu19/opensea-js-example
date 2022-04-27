import React, {useEffect, useState} from "react";
import { OpenSeaPort, Network } from 'opensea-js'
import './App.css';
import { OrderSide, WyvernSchemaName } from 'opensea-js/lib/types'
import Web3 from 'web3';
import Navigation from './Navbar.js'
import detectEthereumProvider from "@metamask/detect-provider";






function App() {
  let seaport;
  let web3;
  let provider;

  

  const [assets, setAssets] = useState("");
  const [asset, setAsset] = useState();
  //const [account, setAccount] = useState("")
  const [price, setPrice] = useState(0)
  let account;
  
  const [tokenAddress, setTokenAddress] = useState("0x88B48F654c30e99bc2e4A1559b4Dcf1aD93FA656")
  const [token_id, setTokenId] = useState("85101716527489200964561093658122220458119461830071050062355304213666030682113")

   
  const init = async () =>{
    provider = await detectEthereumProvider()

    web3 = new Web3(provider)

    seaport = new OpenSeaPort(provider, {
      networkName: Network.Rinkeby,
      apiKey: "5bec8ae0372044cab1bef0d866c98618"
    })

  }

    // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //await setAccount(accounts[0])
    account = accounts[0]
    
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      // await setAccount(accounts[0])
      account = accounts[0]
      await web3Handler()
    })
    
  }

    

  useEffect( async()=>{
    await init();
    await web3Handler();

    
    
   console.log("All assets:")
   await getAllAssets("")

  //  await setTokenAddress(assets.assets[0].tokenAddress)
  //  await setTokenId(assets.assets[0].tokenId)
  
  //  console.log("Get asset:")
  //  await getSpecificAsset(tokenAddress, token_id)

  // console.log("Get assets on sale")
  // await getAssetOnSale()

  //  console.log("Get price:")
  //  await getAssetOrder(tokenAddress, token_id)

  //  console.log("Create buy order")
  //  await createBuyOrder(tokenAddress, token_id, 0.001, account)

  //  console.log("Confirm buy order")
  //  await confirmBuyOrder(tokenAddress, token_id, account)
  
  //  console.log("Create Sell Order")
  //  await addSellOrder(tokenAddress, token_id, account)

  }, [])

  const getAllAssets = async (collectionName) => {
    const allAssets = await seaport.api.getAssets({
      collection: collectionName
    })
    await setAssets(allAssets)
    console.log(allAssets)
  }

  const getAssetOnSale = async () => {
    const sellAssets = await seaport.api.getOrders({
      "side": OrderSide.Sell
    })
    console.log(sellAssets)
  }

  const getSpecificAsset = async (tokenAddress, token_id) => {
    const eachAsset = await seaport.api.getAsset({
      tokenAddress: tokenAddress, 
      tokenId: token_id, 
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
      accountAddress: account,
      startAmount: price
    })
    console.log(buyOrder)
  }

  const confirmBuyOrder = async (tokenAddress, token_id, account) => {
    const order = await seaport.api.getOrder({
          asset_contract_address: tokenAddress,
          token_id: token_id,
          side: OrderSide.Sell
        }, 1)
    console.log(order)
    const accountAddress = account
    const confirmOrder = await seaport.fulfillOrder({order, accountAddress })
    console.log(confirmOrder)
  }

  const addSellOrder = async(tokenAddress, token_id, account) => {
    console.log(account)
    const sellPrice = 0.001
    const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
    const sellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: token_id,
        tokenAddress: tokenAddress,
        schemaName: WyvernSchemaName.ERC1155,
      },
      accountAddress: account,
      startAmount: sellPrice,
      endAmount: sellPrice,
      expirationTime: expirationTime
      
    })
    console.log(sellOrder)
  }


  return (
    <div className="App">
       <Navigation web3Handler={web3Handler} account={account} />
       
    </div>
  );
}

export default App;