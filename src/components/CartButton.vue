<script setup lang="ts">


import {PropType, ref} from "vue";
import LineMdPlus from "~icons/line-md/plus";
import LineMdMinus from "~icons/line-md/minus";

let props = defineProps({

  quantity: {
    type: Number,
    default: 0,
    required: false,
  },

  onQuantityChange: {
    type: Function as PropType<(value:number) => void>,
    required: true,
  }


})


</script>


<template>
  <div class="inline-flex self-center items-center  elevation-1 gap-4 bg-yellow-100 p-1 rounded-full">
    <v-btn variant="outlined" :icon="LineMdMinus" size="x-small" :disabled=" quantity === 0"
           @click="onQuantityChange(-1)"/>

    <p>{{ quantity }}</p>

    <v-btn variant="outlined" :icon="LineMdPlus" size="x-small" @click="onQuantityChange(1)"/>
  </div>

</template>

<style scoped>

</style>