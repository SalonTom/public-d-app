<template>
    <div style="width: 100vw; height: 100vh; display: flex;">
        <div>
            <NavBar></NavBar>
        </div>
        <div style="padding: 20px 32px 32px 32px; width: 100%;">
            <RouterView :key="$route.fullPath"></RouterView>
        </div>
    </div>
</template>

<script lang="ts">
import NavBar from "@/components/NavBar.vue";

import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        NavBar
    },
    setup() {
        return {
        }
    },
    methods: {
    }
})
</script>