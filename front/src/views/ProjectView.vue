<template>
    <div style="font-size: 18px; margin-bottom: calc(32px + var(--figma-ratio));">
        <div v-if="myProjectRoute">
            My Project {{ creationInProgress ? ' - Creation' : '' }}
        </div>
        <div v-else>
            Project : <span style="font-weight: bold;">{{ projectAddress }}</span>
        </div>
    </div>

    <!-- Consult project info -->
    <div v-if="!!projectAndToken"
        class="shadow main-background main-stroke"
        style="display: flex; 
                flex-direction: column;
                gap: calc(16px + var(--figma-ratio));
                overflow-y: auto;
                max-height: 90%;">
            
            <!-- Project banner -->
            <div style="width:100%; height: 180px; position: relative; background-image: url('../../project_image.jpg'); background-size: contain; border-top-left-radius: 8px; border-top-right-radius: 8px">
            </div>

            <div style="padding: calc(24px + var(--figma-ratio)) 12px calc(24px + var(--figma-ratio)) 24px;">
                <div style="display: flex;
                        flex-direction: column;
                        gap: 12px;">
    
                    <div class="bold">
                        {{ projectAndToken.project.title }}
                    </div>
                    <div style="max-height: calc(80px + var(--figma-ratio)); overflow: hidden; text-overflow: ellipsis;">
                        {{ projectAndToken.project.description }}
                    </div>
                </div>
                <div class="shadow main-background main-stroke" style="padding: 12px 8px;margin-top: 16px;">
                    <div style="display: flex; gap: 4px; justify-content: space-between; text-align: center; ">
                        <div style="flex-grow: 1;">
                            <div class="bold">
                                Fundraising target
                            </div>
                            <div>
                                {{ ConversionUtils.from(projectAndToken.project.initialValuation) }} ETH
                            </div>
                        </div>
                        <div style="flex-grow: 1;">
                            <div class="bold">
                                Capital Percentage
                            </div>
                            <div>
                                {{ ConversionUtils.from(projectAndToken.project.initialTokenNumber) }} %
                            </div>
                        </div>
                    </div>
                    <div style="display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        margin-top: calc(16px + var(--figma-ratio));
                        padding: 4px;">
    
                        <div 
                            class="main-stroke"
                            style="width: 100%; height: calc(8px + var(--figma-ratio));">
    
                            <div style="background-color: #5EFF5A;
                                    height: calc(8px + var(--figma-ratio));
                                    border-radius: 8px;"
                            :style="{ width : projectCompletion + '%'}"
                                >
                            </div>
                        </div>
                        <div class="short" style="width: auto; white-space: nowrap;">
                            {{  projectCompletion }}% completed
                        </div>
                    </div>
                </div>
            </div>
    </div>

    <!-- Page de créatio du projet -->
    <div v-else style="overflow-y: auto;
                max-height: 90%;">
        <template v-if="!creationInProgress">
            You haven't created your project yet. Let's do it !
            <div class="btn btn-primary" style="margin-top: 12px;" @click="creationInProgress = true">Create your project</div>
        </template>
        <template v-else>
            <form @submit.prevent="createProjectAsync">
                <div style="padding: 32px;">
                    <div style="display: flex;">
                        <div style="font-weight: bold; flex-grow: 1; max-width: 150px;">
                            General
                        </div>
                        <div class="main-background main-stroke shadow" style="max-width: 450px; width: 100%; padding: 12px 24px;">
                            <div class="form-group">
                                <label class="required" for="title">Title</label>
                                <input type="text" name="title" v-model="newProject.title">
                            </div>
                
                            <div class="form-group">
                                <label class="required" for="description">Description</label>
                                <textarea name="description" rows="5" v-model="newProject.description"></textarea>
                            </div>
                
                            <div class="form-group">
                                <label class="required" for="symbol">Symbol</label>
                                <input type="text" name="symbol" v-model="newProject.symbol">
                            </div>
                        </div>
                    </div>
                </div>
    
                <div style="padding: 32px;">
        
                    <div style="display: flex;">
                        <div style="font-weight: bold; flex-grow: 1; max-width: 150px;">
                            Valuation
                        </div>
                        <div class="main-background main-stroke shadow" style="max-width: 450px; width: 100%;  padding: 12px 24px;">
                            <div class="form-group">
                                <label class="required" for="valuation">Company valuation (in ETH)</label>
                                <input class="required" type="number" min="0" name="valuation" v-model="newProject.initialValuation">
                            </div>
                
                            <div class="form-group">
                                <label class="required" for="tokenNumber">Number of part listed</label>
                                <input type="number" name="tokenNumber" min="1" max="100" v-model="newProject.initialTokenNumber">
                            </div>
                        </div>
                    </div>
                </div>
                <ul v-if="formErrors.length">
                    <li v-for="error in formErrors" :key="error" style="color: red">
                        Field <span style="font-weight: bold;">{{ error }}</span> is missing.
                    </li>
                </ul>
                <div style="width: 100%; max-width: 625px; display: flex; justify-content: end;">
                    <button class="btn btn-primary" type="submit" style="color:#FAFAFA; margin-top: 12px;" @click="creationInProgress = true">Create your project</button>
                </div>
            </form>

        </template>


    </div>
    <!-- <div @click="create">
        Click here to create one
    </div> -->
