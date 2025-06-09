<script setup>
import {ref} from "vue";
import EditCategory from "./category/EditCategory.vue";
import DeleteCategory from "./category/DeleteCategory.vue";
import AddCategory from "./category/AddCategory.vue";

const showDialog = ref(false);

</script>

<template>
  <v-dialog max-width="500" v-model="showDialog">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
          v-bind="activatorProps"
          text="Add Category"
          variant="tonal"
          @click="handleShowDialog('add-category',0)"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">

    </template>
  </v-dialog>
</template>

<style scoped>

</style>