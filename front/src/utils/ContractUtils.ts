import Web3, { Contract } from "web3";

import Address from "../../../shared_contracts_info/Address.json";
import ProjectTokenFactory from "../../../shared_contracts_info/ProjectTokenFactory.json";
import ProjetTokenMarket from "../../../shared_contracts_info/ProjectTokenMarket.json";
import ProjectToken from "../../../shared_contracts_info/ProjectToken.json";

/**
 * Class to access the various contracts.
 */
export default class ContractUtils {

    // Project Token Factory contract
    private static contract: Contract<any>;

    // Project Token Market Place contract
    private static contractMarket: Contract<any>;

    private constructor() {}

    /**
     * Method to get the contract to interact with the ProjectTokenFactory Smart Contract.
     * @returns Contract
     */
    public static getContract() : Contract<any> {
        if (!ContractUtils.contract) {

            const _web3 = new Web3(window.ethereum);
    
            this.contract = new _web3.eth.Contract(
                ProjectTokenFactory.abi,
                Address.Address
            );
        }

        return ContractUtils.contract;
    }

    /**
     * Method to get the contract to interact with the ProjectTokenMarket Smart Contract.
     * @returns Contract
     */
    public static getContractMarket() : Contract<any> {
        if (!ContractUtils.contractMarket) {

            const _web3 = new Web3(window.ethereum);
    
            this.contractMarket = new _web3.eth.Contract(
                ProjetTokenMarket.abi,
                Address.AddressMarket
            );
        }

        return ContractUtils.contractMarket;
    }

    /**
     * Method to get the contract to interact with the Project Token Smart Contract.
     * @param address address of the token contract
     * @returns Contract
     */
    public static getContractToken(address : string) : Contract<any> {
        const _web3 = new Web3(window.ethereum);
    
        return new _web3.eth.Contract(
            ProjectToken.abi,
            address
        );

    }

    /**
     * Metyod to get the marketplace address.
     * @returns Market place contract address.
     */
    public static getMarketContractAddress() {
        return Address.AddressMarket;
    }
}