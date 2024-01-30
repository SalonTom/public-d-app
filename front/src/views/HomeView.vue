<template>
  <div class="home-container">
    <div class="header">
      <Public></Public>
    </div>
    <div class="content-container">
      <div style="display: flex; flex-direction: column; gap: calc(32px + var(--figma-ratio)); width: 100%;">
        <div class="headline">
          <div>
            <span style="color: transparent; -webkit-text-stroke: 1px #FAFAFA;">Empower</span> your investments,
          </div>
          <div>
            <span style="color: transparent; -webkit-text-stroke: 1px #FAFAFA;">Unleash</span> your projects
          </div>
        </div>
        <div>
          <div class="emphasis">The first adult-exclusive investment platform with AI-driven age recognition.</div>
          <div style="display: flex; align-items: center; gap: calc(16px + var(--figma-ratio)); margin-top: calc(24px + var(--figma-ratio));">
            <div class="btn btn-primary" @click="connectToWalletAsync">Connect you wallet and let's go !</div>
            <div class="btn btn-txt" @click="connectToWalletAsync">Already registered ? Log in.</div>
          </div>
        </div>
      </div>
      <img src="../assets/eth_logo.png" style="max-width: 35vw; height: auto;">
    </div>
  </div>
</template>

<script lang="ts">
import Public from '@/components/Public.vue';
import router from '@/router';
import { defineComponent } from 'vue';

import MetamaskConnector from "@/utils/MetamaskConnector";
import { useAuthStore } from '@/stores/AuthStore';

export default defineComponent({
  components: {
    Public
  },
  methods: {
    async connectToWalletAsync() : Promise<void> {
      try {
        const { provider, signer } = await MetamaskConnector.metamaskConnectorAsync();

        const authStore = useAuthStore();
        authStore.init(signer, provider);
        
        authStore.provider = provider;
        authStore.signer = signer;

        // Check if the user is registered or not
        if (authStore.userIsRegistered) {
          router.push({ name : 'Feed' });
        } else {
          router.push({ name : 'Register' })
        }

      } catch (error) {
        alert(error);
      }
    }
  }
})
</script>

<style>
.header {
  padding: calc(20px + var(--figma-ratio)) calc(64px + var(--figma-ratio));
  max-height: calc(80px + var(--figma-ratio));
}

.home-container {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
}

.content-container {
  display: flex;
  padding: 0 calc(64px + var(--figma-ratio));
  align-items: center;
}
</style>