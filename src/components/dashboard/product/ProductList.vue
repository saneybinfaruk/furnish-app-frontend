<script setup>
import { reactive, ref, watch } from "vue";

import AddProduct from "./AddProduct.vue";
import ProductTable from "./ProductTable.vue";
import ProductDialog from "./ProductDialog.vue";
import { useFetchProducts } from "@/composables/useFetchProducts.js";
import EditProduct from "@/components/dashboard/product/EditProduct.vue";
import { usePiniaStore } from "@/store/store";
import DeleteProduct from "./DeleteProduct.vue";
const { allProducts, fetchProducts } = useFetchProducts();

const store = usePiniaStore();

const handleClick = () => {
  store.dialog.isVisible = true;
  store.dialog.selectedProductId = null;
  store.dialog.componentName = "add-product";
};

watch(
  () => store.dialog.isVisible, // Reactive property to watch
  (isVisible) => {
    if (!isVisible) {
      fetchProducts(); // Fetch products again when dialog is closed
    }
  }
);
</script>

<template>
  <v-sheet class="d-flex align-center justify-space-between py-2 px-2">
    <h1 class="font-weight-bold">Product List</h1>
    <v-btn text="Add Product" variant="tonal" @click="handleClick"></v-btn>

    <ProductDialog>
      <EditProduct v-if="store.dialog.componentName === 'edit-product'" />
      <AddProduct v-if="store.dialog.componentName === 'add-product'" />
      <DeleteProduct v-if="store.dialog.componentName === 'delete-product'" />
    </ProductDialog>
  </v-sheet>

  <ProductTable :all-products="allProducts" />
</template>
