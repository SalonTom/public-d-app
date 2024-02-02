import ContractUtils from "@/utils/ContractUtils";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('authStore', {
    state : () => ({
        signer : '',
        userStatus : 0
    }),
    actions : {
        async init(address: any) {
            this.signer = address;

            if (address) {
                const status = await ContractUtils.getContract().methods.whitelist(address).call();
    
                // Code to call the smart contrat to see if the user is registered + requester
                this.userStatus = Number(status);
            }
        },
        reset() {
            this.signer = '';
            this.userStatus = 0;
        }
    },
    persist: true
});