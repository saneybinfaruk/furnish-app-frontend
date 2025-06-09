<script setup>
import formatDate from "@/utils/FormatDate.js";
import RadixIconsPencil2 from "~icons/radix-icons/pencil-2";
import RadixIconsTrash from "~icons/radix-icons/trash";
import { usePiniaStore } from "@/store/store";

const props = defineProps({
  allProducts: Array,
});
const headers = [
  {
    title: "Product",
    align: "start",
    sortable: false,
    key: "img_url",
  },

  {
    title: "Category",
    align: "start",
    sortable: false,
    key: "category.name",
  },

  {
    title: "Sub Category",
    align: "start",
    sortable: false,
    key: "sub_category.name",
  },

  {
    title: "Price",
    align: "start",
    sortable: false,
    key: "price",
  },

  {
    title: "Date",
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

const store = usePiniaStore();

const handleClick = (productId, componentName) => {
  store.dialog.isVisible = true;
  console.log("Dialog", store.dialog);
  store.dialog.selectedProductId = productId;
  store.dialog.componentName = componentName;
};
</script>

<template>
  <v-data-table-server
    :items="allProducts.products.data"
    :headers="headers"
    :items-length="allProducts.products.data.length"
  >
    <template v-slot:item.img_url="{ item }">
      <v-sheet class="my-2 d-flex gap-2 items-center">
        <div class="bg-green-lighten-5 w-[75px] h-[75px] pa-2 rounded-md">
          <v-img
            :src="`https://via.assets.so/furniture.png?id=${item.id}&q=50&w=360&h=360&fit=fill`"
            height="80"
            width="80"
          />
        </div>
        <h1 class="text-subtitle-2">{{ item.name }}</h1>
      </v-sheet>
    </template>

    <template v-slot:item.category.name="{ item }">
      <p>{{ item.category.name }}</p>
    </template>

    <template v-slot:item.sub_category.name="{ item }">
      <p>{{ item.sub_category.name }}</p>
    </template>

    <template v-slot:item.price="{ item }">
      <p class="font-semibold font-md">${{ item.price }}</p>
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
          size="small"
          @click="() => handleClick(item.id, 'edit-product')"
        ></v-btn>
        <v-btn
          :icon="RadixIconsTrash"
          variant="tonal"
          color="red"
          size="small"
          @click="() => handleClick(item.id, 'delete-product')"
        ></v-btn>
      </v-sheet>
    </template>
  </v-data-table-server>
</template>
