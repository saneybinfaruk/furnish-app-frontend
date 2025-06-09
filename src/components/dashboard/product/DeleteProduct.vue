<script setup>
import axios from "axios";
import { usePiniaStore } from "../../../store/store";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const store = usePiniaStore();

const handleDelete = async () => {
  try {
    const response = await axios.delete(
      `${apiBaseUrl}api/products/${store.dialog.selectedProductId}`
    );

    if (response.data.success) {
      store.dialog.isVisible = false;
    }
  } catch (error) {
    console.log("Error deleting product:", error);
  }
};
</script>

<template>
  <v-card-text>
    Are you sure you want to delete the product?
    <v-spacer></v-spacer>

    <strong>This action cannot be undone.</strong>
  </v-card-text>
  <v-card-actions>
    <v-spacer></v-spacer>

    <v-btn text="Cancel" @click="store.dialog.isVisible = false"></v-btn>
    <v-btn color="error" text="Delete" @click="handleDelete"></v-btn>
  </v-card-actions>
</template>
