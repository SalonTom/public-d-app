<template>
    <div style="font-size: 18px; margin-bottom: calc(32px + var(--figma-ratio));">
        Feed List
    </div>
    <div style="display: flex;
        flex-direction: column;
        gap: calc(24px + var(--figma-ratio));
        max-height: 90%;
        overflow-y: auto;
        padding-right: 8px;">

        <div 
            v-for="project in projects"
            :key="project.owner" 
            class="shadow main-background main-stroke" 
            style="display: flex;">

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
                        {{ project.title }}
                    </div>
                    <div style="max-height: calc(80px + var(--figma-ratio)); overflow: hidden; text-overflow: ellipsis;">
                        {{ project.description }}
                    </div>
                </div>
                <div class="shadow main-background main-stroke" style="padding: 12px 8px;">
                    <div style="display: flex; gap: 4px; justify-content: space-between; text-align: center; ">
                        <div style="flex-grow: 1;">
                            <div class="bold">
                                Fundraising target
                            </div>
                            <div>
                                {{ project.total_valuation }} €
                            </div>
                        </div>
                        <div style="flex-grow: 1;">
                            <div class="bold">
                                Capital Percentage
                            </div>
                            <div>
                                {{ project.total_percentage }} %
                            </div>
                        </div>
                        <div style="flex-grow: 1;">
                            <div class="bold">
                                Part Percentage
                            </div>
                            <div>
                                {{ project.part_percentage }} %
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
                            :style="{ width : project.completion + '%'}"
                                >
                            </div>
                        </div>
                        <div class="short" style="width: auto; white-space: nowrap;">
                            {{  project.completion }}% completed
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: calc(16px + var(--figma-ratio)); margin-top: calc(16px + var(--figma-ratio));">
                    <div class="btn btn-primary" @click="">Invest in the project</div>
                    <div class="btn btn-txt" @click="">See project details</div>
                </div>
            </div>

            <!-- Project banner -->
            <div style="width: 34%; position: relative; background-image: url('./project_image.jpg'); background-size: cover; border-top-right-radius: 8px; border-bottom-right-radius: 8px;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to right, rgba(29, 28, 32, 1), rgba(29, 28, 32, 0));">

                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {

        const projects = [
            {
                owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
                title : 'This is an awesome project',
                description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
                total_valuation : 175200,
                part_percentage : 0.4,
                total_percentage : 20,
                completion : 100
            },
            {
                owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
                title : 'This is an awesome project',
                description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
                total_valuation : 175200,
                part_percentage : 0.4,
                total_percentage : 20,
                completion : 47
            },
            {
                owner : '0x57e1fe4e7f4f4f7f1e788d4d47d4d7e',
                title : 'This is an awesome project',
                description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac augue eget justo auctor dignissim. Vestibulum euismod, libero nec luctus accumsan, justo justo fringilla justo, id rhoncus felis elit at odio. Nullam vel dolor vel elit convallis feugiat. Sed vehicula sapien in magna convallis, in dictum turpis convallis. Curabitur vehicula, augue in accumsan varius, nisl turpis efficitur nunc, a dapibus tortor tortor vel tellus. Nulla facilisi. Aenean sed dui a quam vehicula eleifend nec et tortor. Mauris feugiat consequat nisi, vel interdum odio bibendum in. Suspendisse lacinia eu elit eget auctor. Integer ullamcorper risus in felis aliquam, vel sodales justo malesuada. Vivamus aliquet venenatis est, et fringilla metus fermentum vel. Nunc nec fringilla libero. Vivamus euismod ante id ex cursus, eget ultricies ligula fringilla.',
                total_valuation : 175200,
                part_percentage : 0.4,
                total_percentage : 20,
                completion : 47
            }
        ]
        return {
            projects
        }
    }
})
</script>