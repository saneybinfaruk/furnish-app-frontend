<script setup>
import LineMdPlus from "~icons/line-md/plus";
import LineMdMinus from "~icons/line-md/minus";
import RadixIconsPlus from "~icons/radix-icons/plus";
import RadixIconsMinus from "~icons/radix-icons/minus";

let props = defineProps({
  quantity: {
    type: Number,
    default: 0,
    required: false,
  },

  onQuantityChange: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <v-sheet
    class="d-inline-flex align-center gap-4 bg-white p-1 rounded-sm"
    border
    rounded="md"
  >
    <v-btn
      variant="flat"
      :icon="RadixIconsMinus"
      size="x-small"
      :disabled="quantity === 0"
      @click="onQuantityChange(-1)"
      tile
    />

    <p>{{ quantity }}</p>

    <v-btn
      variant="flat"
      :icon="RadixIconsPlus"
      size="x-small"
      @click="onQuantityChange(1)"
      tile
    />
  </v-sheet>
</template>

<style scoped></style>
