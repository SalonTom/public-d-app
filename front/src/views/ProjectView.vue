<template>
    <div style="font-size: 18px; margin-bottom: calc(32px + var(--figma-ratio));">
        <div v-if="myProjectRoute">
            My Project {{ creationInProgress ? ' - Creation' : '' }}
        </div>
        <div v-else>
            Project : <span style="font-weight: bold;">{{ projectAddress }}</span>
        </div>
    </div>

    <Transition>
        <div v-if="initialized" style="overflow-y: auto; max-height: 90%;">

            <!-- Consult project info -->
            <div v-if="!!projectAndToken"
                class="appear"
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
                                <div class="short" style="background-color: #8a30c2; padding: 4px 8px; border-radius: 4px;">
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
            <div v-else>
                <div v-if="!creationInProgress" class="appear">
                    You haven't created your project yet. Let's do it !
                    <div class="btn btn-primary" style="margin-top: 12px;" @click="creationInProgress = true">Create your project</div>
                </div>
                <div v-else>
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
                </div>
            </div>

            <!-- Loading screens when project creation -->
            <div v-if="creationTransactionStep > 0" style="position: absolute; z-index: 1; top:0; left: 0; bottom: 0; right: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(4px);">
                <div style="font-weight: bold; margin-bottom: 24px">{{ creationTransactionStep }} / 3</div>
                
                <span v-if="creationTransactionStep == 1">Confirm the creation transaction</span>
                <span v-if="creationTransactionStep == 2">Give the marketplace the right to handle your tokens for you</span>
                <span v-if="creationTransactionStep == 3">Confirm the listing of your tokens</span>
                <img src="../assets/svg/hourglass.svg" style="animation: rotate 3.5s infinite; margin-top: 24px;">
            </div>
    
        </div>
        <div v-else>
            <LazyLoading></LazyLoading>
        </div>
    </Transition>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';

import { useAuthStore } from '@/stores/AuthStore';

import ContractUtils from '@/utils/ContractUtils';
import ConversionUtils from '@/utils/ConversionUtils';

import Project from '@/models/Project';
import ProjectAndToken from "@/models/ProjectAndToken";

import LazyLoading from '@/components/LazyLoading.vue';
import { useToastStore } from '@/stores/ToastStore';

