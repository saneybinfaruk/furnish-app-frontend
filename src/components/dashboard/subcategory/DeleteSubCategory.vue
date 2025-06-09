<script setup>

import {ref} from "vue";
import RadixIconsCross2 from "~icons/radix-icons/cross-2";
import axios from "axios";

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false
  },
  subCategoryId: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(['updateShowDialog']);


console.log(props.subCategoryId);
const showDialog = ref(props.showDialog);
const category = ref('');
const responseInfo = ref({success: false, message: ''});

const updateShowDialog = (refetch = false) => {
  showDialog.value = false;
  emits('updateShowDialog', showDialog.value, refetch);
}

const deleteCategory = async () => {
  console.log('Delete');

  try {
    const response = await axios.delete(`http://localhost:8000/api/subcategories/${props.subCategoryId}`);

    const success = await response.data.success;
    if (success) updateShowDialog(true);

  } catch (error) {
    responseInfo.value = {success: false, message: error.response?.data?.message || "An error occurred."};

  }
}


</script>

<template>
  <v-card>

    <v-card-title class="d-flex justify-space-between align-center py-3">
      <h2>Delete Sub Category</h2>

      <v-btn :icon="RadixIconsCross2" variant="tonal" size="small" @click="updateShowDialog(false)"></v-btn>
    </v-card-title>

    <v-divider opacity="0.6"></v-divider>
    <v-card-text>
      Warning: Deleting this sub category will also uncategorize all products associated with it. This action cannot be
      undone. Are you sure you want to delete this category?

    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
          text="Cancel"
          variant="plain"
          @click="updateShowDialog(false)"
      ></v-btn>

      <v-btn
          color="error"
          text="Delete"
          variant="tonal"
          @click="deleteCategory"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>