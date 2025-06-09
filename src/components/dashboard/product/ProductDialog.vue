<script setup>
import RadixIconsCross2 from "~icons/radix-icons/cross-2";
import { usePiniaStore } from "@/store/store";

const store = usePiniaStore();
</script>

<template>
  <v-dialog
    v-model="store.dialog.isVisible"
    max-width="500"
    :fullscreen="store.dialog.componentName !== 'delete-product'"
  >
    <v-card>
      <v-toolbar>
        <v-btn :icon="RadixIconsCross2" @click="store.dialog.isVisible = false">
        </v-btn>
        <v-toolbar-title>
          <slot name="title">{{
            store.dialog.componentName === "add-product"
              ? "Add Product"
              : store.dialog.componentName === "edit-product"
              ? "Edit Product"
              : "Delete Product"
          }}</slot>
        </v-toolbar-title>
      </v-toolbar>
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Scoped styles for your dialog */
</style>
