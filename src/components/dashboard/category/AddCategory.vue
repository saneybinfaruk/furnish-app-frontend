<script setup>
import axios from "axios";
import MaterialSymbolsAdd2Rounded from "~icons/material-symbols/add-2-rounded";
import ErrorText from "../../ErrorText.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import RadixIconsCross2 from '~icons/radix-icons/cross-2'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})

const showDialog = ref(props.showDialog);
const newCategory = ref("");
const responseInfo = ref({success: false, message: ''});


const emits = defineEmits(['updateShowDialog']);

const updateShowDialog = (refetch = false) => {
  showDialog.value = false;
  emits('updateShowDialog', showDialog.value, refetch);
}





const addNewCategory = async () => {
  try {
    const response = await axios.post("http://localhost:8000/api/categories", {
      new_category: newCategory.value,
    });

    responseInfo.value = response.data;

    // Check if the response indicates success
    if (responseInfo.value.success) {
      // Redirect to the home page after a short delay
      setTimeout(() => {
        updateShowDialog(true);
      }, 500); // 2 seconds delay for user to see the success message
    }
  } catch (error) {
    // Handle errors and show an appropriate message
    responseInfo.value = { success: false, message: error.response?.data?.message || "An error occurred." };
  }
  

};


</script>

<template>
  <v-card>

    <v-card-title class="d-flex justify-space-between align-center py-3">
      <h2>Add Category</h2>

      <v-btn :icon="RadixIconsCross2" variant="tonal" size="small" @click="updateShowDialog(false)"></v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
          clearable
          label="Category"
          variant="outlined"
          v-model="newCategory"
      />
      <ErrorText :message="responseInfo.message" :success="responseInfo.success" class="mb-3" />
      <v-btn
          :prepend-icon="MaterialSymbolsAdd2Rounded"
          class="px-5"
          @click="addNewCategory"
          :disabled="newCategory.length <= 2"
      >add</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
