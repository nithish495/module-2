import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [showMenu, setShowMenu] = useState(false);
  const [showEStatement, setShowEStatement] = useState(false);
  const [eStatement, setEStatement] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    const account = accounts[0];
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
      updateEStatement("Deposit", 1);
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
      updateEStatement("Withdrawal", -1);
    }
  };

  const updateEStatement = (type, amount) => {
    const transaction = {
      type,
      amount,
      dateTime: new Date().toLocaleString(),
    };
    setEStatement([...eStatement, transaction]);
  };

  const disconnectWallet = async () => {
    if (ethWallet) {
      try {
        await ethWallet.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        setAccount(undefined);
        setBalance(undefined);
        setATM(undefined);
        setEStatement([]);
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        {showMenu && (
          <div className="menuButtons">
            <button onClick={deposit}>Deposit 1 ETH</button>
            <button onClick={withdraw}>Withdraw 1 ETH</button>
            <button onClick={() => setShowEStatement(true)}>E-Statement</button>
          </div>
        )}
        <button onClick={() => setShowMenu(!showMenu)}>Menu</button>
      </div>
    );
  };

  const renderEStatement = () => {
    return (
      <div className="eStatement">
        <h2>E-Statement</h2>
        {eStatement.map((transaction, index) => (
          <div key={index} className="transaction">
            <p>Type: {transaction.type}</p>
            <p>Amount: {transaction.amount} ETH</p>
            <p>Date and Time: {transaction.dateTime}</p>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>

      <div className="blue-background">
        <p>Current Date and Time: {currentDate.toLocaleString()}</p>
        <p>Holder Name: Nitish</p>
        <p>Age: 20</p>
        <p>Email Address: pendulct@gmail.com</p>
      </div>

      {initUser()}
      {showEStatement && renderEStatement()}
      {account && <button onClick={disconnectWallet}>Exit</button>}
      <style jsx>{`
        .container {
          text-align: center;
        }

        .blue-background {
          background-color: #3498db;
          padding: 10px;
          color: white;
          text-align: left;
        }

        .menuButtons {
          display: flex;
          flex-direction: column;
        }

        .menuButtons button {
          margin: 10px;
          padding: 15px;
          font-size: large;
        }

        .eStatement {
          margin-top: 20px;
        }

        .transaction {
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 10px;
        }
      `}</style>
    </main>
  );
}
