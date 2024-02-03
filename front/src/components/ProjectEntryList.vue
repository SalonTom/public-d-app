<template>
        <!-- Project info -->
        <div style="width: 66%; 
                padding: calc(24px + var(--figma-ratio)) 12px calc(24px + var(--figma-ratio)) 24px;
                display: flex; 
                flex-direction: column;
                gap: calc(16px + var(--figma-ratio));">

            <div style="display: flex;
                    flex-direction: column;
                    gap: 12px">

                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div class="bold">
                        [{{ projectAndToken.project.symbol }}] {{ projectAndToken.project.title }}
                    </div>
                    <div class="short" style="background-color: #8a30c2; padding: 4px 8px; border-radius: 4px;">
                        Balance : {{ ConversionUtils.from(numberOfTokenOwned) }} {{ projectAndToken.project.symbol }}
                    </div>
                </div>
                <div style="max-height: calc(80px + var(--figma-ratio)); overflow: hidden; text-overflow: ellipsis;">
                    {{ projectAndToken.project.description }}
                </div>
            </div>
            <div class="shadow main-background main-stroke" style="padding: 12px 8px;">
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
                        {{  projectCompletion }}% completed
                    </div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: calc(16px + var(--figma-ratio)); margin-top: calc(16px + var(--figma-ratio));">
                <div class="btn btn-primary" @click="goToProjectPage">Invest in the project</div>
                <div class="btn btn-txt" @click="goToProjectPage">See project details</div>
            </div>
        </div>

        <!-- Project banner -->
        <div style="width: 34%; position: relative; background-image: url('../project_image.jpg'); background-size: cover; border-top-right-radius: 8px; border-bottom-right-radius: 8px;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to right, rgba(29, 28, 32, 1), rgba(29, 28, 32, 0));">

            </div>
        </div>
</template>
<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/AuthStore';

import type ProjectAndToken from '@/models/ProjectAndToken';

import ConversionUtils from '@/utils/ConversionUtils';
import ContractUtils from '@/utils/ContractUtils';


export default defineComponent({
    props: {
        projectAndToken : {
            type : Object as PropType<ProjectAndToken>,
            required : true
        }
    },
    setup($props) {

        const projectToken = $props.projectAndToken.token;
        const projectCompletion = ref(0);
        const remainingTokens = ref(0);
        const numberOfTokenOwned = ref(BigInt(0));

        return {
            projectCompletion,
            projectToken,
            remainingTokens,
            numberOfTokenOwned,
            ConversionUtils
        }
    },
    async mounted () {
        const mpListing = await ContractUtils.getContractMarket().methods.listings(this.projectToken).call() as { amount : bigint, price_per_token: bigint, seller : string};
        this.remainingTokens = ConversionUtils.from(mpListing.amount);
        this.numberOfTokenOwned = await ContractUtils.getContractToken(this.projectAndToken.token).methods.balanceOf(useAuthStore().signer).call();
    
        this.projectCompletion = Math.round((1 - this.remainingTokens / ConversionUtils.from(this.$props.projectAndToken.project.initialTokenNumber)) * 100);
    },
    methods: {
        goToProjectPage() {
            router.push({ 
                name : 'View Project', 
                query: { project_address : this.projectAndToken.project.owner }
            });
        }
    }
})
</script>