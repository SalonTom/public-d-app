import { ethers } from "ethers";

declare global {
  interface Window{
    ethereum?:any
  }
}

export default class MetamaskConnector {

    constructor() {}

    static async metamaskConnectorAsync() {
        let signer = null;
        let provider;

        if (window.ethereum == null) {
            alert("MetaMask not installed. Please proceed to its installation.");
        } else {
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
        }

        return Promise.resolve({ provider, signer})
    }
};