export default defineComponent({
    components: {
        LazyLoading
    },
    setup() {

        // Address of the current project
        const projectAddress = useRoute().query['project_address'];
        
        // Is the current route the route to access my project ?
        const myProjectRoute = useRoute().name === 'My Project';

        // Is the user the owner of the projet ?
        const userOwnProject = projectAddress === useAuthStore().signer || myProjectRoute;
        
        // Fund raisiing completion
        const projectCompletion = ref(0);

        // Does the user have already listed a project ?
        const userHasProject = ref(false);

        // Project and token information
        const projectAndToken = ref<ProjectAndToken>();

        // Remaining tokens in the campaign.
        const remainingTokens = ref(0);

        // Is the user creating a project ?
        const creationInProgress = ref(false);

        // Errors raised on the form validation.
        const formErrors = ref<string[]>([]);

        // New project user when creating project.
        const newProject = ref<Project>(new Project());

        // Number of token a user wants to buy.
        const nbTokenInvest = ref(0);

        // Number of tokens a user own.
        const numberOfTokenOwned = ref(BigInt(0));

        // Listing of the token in the marketplace contract.
        const mpListing = ref();

        // Is the view initialized ?
        const initialized = ref(false);

        // Store to deal with the toasts.
        const toastStore = useToastStore();

        // Creation process current step (3 max).
        const creationTransactionStep = ref(0);

        if (userOwnProject && !myProjectRoute) {
            router.replace({ name : 'My Project' })
        }

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
            initialized,
            toastStore,
            creationTransactionStep,
            ConversionUtils
        }
    },
    async mounted() {

        try {

            // Retrieve the current project and token infos
            const addressFilter = this.myProjectRoute ? useAuthStore().signer : this.projectAddress;
            const projectsAndTokens = (await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[]).filter(proj => proj.project.owner === addressFilter);
            
            // Set up the infos if there is a project.
            if (!!projectsAndTokens.length) {
                this.projectAndToken = projectsAndTokens[0];
    
                this.mpListing = await ContractUtils.getContractMarket().methods.listings(this.projectAndToken.token).call() as { amount : bigint, pricePerToken: bigint, seller : string};

                this.remainingTokens = ConversionUtils.from(this.mpListing.amount);
    
                this.projectCompletion = Math.round((1 - this.remainingTokens / ConversionUtils.from(this.projectAndToken.project.initialTokenNumber)) * 100);
                this.userHasProject = true;
    
                this.numberOfTokenOwned = await ContractUtils.getContractToken(this.projectAndToken.token).methods.balanceOf(useAuthStore().signer).call();
    
            }

            this.initialized = true;

        } catch(error) {
            this.toastStore.addToast('Failed to get the project data.', 'negative');
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

                try {

                    // Create the project
                    this.creationTransactionStep = 1;
                    await ContractUtils.getContract().methods.createProject(this.newProject.title, this.newProject.description, this.newProject.symbol.toUpperCase(), ConversionUtils.to(Number(this.newProject.initialValuation)), ConversionUtils.to(Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                    
                    // User has to approve the marketplace as the handler for the tokens.
                    this.creationTransactionStep = 2;
                    const newProjectAndToken = (await ContractUtils.getContract().methods.getProjects().call() as ProjectAndToken[]).filter(proj => proj.project.owner === useAuthStore().signer)[0];
                    await ContractUtils.getContractToken(newProjectAndToken.token).methods.approve(ContractUtils.getMarketContractAddress(), ConversionUtils.to(Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                    
                    // User has to list the number of tokens it wants to sell.
                    this.creationTransactionStep = 3;
                    await ContractUtils.getContractMarket().methods.addTokens(newProjectAndToken.token, ConversionUtils.to(Number(this.newProject.initialTokenNumber)), ConversionUtils.to(Number(this.newProject.initialValuation) / Number(this.newProject.initialTokenNumber))).send({ from : useAuthStore().signer });
                    this.newProject = new Project();
                    this.projectAndToken = newProjectAndToken;
    
                    // Update the project info
                    this.mpListing = await ContractUtils.getContractMarket().methods.listings(this.projectAndToken.token).call() as { amount : bigint, pricePerToken: bigint, seller : string};
                    this.remainingTokens = ConversionUtils.from(this.mpListing.amount);
                    this.numberOfTokenOwned = await ContractUtils.getContractToken(this.projectAndToken.token).methods.balanceOf(useAuthStore().signer).call();
    
                    this.toastStore.addToast('Project succefully listed !', 'positive');

                } catch(error) {
                    this.toastStore.addToast('Error while creating the project.', 'negative');
                } finally {
                    this.creationTransactionStep = 0;
                }
            }
        },

        async investInProjectAsync() {

            try {
                if (this.nbTokenInvest <= 0 || this.nbTokenInvest > this.remainingTokens) {
                    this.toastStore.addToast(`Cannot buy 0 token or more than ${this.remainingTokens}`, "negative");
                } else {
                    const nbTokenToBuy = ConversionUtils.to(this.nbTokenInvest);
                    await ContractUtils.getContractMarket().methods.purchaseTokens(this.projectAndToken!.token, nbTokenToBuy).send({ from : useAuthStore().signer, value: `${ConversionUtils.from(BigInt(this.mpListing.pricePerToken)*nbTokenToBuy)}` });
                    window.location.reload();
                    this.toastStore.addToast(`You successfully bought ${ConversionUtils.from(nbTokenToBuy)} ${this.projectAndToken?.project.symbol}`, "positive");
                }
            } catch(error) {
                this.toastStore.addToast(`Investment process failed.`, 'negative');
                this.nbTokenInvest = 0;
            }

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