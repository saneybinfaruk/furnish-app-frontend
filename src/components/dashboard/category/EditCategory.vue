<script setup>
import axios from "axios";
import MaterialSymbolsAdd2Rounded from "~icons/material-symbols/add-2-rounded";
import ErrorText from "../../ErrorText.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import RadixIconsCross2 from '~icons/radix-icons/cross-2'
import RadixIconsUpdate from '~icons/radix-icons/update';
import MaterialSymbolsRefresh from '~icons/material-symbols/refresh';

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  categoryId: {
    type: Number,
    default: 0
  }
})

console.log(props.categoryId);
const showDialog = ref(props.showDialog);
const category = ref('');
const responseInfo = ref({success: false, message: ''});


const emits = defineEmits(['updateShowDialog']);

const updateShowDialog = (refetch = false) => {
  showDialog.value = false;
  emits('updateShowDialog', showDialog.value, refetch);
}


const getCategory = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/categories/${props.categoryId}`);

    category.value = response.data.name;
  } catch (error) {
    // Handle errors and show an appropriate message
    responseInfo.value = {success: false, message: error.response?.data?.message || "An error occurred."};
  }


};

const updateCategory = async () => {

  try {
    const response = await axios.put(`http://localhost:8000/api/categories/${props.categoryId}`, {
      category: category.value,
    });

    const success = await response.data.success;
    if (success) updateShowDialog(true);

  } catch (error) {
    responseInfo.value = {success: false, message: error.response?.data?.message || "An error occurred."};

  }


  console.log('Updated Category ==> ', category.value)
}

onMounted(getCategory);


</script>

<template>
  <v-card>

    <v-card-title class="d-flex justify-space-between align-center py-3">
      <h2>Edit Category</h2>

      <v-btn :icon="RadixIconsCross2" variant="tonal" size="small" @click="updateShowDialog(false)"></v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
          clearable
          label="Update Category"
          variant="outlined"
          v-model="category"
      ></v-text-field>
      <ErrorText :message="responseInfo.message" :success="responseInfo.success" class="mb-3"/>
      <v-btn
          :prepend-icon="MaterialSymbolsRefresh"
          class="px-5"
          @click="updateCategory"
          :disabled="category === ''"
          variant="tonal"
      >update
      </v-btn
      >
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
