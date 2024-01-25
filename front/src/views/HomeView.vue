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
          <div style="margin-top: calc(24px + var(--figma-ratio));" class="btn btn-primary">Connect you wallet and let's go !</div>
        </div>
      </div>
      <img src="../assets/eth_logo.png" style="max-width: 35vw; height: auto;">
    </div>
  </div>
</template>

<script lang="ts">
import Public from '@/components/Public.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Public
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

/* @media (max-width: 1250px) {
  .content-container {
    display: flex;
    flex-direction: column;
    padding: 0 calc(64px + var(--figma-ratio));
    align-items: center;
  }

} */
</style>