<template>
    <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: calc(32px + var(--figma-ratio));">
        <div class="title">
            Minimum age validation
        </div>
        <div class="shadow main-stroke" style="padding: calc(32px + var(--figma-ratio)); display: flex; flex-direction: column; gap: calc(32px + var(--figma-ratio)); max-width: 450px;">
            <div>
                To have access to the plateform, we must make sure that you are an adult.
                <br/>
                <br/>
                Upload a quality picture of your identity card. A automatic treatment will retrieve your date of birth.
            </div>

            <FileInput ref="fileInput" :userHasRequested="authStore.userHasRequestedAccess"></FileInput>

            <div class="short">
                Note that the picture will be instantly deleted from our servers once the process is finished.
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import FileInput from '@/components/FileInput.vue';
import { useAuthStore } from '@/stores/AuthStore';


import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        FileInput
    },
    setup() {
        const authStore = useAuthStore();
    
        return {
            authStore
        }
    }
})
</script>