<template>
    <div style="border-radius: 4px; padding: 8px 12px; background-color: #1D1C20; z-index: 1;" :style="toastColors[toast.color]">
        {{ toast.message }}
    </div>
</template>

<script lang="ts">
import { useToastStore, type IToast } from '@/stores/ToastStore';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
    props: {
        toast : {
            type : Object as PropType<IToast>,
            required: true
        }
    },
    setup() {
        const toastColors = {
            neutral : {
                border: 'solid 1px #3A393E',
            },
            positive : {
                border: 'solid 1px #2A9964',
                color: '#38CA84'
            },
            negative : {
                border: 'solid 1px #AB253D',
                color: '#EA4361'
            }
        };

        return {
            toastColors
        }
    },
    created() {
        setTimeout(() => {
            useToastStore().removeToast(this.$props.toast.id);
        }, this.$props.toast.timer);
    }
})

</script>