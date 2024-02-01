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
import { useAuthStore } from '@/stores/AuthStore';
import ContractUtils from '@/utils/ContractUtils';
import ConversionUtils from '@/utils/ConversionUtils';
import { defineComponent, ref } from 'vue';

import ProjectEntryList from '@/components/ProjectEntryList.vue';

class Project {
    public owner: string;
    public title: string;
    public description: string;
    public initialValuation: bigint;
    public fiatCurrency: string;
    public initialTokenNumber: bigint;

    constructor(
        owner: string,
        title: string,
        description: string,
        initialValuation: bigint,
        fiatCurrency: string,
        initialTokenNumber: bigint
    ) {
        this.owner = owner;
        this.title = title;
        this.description = description;
        this.initialValuation = initialValuation;
        this.fiatCurrency = fiatCurrency;
        this.initialTokenNumber = initialTokenNumber;
    }
}

class ProjectAndToken {
    public project : Project;
    public token : string;

    constructor(
        project: Project,
        token: string
    ) {
        this.project = project;
        this.token = token;
    }

}

export default defineComponent({
    components: {
        ProjectEntryList
    },
    setup() {


        const projectsAndToken = ref<ProjectAndToken[]>([
            // {
            //     owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
            //     title : 'This is an awesome project',
            //     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
            //     total_valuation : 175200,
            //     part_percentage : 0.4,
            //     total_percentage : 20,
            //     completion : 100
            // },
            // {
            //     owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
            //     title : 'This is an awesome project',
            //     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
            //     total_valuation : 175200,
            //     part_percentage : 0.4,
            //     total_percentage : 20,
            //     completion : 47
            // },
            // {
            //     owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
            //     title : 'This is an awesome project',
            //     description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
            //     total_valuation : 175200,
            //     part_percentage : 0.4,
            //     total_percentage : 20,
            //     completion : 47
            // }
        ]);

        return {
            projectsAndToken
        }
    },
    async mounted() {
        const projects = await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[];
        this.projectsAndToken = projects;
    }
})
</script>