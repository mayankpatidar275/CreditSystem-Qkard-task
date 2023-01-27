import React, { useState , useEffect} from 'react';
import { ethers } from 'ethers';
import './App.css';
import Minter from "./artifacts/contracts/CreditInformation.sol/CreditInformation.json";

function App() {
  const [contract, setContract] = useState(null);
  const [partyAddress, setPartyAddress] = useState('');
  const [creditInfo, setCreditInfo] = useState({
    id: "-",
    ownerParty: "-",
    creditsOwned: "-",
    creditScore: "-",
    isIndividual: "-",
    totalAmountLended: "-",
    totalAmountBorrowed: "-",
    totalTransactions: "-"
  });
  const [creditsOwned, setCreditsOwned] = useState('');
  const [isIndividual, setIsIndividual] = useState(false);
  const [totalAmountLended, setTotalAmountLended] = useState('');
  const [totalAmountBorrowed, setTotalAmountBorrowed] = useState('');
  const [id, setId] = useState('');
  const [totalTransactions, setTotalTransactions] = useState('');
  const [creditScore, setCreditScore] =  useState(''); 
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x9b7bca012cD65921A7075714021EeA2b38ed4F6c";

        const contract = new ethers.Contract(
          contractAddress,
          Minter.abi,
          signer
        );

        setContract(contract);
        setProvider(provider);

      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);


  const addAuthorizedParty = async () => {
    try {
      const tx = await contract.functions.addAuthorizedParty(partyAddress);
      await tx.wait();
      console.log('Party added');
    }
    catch(err){
      console.log(err);
    }
  }

  const calculateCreditScore = async () => {
    try {
        // Call the contract to calculate the credit score
        const creditScoreVal = await contract.functions.calculateCreditScore(partyAddress);
        const x = parseInt(creditScoreVal.toString());
        setCreditScore(x);
    } catch (err) {
        console.log(err);
    }
}

const getCreditInfoo = async () => {
  if(!provider) {
      alert.message = "Please connect to a provider";
      return;
  }

  if(!contract) {
      alert.message = "Please connect to the contract";
      return;
  }
  try {
    const creditInfoVar = await contract.functions.getCreditInfo(partyAddress);
    if(creditInfo){
      setCreditInfo({
        id: parseInt(creditInfoVar[0].id.toString()),
        ownerParty: creditInfoVar[0].ownerParty,
        creditsOwned: parseInt(creditInfoVar[0].creditsOwned.toString()),
        creditScore: parseInt(creditInfoVar[0].creditScore.toString()),
        isIndividual: creditInfoVar[0].isIndividual,
        totalAmountLended: parseInt(creditInfoVar[0].totalAmountLended.toString()),
        totalAmountBorrowed: parseInt(creditInfoVar[0].totalAmountBorrowed.toString()),
        totalTransactions: parseInt(creditInfoVar[0].totalTransactions.toString())
      });
    }
    else{
      setCreditInfo({
        id: "-",
    ownerParty: "-",
    creditsOwned: "-",
    creditScore: "-",
    isIndividual: "-",
    totalAmountLended: "-",
    totalAmountBorrowed: "-",
    totalTransactions: "-"
      });
    }
    
    
    
  } catch (error) {
    console.error(error);
  }
  
}

// Function to handle form submission
const updateCreditInfo = async () => {
  try {
    // Call the updateCreditInfo function
    const tx = await contract.updateCreditInfo(partyAddress, Number(id), Number(creditsOwned), isIndividual, Number(totalAmountLended), Number(totalAmountBorrowed), Number(totalTransactions));
    console.log("Transaction sent: ", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined: ", receipt);
} catch (error) {
    console.log(error);
}
};



return (
  <div className="w-100 ">
  <nav className="navbar navbar-expand-lg navbar-light bg-primary">
    <a className="navbar-brand text-white" href="#">Credit System</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav mr-auto"></ul>
      <form className="form-inline my-2 my-lg-0">
      <button className="btn btn-outline-light my-2 my-sm-0 btn-success" >Connect</button>

        {/* <button className="btn btn-outline-light my-2 my-sm-0 btn-success" onClick={connect}>Connect</button> */}
      </form>
    </div>
  </nav>

  <h1 className="text-center display-4 text-success mar">Welcome to QKard :)</h1>

  {/* {alert.message && alert(alert.message)} */}
  <div className="row  mar ">
  <div className="col-md-6">
  <div className=" card cardd">
    <div className="card-body ">
      <h2>Add Owner</h2>
      <div className="form-group ">
        <label htmlFor="partyAddress">Address</label>
        <input type="text" className="form-control" id="partyAddress" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} />
      </div>
      <button className="btn btn-outline-light my-2 my-sm-0 btn-primary btn-lg" onClick={addAuthorizedParty}>Add</button>
    </div>
  </div>
