<template>
    <div style="width: 100vw; height: 100vh; display: flex;">
        <div>
            <NavBar></NavBar>
        </div>
        <div>
            <RouterView></RouterView>
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