<template>
    Mets moi une petite phoito stp ;)
 
    <input type="file" name="file" ref="fileInput"/>   
    <input type = "submit" value="Upload" @click="uploadFile">

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const filePath = ref('');
        return {
            filePath
        }
    },
    methods: {
        fileUploaded(e  : Event) {
            console.log(e)
        },
        test() {
            console.log(this.filePath);
        },
        uploadFile() {
            const fileInput = (this.$refs.fileInput as HTMLInputElement);
            const file = !!fileInput.files ? fileInput.files[0] : null;

            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                console.log(file)

                fetch('http://127.0.0.1:5000/verify_age', {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    console.log(response);
                });
            }
            
        }
    }
})
</script>