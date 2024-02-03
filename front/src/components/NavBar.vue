<template>
    <div style="width: 300px; height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 16px 32px 32px 32px;">
        <div>
            <Public style="margin-left: 8px;"></Public>
            <div style="padding-bottom: calc(24px + var(--figma-ratio));
                display: flex;
                flex-direction: column;
                gap: calc(12px + var(--figma-ratio));
                margin-top: calc(32px + var(--figma-ratio));">
                <RouterLink :to="{ name : 'Feed' }" replace>
                    <img src="../assets/svg/list.svg">
                    Feed
                </RouterLink>
                <RouterLink :to="{ name : 'My Project' }" replace>
                    <img src="../assets/svg/donut.svg">
                    My Project
                </RouterLink>
            </div>
        </div>
        <div>
            <div style="height: 2px; width: 100%; margin-bottom: 16px; background-color: #27262A;"></div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <div class="short bold" 
                    style="
                        border: solid 1px #27262A;
                        border-radius: 8px;
                        background-color: #1D1C20;
                        text-overflow: ellipsis;
                        padding: 8px 12px;
                        overflow: hidden;">
                    {{ authStore.signer }}
                </div>
                <img src="../assets/svg/logout.svg" style="cursor: pointer;" @click="logout">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';

import Public from '@/components/Public.vue';

import { useAuthStore } from '@/stores/AuthStore';
import { useToastStore } from '@/stores/ToastStore';

export default defineComponent({
    components : {
        Public
    }, 
    setup() {
        const authStore = useAuthStore();

        return {
            authStore
        }
    },
    methods: {
        logout() {
            this.authStore.reset();
            router.replace({ name : 'Home' });
            useToastStore().addToast('You have been disconnected', 'neutral');
        }
    }
})
</script>