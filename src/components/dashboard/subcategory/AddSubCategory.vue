<script setup>
import axios from "axios";
import MaterialSymbolsAdd2Rounded from "~icons/material-symbols/add-2-rounded";
import ErrorText from "../../ErrorText.vue";
import {onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import RadixIconsCross2 from '~icons/radix-icons/cross-2'

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  }
})
const categories = ref([]);
const showDialog = ref(props.showDialog);
const selectedCategory = ref(null);
const newSubCategory = ref("");
const responseInfo = ref({success: false, message: ''});


const emits = defineEmits(['updateShowDialog']);

const fetchCategories = async () => {
  const response = await axios("http://127.0.0.1:8000/api/categories");
  categories.value = await response.data;

  console.log(categories.value);
};
onMounted(fetchCategories);


const updateShowDialog = (refetch = false) => {
  showDialog.value = false;
  emits('updateShowDialog', showDialog.value, refetch);
}



const addNewSubCategory = async () => {

  console.log('selectedCategory.value ', selectedCategory.value);
  console.log('newSubCategory ', newSubCategory.value);

  try {
    const response = await axios.post("http://localhost:8000/api/subcategories", {
      category_id: selectedCategory.value,
      sub_category_name: newSubCategory.value
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
      <h2>Add Sub Category</h2>

      <v-btn :icon="RadixIconsCross2" variant="tonal" size="small" @click="updateShowDialog(false)"></v-btn>
    </v-card-title>

    <v-card-text>

      <v-select
          variant="outlined"
          :items="categories"
          item-title="name"
          item-value="id"
          v-model="selectedCategory"
          label="Select a category"
          placeholder="Select a category"
          :value="selectedCategory || null"
      ></v-select>

      <v-text-field
          clearable
          label="Sub Category"
          variant="outlined"
          v-model="newSubCategory"
      />
      <ErrorText :message="responseInfo.message" :success="responseInfo.success" class="mb-3" />
      <v-btn
          :prepend-icon="MaterialSymbolsAdd2Rounded"
          class="px-5"
          @click="addNewSubCategory"
          :disabled="newSubCategory.length <= 2 || selectedCategory === null"
      >add</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
