<script setup>
import fattySufa from "../../assets/fatty_sofa.png";
import greenSufa from "../../assets/green_sofa.png";
import luxurySufa from "../../assets/luxury_sofa.png";
import orangeSufa from "../../assets/orange_sofa.png";
import RadixIconsStarFilled from "~icons/radix-icons/star-filled";
import RadixIconsStar from "~icons/radix-icons/star";
import RadixIconsArrowTopRight from "~icons/radix-icons/arrow-top-right";
import { RouterLink } from "vue-router";
</script>
<template>
  <div class="text-center max-w-xl mx-auto space-y-4">
    <h3 class="font-semibold text-2xl">Best Selling Items</h3>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, nam
      recusandae laboriosam quaerat eligendi culpa?
    </p>
  </div>

  <v-container fluid max-width="1120" class="mt-6">
    <v-row justify="center">
      <v-col class="!min-w-[230px] ma-0" v-for="i in 8">
        <RouterLink to="/products/2">
          <v-img
            height="360"
            :src="orangeSufa"
            color="grey-lighten-3"
            class="relative"
          >
            <p class="bg-red w-fit px-3 absolute right-0 text-sm py-1">33%</p>
          </v-img>

          <div class="space-y-2 py-4">
            <div class="flex items-center gap-2">
              <v-rating
                :empty-icon="RadixIconsStar"
                :full-icon="RadixIconsStarFilled"
                readonly
                :length="5"
                color="orange"
                :model-value="3"
                density="0"
                half-increament
                size="small"
              ></v-rating>
              <p class="text-xs text-gray-400">(2 reviews)</p>
            </div>
            <h5 class="text-sm font-semibold">Large Suga Ofice</h5>
            <div class="flex gap-3 items-center">
              <p class="text-gray-400 line-through">$20.00</p>
              <p class="text-red">$20.00</p>
            </div>
          </div>
        </RouterLink>
      </v-col>
    </v-row>

    <v-row class="my-10">
      <v-col class="d-flex justify-center">
        <v-btn
          :append-icon="RadixIconsArrowTopRight"
          class="text-none"
          color="teal-darken-3"
          variant="flat"
          tile
          >View All Products</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