</div>
      
      <div className="col-md-6">
      <div className="card card cardd">
    <div className="card-body">
        <h2>Calculate Credit Score</h2>
        <div className="form-group">
          <label htmlFor="partyAddress">Address</label>
          <input type="text" className="form-control" id="partyAddress" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} />
        </div>
        <button className="btn btn-outline-light my-2 my-sm-0 btn-primary btn-lg" onClick={calculateCreditScore}>Calculate</button>
         <div className="text-center mt-3" style={{fontSize: '1.5rem'}}>
            <p>Credit Score: {creditScore}</p>
         </div>
      </div>
      </div>
  </div>
    </div>
    <div className="row  mar ">
    
    <div className="col-md-6">
    <div className="card card cardd">
    <div className="card-body">
      <h2>Get Credit Information</h2>
      <div className="form-group">
        <label htmlFor="partyAddress">Address</label>
        <input type="text" className="form-control" id="partyAddress" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} />
      </div>
      <button className="btn btn-outline-light my-2 my-sm-0 btn-primary btn-lg" onClick={getCreditInfoo}>Get</button>
    
      {creditInfo.id && (
      <div className= "mar">
        <p>ID: {creditInfo.id}</p>
        <p>Credits Owned: {creditInfo.creditsOwned}</p>
        <p>Individual account: {creditInfo.isIndividual ? "Yes" : "No"}</p>
        <p>Total Amount Lended: {creditInfo.totalAmountLended}</p>
        <p>Total Amount Borrowed: {creditInfo.totalAmountBorrowed}</p>
        <p>Total Transactions: {creditInfo.totalTransactions}</p>
      </div>
    )}
    </div>
      </div>
    </div>
    
  
  
  <div className="col-md-6">
  <div className="card card cardd">
    <div className="card-body">
        <h2>Update Credit Information</h2>
        <div className="form-group">
          <label htmlFor="partyAddress">Address</label>
          <input type="text" className="form-control" id="partyAddress" value={partyAddress} onChange={e => setPartyAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input type="text" className="form-control" id="id" value={id} onChange={e => setId(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="creditsOwned">Credits Owned</label>
          <input type="text" className="form-control" id="creditsOwned" value={creditsOwned} onChange={e => setCreditsOwned(e.target.value)} />
        </div>
        <div className="form-group">
  <label htmlFor="isIndividual" style={{ marginRight: '10px' }}>Check for individual account</label>
  <input type="checkbox" id="isIndividual" style={{ transform: 'scale(1.5)' }} checked={isIndividual} onChange={e => setIsIndividual(e.target.checked)} />
</div>
        <div className="form-group">
          <label htmlFor="totalAmountLended">Total Amount Lended</label>
          <input type="text" className="form-control" id="totalAmountLended" value={totalAmountLended} onChange={e => setTotalAmountLended(e.target.value)} />
        </div>
        <div className="form-group">
    <label htmlFor="totalAmountBorrowed">Total Amount Borrowed</label>
    <input type="text" className="form-control" id="totalAmountBorrowed" value={totalAmountBorrowed} onChange={e => setTotalAmountBorrowed(e.target.value)} />
</div>
<div className="form-group">
    <label htmlFor="totalTransactions">Total Transactions</label>
    <input type="text" className="form-control" id="totalTransactions" value={totalTransactions} onChange={e => setTotalTransactions(e.target.value)} />
</div>
<button className="btn btn-outline-light my-2 my-sm-0 btn-primary btn-lg" onClick={updateCreditInfo}>Update</button>
</div>
</div>
    </div>
  </div>

  </div>
)
}
export default App;