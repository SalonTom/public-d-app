import { useAuthStore } from "@/stores/AuthStore";
import Web3, { Contract } from "web3";

import Address from "../../../shared_contracts_info/Address.json";
import ProjectTokenFactory from "../../../shared_contracts_info/ProjectTokenFactory.json";

export default class ContractUtils {
    private static contract: Contract<any>;

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
}