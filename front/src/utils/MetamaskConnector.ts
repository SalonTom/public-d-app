import { useToastStore } from '@/stores/ToastStore';
import Web3 from 'web3';

declare global {
  interface Window{
    ethereum?:any
  }
}

let web3;
let account;

export const MetamaskConnector = async () => {
  let toastStore = useToastStore();

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
      toastStore.addToast('MetaMask not detected. Please install MetaMask.', 'negative');
      return null;
    }
  } catch (error) {
    toastStore.addToast('Error connecting to MetaMask: ' + error.message, 'negative');
    return null;
  }
};