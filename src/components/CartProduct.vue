<script setup>

import CartButton from "./CartButton.vue";
import {ref} from "vue";
import LineMdClose from '~icons/line-md/close'

const props = defineProps({
  imgUrl: String,
  name: String,
  color: String,
  size: String,
  price: Number,
  quantity: Number
})

const productQuantity = ref(props.quantity);

const onQuantityChange = (value) => {
  productQuantity.value += value;
}

</script>

<template>
  <v-row>

    <v-col class="bg-green-100" cols="6">

      <v-row class="bg-red-100">

        <v-col class="bg-yellow-300 h-[150px]">
          <v-img src="https://via.assets.so/furniture.png?id=1&q=95&w=360&h=360&fit=fill"></v-img>
        </v-col>

        <v-col cols="9">
          <div class="break-words">
            <p>{{ name }}</p>
            <div class="flex flex-row gap-2">
              <h6>Selected Color: </h6>
              <div :class="`bg-${color} w-5 h-5`"></div>
              <p>{{ color }}</p>
            </div>
            <p>{{ size }}</p>
          </div>
        </v-col>


      </v-row>

    </v-col>

    <v-col class="bg-green-300 flex align-center justify-center" cols="1">
      <p>{{ price }}</p>
    </v-col>

    <v-col class="bg-green-200 flex align-center justify-center" cols="3">
      <CartButton :on-quantity-change="onQuantityChange" :quantity="productQuantity"/>
    </v-col>

    <v-col class="bg-green-300 flex align-center justify-between" cols="2">
      <p class="w-full flex justify-center">{{ (price * productQuantity).toFixed(2) }}</p>
      <v-icon class="ring-1 rounded-full p-0.5" role="button" :icon="LineMdClose" size="x-small"
              variant="outlined"></v-icon>
    </v-col>

  </v-row>

</template>

<style scoped>

</style>