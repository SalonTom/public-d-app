import { useAuthStore } from "@/stores/AuthStore";
import Web3, { Contract } from "web3";

import Address from "../../../shared_contracts_info/Address.json";
import ProjectTokenFactory from "../../../shared_contracts_info/ProjectTokenFactory.json";
import ProjetTokenMarket from "../../../shared_contracts_info/ProjectTokenMarket.json";
import ProjectToken from "../../../shared_contracts_info/ProjectToken.json";

export default class ContractUtils {
    private static contract: Contract<any>;
    private static contractMarket: Contract<any>;

    private constructor() {}

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

    public static getContractToken(address : string) : Contract<any> {
        const _web3 = new Web3(window.ethereum);
    
        return new _web3.eth.Contract(
            ProjectToken.abi,
            address
        );

    }

    public static getMarketContractAddress() {
        return Address.AddressMarket;
    }
}