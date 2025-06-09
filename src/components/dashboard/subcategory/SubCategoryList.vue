<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";

import RadixIconsPencil2 from "~icons/radix-icons/pencil-2";
import RadixIconsTrash from "~icons/radix-icons/trash";
import formatDate from "../../../utils/FormatDate.js";
import AddSubCategory from "./AddSubCategory.vue";
import AddCategory from "../category/AddCategory.vue";
import EditCategory from "../category/EditCategory.vue";
import EditSubCategory from "./EditSubCategory.vue";
import DeleteSubCategory from "./DeleteSubCategory.vue";

const subcategories = ref([]);
const headers = [
  {
    title: "Sub Category",
    align: "start",
    sortable: false,
    key: "name",
  },

  {
    title: "Sub Category Slug",
    align: "start",
    sortable: false,
    key: "slug",
  },
  {
    title: "Category",
    align: "start",
    sortable: false,
    key: "category.name",
  },
  {
    title: "Created At",
    align: "start",
    sortable: false,
    key: "created_at",
  },
  {
    title: "Actions",
    align: "start",
    sortable: false,
    key: "action",
  },
];
const showDialog = ref(false);
const setInfo = reactive({
  componentName: '',
  subCategoryId: '',
  categoryId: '',
})

const fetchSubCategories = async () => {
  const response = await axios("http://127.0.0.1:8000/api/subcategories");
  subcategories.value = await response.data;

};

onMounted(fetchSubCategories);

const updateShowDialog = (value, refetch) => {
  showDialog.value = value;

  console.log(refetch)

  if(refetch) fetchSubCategories();
}

const handleShowDialog = (componentName, subCategoryId, categoryId ) => {
  showDialog.value = true;
  setInfo.componentName = componentName;
  setInfo.subCategoryId = subCategoryId;
  setInfo.categoryId = categoryId;

}

</script>

<template>
  <div class="text-h6 my-2 d-flex justify-space-between px-4 items-center">
    <h1>Sub Category List</h1>
    <v-dialog max-width="500" v-model="showDialog">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            v-bind="activatorProps"
            text="Add Sub Category"
            variant="tonal"
            @click="handleShowDialog('add-sub-category',0,0)"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <AddSubCategory v-if="setInfo.componentName === 'add-sub-category'" :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
        <EditSubCategory v-if="setInfo.componentName === 'edit-sub-category'" :category-id="setInfo.categoryId" :sub-category-id="setInfo.subCategoryId" :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
        <DeleteSubCategory v-if="setInfo.componentName === 'delete-sub-category'" :category-id="setInfo.categoryId" :sub-category-id="setInfo.subCategoryId" :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>

      </template>
    </v-dialog>
  </div>

  <v-data-table-server :headers="headers" :items="subcategories">
    <template v-slot:item.name="{ item }">
      <p>{{ item.name }}</p>
    </template>

    <template v-slot:item.category="{ item }">
      <p>{{ item.category?.name || 'N/A' }}</p>
    </template>

    <template v-slot:item.created_at="{ item }">
      <p>{{ formatDate(item.created_at) }}</p>
    </template>

    <template v-slot:item.action="{ item }">
      <v-sheet class="d-flex gap-2">

        <v-btn
            :icon="RadixIconsPencil2"
            variant="tonal"
            class="bg-grey-lighten-5"
            size="x-small"
            @click="handleShowDialog('edit-sub-category', item.id, item.category_id)"
        />


        <v-btn
            :icon="RadixIconsTrash"
            variant="tonal"
            color="red"
            size="x-small"
            @click="handleShowDialog('delete-sub-category', item.id, item.category_id)"
        ></v-btn>
      </v-sheet>
    </template>

    <template v-slot:tfoot>
      <tr>
        <td>
          <v-text-field></v-text-field>
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<style scoped>

</style>