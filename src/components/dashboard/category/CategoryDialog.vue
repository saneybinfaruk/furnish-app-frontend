<script setup>

import EditCategory from "./EditCategory.vue";
import DeleteCategory from "./DeleteCategory.vue";
import AddCategory from "./AddCategory.vue";
import {reactive, ref} from "vue";

const props = defineProps({
  handleShowDialog: Function,
  updateShowDialog: Function
});
const showDialog = ref(false);
const setInfo = reactive({
  componentName: '',
  categoryId: ''
})


</script>

<template>
  <v-dialog max-width="500" v-model="showDialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          v-bind="activatorProps"
          text="Add New Category"
          variant="tonal"
          @click="handleShowDialog('add-category',0)"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <AddCategory v-if="setInfo.componentName === 'add-category'" :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
      <EditCategory v-if="setInfo.componentName === 'edit-category'" :category-id="setInfo.categoryId"  :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
      <DeleteCategory v-if="setInfo.componentName === 'delete-category'" :category-id="setInfo.categoryId"  :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
    </template>
  </v-dialog>
</template>

<style scoped>

</style>