<template>
    <div style="font-size: 18px; margin-bottom: calc(32px + var(--figma-ratio));">
        Feed List
    </div>
    <div v-if="projectsAndToken.length" style="display: flex;
        flex-direction: column;
        gap: calc(24px + var(--figma-ratio));
        max-height: 90%;
        overflow-y: auto;
        padding-right: 8px;">

        <div 
            v-for="projectAndToken in projectsAndToken"
            :key="projectAndToken.project.owner" 
            class="shadow main-background main-stroke" 
            style="display: flex;">

            <ProjectEntryList :projectAndToken="projectAndToken"></ProjectEntryList>
        </div>
    </div>
    <div v-else class="short">
        No projects yet. Be the first to list one in "My project" tab!
    </div>
</template>
<script lang="ts">
import ContractUtils from '@/utils/ContractUtils';
import { defineComponent, ref } from 'vue';

import ProjectEntryList from '@/components/ProjectEntryList.vue';
import { useAuthStore } from '@/stores/AuthStore';

import type ProjectAndToken from "@/models/ProjectAndToken";

export default defineComponent({
    components: {
        ProjectEntryList
    },
    setup() {

        const projectsAndToken = ref<ProjectAndToken[]>([]);

        return {
            projectsAndToken
        }
    },
    async mounted() {
        // await ContractUtils.getContract().methods.createProject("45555", "66666666", "POLY", 12, 58).send({ from : useAuthStore().signer })
        const projects = await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[];
        this.projectsAndToken = projects;
    }
})
</script>