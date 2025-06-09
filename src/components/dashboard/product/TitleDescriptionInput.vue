<script setup>
import { ref, watch } from 'vue';

// Define props to accept data from parent
const props = defineProps({
  productName: String,
  productDescription: String,
  productNameRules: Array,
  productDescriptionRules: Array,
});

// Create refs for local binding
const productName = ref(props.productName);
const productDescription = ref(props.productDescription);

// Emit updates when values change
const emit = defineEmits(['update:productName', 'update:productDescription']);

watch(productName, (newValue) => {
  emit('update:productName', newValue); // Emit updated product name
});

watch(productDescription, (newValue) => {
  emit('update:productDescription', newValue); // Emit updated product description
});
</script>

<template>
  <h1 class="pb-2.5 font-semibold">Product Details</h1>

  <v-sheet class="pa-7 border-thin rounded-lg space-y-4">
    <v-text-field
        variant="outlined"
        placeholder="Product Name..."
        v-model="productName"
        label="Product Name"
        :rules="productNameRules"
    ></v-text-field>

    <v-textarea
        variant="outlined"
        placeholder="Product Description..."
        v-model="productDescription"
        label="Product Description"
        :rules="productDescriptionRules"
    ></v-textarea>
  </v-sheet>
</template>

<style scoped>
/* Scoped styles for your dialog */
</style>
