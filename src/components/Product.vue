<script setup lang="ts">
import { RouterLink } from "vue-router";
import GreenSofa from "../assets/green_sofa.png";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

let props = defineProps({
  product: Object,
});
</script>

<template>
  <div>
    <RouterLink :to="`/products/${product.id}`">
      <v-img
        height="360"
        :src="GreenSofa"
        lazy-src="https://picsum.photos/200/300"
        alt="product image"
        class="rounded h-[250px] object-scale-down bg-black/5 px-5"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular
              color="grey-lighten-4"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>

        <template v-slot:error>
          <v-img
            class="mx-auto"
            height="250"
            max-width="500"
            :src="`https://picsum.photos/id/${product.id}/500/700`"
          ></v-img>
        </template>
      </v-img>

      <p>{{ product.name }}</p>
      <p v-show="color">{{ product.color }}</p>
      <p v-show="size">{{ product.size }}</p>

      <div>
        <p>by</p>
        <a href="#">{{ product.vendor.store_name }}</a>
        <p>in</p>
        <a href="#">{{ product.sub_category.name }}</a>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped></style>
