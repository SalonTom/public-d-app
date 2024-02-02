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
        style="display: flex; 
                flex-direction: column;
                gap: calc(16px + var(--figma-ratio));
                overflow-y: auto;
                max-height: 90%;">

        <div class="main-background main-stroke shadow">
            
            <!-- Project banner -->
            <div style="width:100%; height: 180px; position: relative; background-image: url('../../project_image.jpg'); background-size: contain; border-top-left-radius: 8px; border-top-right-radius: 8px">
            </div>
    
            <div style="padding: calc(24px + var(--figma-ratio)) 12px calc(24px + var(--figma-ratio)) 24px;">
                <div style="display: flex;
                        flex-direction: column;
                        gap: 12px;">
    
                    <div style="display: flex; justify-content: space-between; width: 100%;">
                        <div class="bold">
                            [{{ projectAndToken.project.symbol }}] {{ projectAndToken.project.title }}
                        </div>
                        <div v-if="!!numberOfTokenOwned || true" class="short" style="background-color: #8a30c2; padding: 4px 8px; border-radius: 4px;">
                            Balance : {{ ConversionUtils.from(numberOfTokenOwned) }} {{ projectAndToken.project.symbol }}
                        </div>
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
                        <div style="flex-grow: 1;">
                        <div class="bold">
                            Available tokens
                        </div>
                        <div>
                            {{ remainingTokens }} {{ projectAndToken.project.symbol }} 
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
                            {{ projectCompletion }}% completed
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
        <div v-if="!userOwnProject">

            <div style="display: flex; flex-direction: column; margin-top: 16px;">
                <div style="font-weight: bold;">
                    Investment
                </div>
                <div class="main-background main-stroke shadow" style="width: fit-content; padding: 12px 24px; margin-top: 12px; gap: 12px;">
                    <div class="form-group" v-if="remainingTokens > 0">
                        <label class="required" for="nbtoken">Number of token you want to buy</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" name="nbtoken" v-model="nbTokenInvest">
                            <div class="btn btn-primary" @click="investInProjectAsync">Buy {{ projectAndToken.project.symbol }}</div>
                        </div>
                    </div>
                    <div v-else>
                        This fundraising compaign is completed. Thanks to all the donators.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Page de création du projet -->
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
                                <input type="text" name="symbol" v-model="newProject.symbol" style="text-transform:uppercase">
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
        
        const myProjectRoute = useRoute().name === 'My Project';
        const userOwnProject = projectAddress === useAuthStore().signer || myProjectRoute;

        if (userOwnProject && !myProjectRoute) {
            router.replace({ name : 'My Project' })
        }
        
        const projectCompletion = ref(0);
        const userHasProject = ref(false);
        const projectAndToken = ref<ProjectAndToken>();

        const remainingTokens = ref(0);

        const creationInProgress = ref(false);

        const formErrors = ref<string[]>([]);
        const newProject = ref<Project>(new Project());

        const nbTokenInvest = ref(0);

        const numberOfTokenOwned = ref(BigInt(0));

        const mpListing = ref();

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
            remainingTokens,
            nbTokenInvest,
            mpListing,
            numberOfTokenOwned,
            ConversionUtils
        }
    },
    async mounted() {
        const addressFilter = this.myProjectRoute ? useAuthStore().signer : this.projectAddress;
        const projectsAndTokens = (await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[]).filter(proj => proj.project.owner === addressFilter);
        
        if (!!projectsAndTokens.length) {
            this.projectAndToken = projectsAndTokens[0];

            this.mpListing = await ContractUtils.getContractMarket().methods.listings(this.projectAndToken.token).call() as { amount : bigint, pricePerToken: bigint, seller : string};
            console.log(this.mpListing);
            this.remainingTokens = ConversionUtils.from(this.mpListing.amount);

            this.projectCompletion = Math.round((1 - this.remainingTokens / ConversionUtils.from(this.projectAndToken.project.initialTokenNumber)) * 100);
            this.userHasProject = true;

            this.numberOfTokenOwned = await ContractUtils.getContractToken(this.projectAndToken.token).methods.balanceOf(useAuthStore().signer).call();
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
                await ContractUtils.getContract().methods.createProject(this.newProject.title, this.newProject.description, this.newProject.symbol.toUpperCase(), ConversionUtils.to(Number(this.newProject.initialValuation)), ConversionUtils.to(Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                
                const newProjectAndToken = (await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[]).filter(proj => proj.project.owner === useAuthStore().signer)[0];
                await ContractUtils.getContractToken(newProjectAndToken.token).methods.approve(ContractUtils.getMarketContractAddress(), ConversionUtils.to(Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                await ContractUtils.getContractMarket().methods.addTokens(newProjectAndToken.token, ConversionUtils.to(Number(this.newProject.initialTokenNumber)), ConversionUtils.to(Number(this.newProject.initialValuation) / Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                this.newProject = new Project();
                this.projectAndToken = newProjectAndToken;

                this.mpListing = await ContractUtils.getContractMarket().methods.listings(this.projectAndToken.token).call() as { amount : bigint, pricePerToken: bigint, seller : string};
                this.remainingTokens = ConversionUtils.from(this.mpListing.amount);
                this.numberOfTokenOwned = await ContractUtils.getContractToken(this.projectAndToken.token).methods.balanceOf(useAuthStore().signer).call();
            }
        },

        async investInProjectAsync() {

            if (this.nbTokenInvest <= 0 || this.nbTokenInvest > this.remainingTokens) {
                alert(`Cannot buy 0 token or more than ${this.remainingTokens}`);
            } else {
                const nbTokenToBuy = ConversionUtils.to(this.nbTokenInvest);
                await ContractUtils.getContractMarket().methods.purchaseTokens(this.projectAndToken!.token, nbTokenToBuy).send({ from : useAuthStore().signer, value: `${ConversionUtils.from(BigInt(this.mpListing.pricePerToken)*nbTokenToBuy)}` });
                window.location.reload();
            }

            console.log(await ContractUtils.getContractToken(this.projectAndToken!.token).methods.balanceOf(useAuthStore().signer).call());
        }
    }
})
</script>

<style scoped>
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
}

.form-group>label {
    font-weight: bold;
}

input,
.form-group>input,
.form-group>textarea {
    width: 100%;
    min-height: 40px;
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