<template>
  <Teleport to="body">
    <div style="position: absolute; right: 50px; top: 25px; display: flex; flex-direction: column; overflow: hidden; gap: 8px;">
      <TransitionGroup>
        <div v-for="toast in toasts" :key="toast.message">
          <Toast :toast="toast"></Toast>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';
import { useToastStore } from './stores/ToastStore';

import Toast from '@/components/Toast.vue';

export default defineComponent({
  components: {
    RouterView,
    Toast
  },
  name: "App",
  setup() {
    const connectedAddress = useAuthStore().signer ?? '';
    useAuthStore().init(connectedAddress);

    const toasts = ref(useToastStore().toasts);

    return {
      useToastStore,
      toasts
    }
  }
});

</script>