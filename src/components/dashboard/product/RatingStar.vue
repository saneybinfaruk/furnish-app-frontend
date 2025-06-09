<script setup>
import RadixIconsStarFilled from "~icons/radix-icons/star-filled";
import RadixIconsStar from "~icons/radix-icons/star";
import {ref, watch} from "vue";

const props = defineProps({
  productRating: Number
})

const productRating = ref(props.productRating);
const emit = defineEmits(['update:productRating']);

watch(productRating, (newValue) => {
  emit('update:productRating', newValue); // Emit updated product name
});
</script>

<template>

    <div class="flex items-center gap-5">
      <h3>Product Rating</h3>
      <h3 class="text-h6 font-weight-bold">{{ productRating }}</h3>
    </div>
    <v-rating
        half-increments
        v-model="productRating"
        hover
        :length="5"
        size="x-large"
        active-color="primary"
        density="compact"
        :empty-icon="RadixIconsStar"
        :full-icon="RadixIconsStarFilled"
    />

</template>

<style scoped>

</style>