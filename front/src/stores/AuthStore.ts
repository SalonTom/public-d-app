import ContractUtils from "@/utils/ContractUtils";
import { defineStore } from "pinia";
import { useToastStore } from "./ToastStore";

export const useAuthStore = defineStore('authStore', {
    state : () => ({
        signer : '',
        userStatus : 0
    }),
    actions : {
        async init(address: any) {
            try {
                this.signer = address;

                if (address) {
                    // Get the current user status.
                    const status = await ContractUtils.getContract().methods.whitelist(address).call();
                    this.userStatus = Number(status);
                }
            } catch(error) {
                useToastStore().addToast('Couldn\'t load user data', 'negative');
                this.reset();
            }
        },
        reset() {
            this.signer = '';
            this.userStatus = 0;
        }
    },
    persist: true
});