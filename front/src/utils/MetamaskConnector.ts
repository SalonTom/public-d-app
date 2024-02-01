import Web3 from 'web3';

declare global {
  interface Window{
    ethereum?:any
  }
}

let web3;
let account;

export const MetamaskConnector = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      window.ethereum.on('accountsChanged', (newAccounts: any[]) => {
        account = newAccounts[0];
      });

      return { web3, account };
    } else {
      alert('MetaMask not detected. Please install MetaMask.');
      return null;
    }
  } catch (error) {
    alert('Error connecting to MetaMask:' + error);
    return null;
  }
};