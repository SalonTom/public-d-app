<template>
    <div v-if="authStore.userStatus === 1" style="display: flex; gap: 16px; align-items: center; justify-content: space-evenly;">
        <div style="
            border-radius: 100%;
            background-color: #1D1C20;
            width: 80px !important;
            height: 80px !important;
            box-shadow: inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
            display: grid;
            place-items: center;">
            <img src="../assets/svg/hourglass.svg" style="animation: rotate 3.5s infinite">
        </div>
        <div style="text-align: center; max-width: 100%;">
            Please wait while the image <br/> is being processed...
        </div>
    </div>
    <div v-else>
        <input type="file" name="file" ref="fileInput" @change="uploadImageAsync"/>
    </div>
</template>
<script lang="ts">  
import { defineComponent } from 'vue';
import router from '@/router';

import { useAuthStore } from '@/stores/AuthStore';

import ContractUtils from '@/utils/ContractUtils';
import { useToastStore } from '@/stores/ToastStore';

export default defineComponent({
    setup() {
        const authStore = useAuthStore();
        const toastStore = useToastStore();
        return {
            authStore,
            toastStore
        }
    },
    methods: {
        /**
         * Method to upload the selected image to the python server.
         */
        async uploadImageAsync() {

            const fileInput = this.$refs.fileInput as HTMLInputElement;
            const file = fileInput?.files ? fileInput.files[0] : null;

            try {
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    await fetch('http://127.0.0.1:5000/verify_age?eth_address=' + this.authStore.signer, {
                        method: 'POST',
                        body: formData
                    });

                    this.authStore.userStatus = 1;

                    // Check if the process went through and the user is whitleistedd by the server.
                    const interval = setInterval(async () => {

                        try {
                            const userIsVerified = await ContractUtils.getContract().methods.whitelist(this.authStore.signer).call();
                            
                            if (Number(userIsVerified) === 2) {
                                this.authStore.userStatus = 2;

                                clearInterval(interval);

                                useToastStore().addToast('Registration completed ! Welcome to the Public', 'positive');
                                router.push({ name : 'Feed' });
                            }

                        } catch (error) {
                            this.toastStore.addToast('Error while checking for process completion', 'negative');
                        }

                    }, 1000)
                }
            } catch (error) {
                this.toastStore.addToast('Errror while processing your ID Card. Retry later...', 'negative');
            }
        }
    }
    
})
</script>

<style>

@keyframes rotate {
    0% {
        transform: rotate(0);
    }

    50% {
        transform: rotate(360deg);
    }

    100% {
        transform: rotate(0);
    }
}
</style>