<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import RadixIconsPencil2 from "~icons/radix-icons/pencil-2";
import RadixIconsTrash from "~icons/radix-icons/trash";
import formatDate from "../../../utils/FormatDate.js";
import AddCategory from "./AddCategory.vue";
import EditCategory from "./EditCategory.vue";
import DeleteCategory from "./DeleteCategory.vue";

const categories = ref([]);
const headers = [
  {
    title: "Category",
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: "Slug",
    align: "start",
    sortable: false,
    key: "slug",
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
  categoryId: ''
})

const fetchCategories = async () => {
  const response = await axios("http://127.0.0.1:8000/api/categories");
  categories.value = await response.data;

  console.log(categories.value);
};

onMounted(fetchCategories);

const updateShowDialog = (value, fetch) => {
  showDialog.value = value;

  console.log(fetch)

   if(fetch) fetchCategories();
}

const handleShowDialog = (componentName, categoryId) => {
  showDialog.value = true;
  setInfo.componentName = componentName;
  setInfo.categoryId = categoryId;
}


</script>

<template>
  <div class="text-h6 my-2 d-flex justify-space-between px-4 items-center">
    <h1>Category List</h1>
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
        <AddCategory v-if="setInfo.componentName === 'add-category'" :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
        <EditCategory v-if="setInfo.componentName === 'edit-category'" :category-id="setInfo.categoryId"  :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
        <DeleteCategory v-if="setInfo.componentName === 'delete-category'" :category-id="setInfo.categoryId"  :show-dialog="showDialog" @update-show-dialog="updateShowDialog"/>
      </template>
    </v-dialog>
  </div>

  <v-data-table-server :headers="headers" :items="categories">

    <template v-slot:item.name="{ item }">
      <p>{{ item.name }}</p>
    </template>

    <template v-slot:item.slug="{ item }">
      <p>{{ item.slug }}</p>
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
            @click="handleShowDialog('edit-category', item.id)"

        ></v-btn>


        <v-btn
            :icon="RadixIconsTrash"
            variant="tonal"
            color="red"
            size="x-small"
            @click="handleShowDialog('delete-category', item.id)"
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
