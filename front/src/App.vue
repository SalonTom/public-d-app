<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/AuthStore';

export default defineComponent({
  components: {
    RouterView
  },
  name: "App",
  setup() {
    const connectedAddress = useAuthStore().signer ?? '';
    useAuthStore().init(connectedAddress);
  }
});

</script>