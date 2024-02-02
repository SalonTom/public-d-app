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

                <div class="bold">
                    {{ projectAndToken.project.title }}
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
import { defineComponent, type PropType } from 'vue';
import ConversionUtils from '@/utils/ConversionUtils';
import router from '@/router';
import { useAuthStore } from '@/stores/AuthStore';
import type ProjectAndToken from '@/models/ProjectAndToken';


export default defineComponent({
    props: {
        projectAndToken : {
            type : Object as PropType<ProjectAndToken>,
            required : true
        }
    },
    setup($props) {

        console.log($props)

        // Call to MP to know the remaining listed tokens DON'T FORGET THE CONVERSION !!
        const remainingTokens = ConversionUtils.from(BigInt(17)*BigInt(10)**ConversionUtils._nbDecimal);
        console.log($props.projectAndToken.project.initialTokenNumber)
        const projectCompletion = Math.round((1 - remainingTokens / ConversionUtils.from($props.projectAndToken.project.initialTokenNumber)) * 100);

        return {
            projectCompletion,
            ConversionUtils
        }
    },
    methods: {
        goToProjectPage() {
            router.replace({ 
                name : 'View Project', 
                query: { project_address : this.projectAndToken.project.owner }
            });
        }
    }
})
</script>