</template>
<script lang="ts">
import ContractUtils from '@/utils/ContractUtils';
import { defineComponent, ref } from 'vue';
import ProjectAndToken from "@/models/ProjectAndToken";
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';
import router from '@/router';
import ConversionUtils from '@/utils/ConversionUtils';
import Project from '@/models/Project';

export default defineComponent({
    setup() {

        const projectAddress = useRoute().query['project_address'];
        const userOwnProject = projectAddress === useAuthStore().signer;
        const myProjectRoute = useRoute().name === 'My Project';

        if (userOwnProject && !myProjectRoute) {
            router.replace({ name : 'My Project' })
        }
        
        const projectCompletion = ref(0);
        const userHasProject = ref(false);
        const projectAndToken = ref<ProjectAndToken>();

        const creationInProgress = ref(false);

        const formErrors = ref<string[]>([]);
        const newProject = ref<Project>(new Project());

        return {
            projectAddress,
            userOwnProject,
            myProjectRoute,
            userHasProject,
            projectCompletion,
            projectAndToken,
            creationInProgress,
            newProject,
            formErrors,
            ConversionUtils
        }
    },
    async mounted() {
        const remainingTokens = ConversionUtils.from(BigInt(17)*BigInt(10)**ConversionUtils._nbDecimal);
        const addressFilter = this.myProjectRoute ? useAuthStore().signer : this.projectAddress;
        const projectsAndTokens = (await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[]).filter(proj => proj.project.owner === addressFilter);
        
        if (!!projectsAndTokens.length) {
            this.projectAndToken = projectsAndTokens[0];
            this.projectCompletion = Math.round((1 - remainingTokens / ConversionUtils.from(this.projectAndToken.project.initialTokenNumber)) * 100);
            this.userHasProject = true;
        }
    },
    methods: {
        async createProjectAsync() {
            this.formErrors = [];
            const requiredFields = ["title", "description", "initialValuation", "initialTokenNumber", "symbol"];
            requiredFields.forEach(field => {
                if (!this.newProject[field as keyof typeof this.newProject]) {
                    this.formErrors.push(field);
                }
            });

            if (!this.formErrors.length) {
                await ContractUtils.getContract().methods.createProject(this.newProject.title, this.newProject.description, this.newProject.symbol, ConversionUtils.to(Number(this.newProject.initialValuation)), ConversionUtils.to(Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer })
                this.newProject = new Project();
                router.replace({ name : 'My Project', query: { project_address : useAuthStore().signer }})
            }
        }
    }
})
</script>

<style>
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
}

.form-group>label {
    font-weight: bold;
}

.form-group>input,
.form-group>textarea {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: solid 1px #27262A;
    background-color: #3A393E;
    padding: 4px 12px;
    color: #FAFAFA;
}

.form-group>textarea {
    height: auto !important;
    resize: none;
}

.form-group>input::placeholder,
.form-group>textarea::placeholder {
    color: #AEAEAE;
    font-size: 12px;
}

.form-group>.required::after {
    content: ' *';
    color: #5C6BC0;
    font-size: 18px;
}
</style>