<template>
    <div style="font-size: 18px; margin-bottom: calc(32px + var(--figma-ratio));">
        Feed List
    </div>
    <Transition>
        <div v-if="loadingData">
            <LazyLoading></LazyLoading>
        </div>
        <div v-else class="appear">
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
        </div>
    </Transition>
</template>
<script lang="ts">
import ContractUtils from '@/utils/ContractUtils';
import { defineComponent, ref } from 'vue';

import ProjectEntryList from '@/components/ProjectEntryList.vue';

import type ProjectAndToken from "@/models/ProjectAndToken";
import LazyLoading from '@/components/LazyLoading.vue';
import { useToastStore } from '@/stores/ToastStore';

export default defineComponent({
    components: {
    ProjectEntryList,
    LazyLoading
},
    setup() {

        // Are we loading data ?
        const loadingData = ref(false);

        // Object containing the project infos and the associated token smart contract address.
        const projectsAndToken = ref<ProjectAndToken[]>([]);

        return {
            projectsAndToken,
            loadingData
        }
    },
    async mounted() {

        try {
            this.loadingData = true;
    
            const projects = await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[];
            this.projectsAndToken = projects;

        } catch(error) {
            useToastStore().addToast('Error while fetching the projects. Try again later...', 'negative');
        } finally {
            this.loadingData = false;
        }
    }
})
</script>

<style>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.appear {
    animation: appear 0.5s;
}

@keyframes appear {
    0% {
        opacity: 0;
    }

    99% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>