


const Navigation = ({ web3Handler, account }) => {
    return(
        <div>
            {account ? (
                <h1>{account.slice(0, 5) + '...' + account.slice(38, 42)}</h1>
            ) : (
            <button onClick={web3Handler}>Connect Wallet</button>
            )}
        </div>
    )
}

export default Navigation