import { defineStore } from "pinia";

type color = 'neutral' | 'negative' | 'positive';

export interface IToast {
    id: number;
    message : string;
    color : color;
    timer : number;
}

export const useToastStore = defineStore('toastStore', {
    state : () => ({
        toasts : [] as IToast[],
        timer: 2000,
        toastId: 1
    }),
    actions : {
        addToast(message : string, color : color) {
            console.log("before", this.toasts);
            this.toasts.push({
                id : this.toastId,
                message,
                color,
                timer : 3000
            });

            console.log("before", this.toasts);

            this.toastId = this.toastId + 1;
        },
        removeToast(toastId : number) {
            const toastIndex = this.toasts.findIndex(toast => toast.id === toastId);
            this.toasts.splice(toastIndex, 1);
        }
    },
    persist: true
});