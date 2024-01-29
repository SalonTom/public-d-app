<template>
    <div v-if="userHasRequested" style="display: flex; gap: 16px; align-items: center; justify-content: space-evenly;">
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
import router from '@/router';
import { useAuthStore } from '@/stores/AuthStore';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        userHasRequested : {
            type: Boolean,
            required : true
        }
    },
    methods: {
        uploadImageAsync() {
            const fileInput = this.$refs.fileInput as HTMLInputElement;
            const file = fileInput?.files ? fileInput.files[0] : null;

            if (file) {
                console.log("call to quentin api");

                useAuthStore().userHasRequestedAccess = true;

                setTimeout(() => {
                    useAuthStore().userIsRegistered = true;
                    router.push({ name : 'Feed' });
                }, 2000)
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