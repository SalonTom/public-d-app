import { BrowserProvider, JsonRpcSigner } from "ethers";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('authStore', {
    state : () => ({
        connectedAddress : '',
        signer : null as JsonRpcSigner | null,
        provider : undefined as BrowserProvider | undefined,
        userIsRegistered : false,
        userHasRequestedAccess : false
    }),

    actions : {
        init(signer : JsonRpcSigner | null, provider : BrowserProvider | undefined) {
            this.signer = signer;
            this.provider = provider;

            // Code to call the smart contrat to see if the user is registered + requester
            this.userIsRegistered = true;
            this.userHasRequestedAccess = true;
        }
    }
});