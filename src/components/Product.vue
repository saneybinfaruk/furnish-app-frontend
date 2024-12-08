<script setup lang="ts">

import {RouterLink} from "vue-router";


let props = defineProps({
  product: Object,

  quantity: {
    type: Number,
    default: 0,
    required: false,
  },
  color: {
    type: String,
    default: '',
    required: false
  },
  size: {
    type: String,
    default: '',
    required: false
  }

})

const onUpdatedQuantity = (updatedValue: number) => {
  console.log('updated quantity ' , updatedValue)
}

</script>

<template>

  <div class="w-[180px] max-w-[210px] flex flex-col">
    <RouterLink :to="`/products/${product.id}`">
      <p>{{ product.id }}</p>
      <img :src="`https://via.assets.so/furniture.png?id=${product.id}&q=50&w=360&h=360&fit=fill`" alt="product image"
           class="rounded h-[250px] object-scale-down bg-black/5 px-5">

      <p>{{ product.name }}</p>
      <p v-show="color">{{ product.color }}</p>
      <p v-show="size">{{ product.size }}</p>

    </RouterLink>


  </div>
</template>

<style scoped>

</style>