<script setup>
import leftSideSofa from "../../assets/left_side_sofa.png";
import RadixIconsArrowTopRight from "~icons/radix-icons/arrow-top-right";
</script>
<template>
  <v-sheet height="350" class="position-relative">
    <div class="h-[75%] bg-[#EFE3D2] flex justify-center items-center">
      <div
        class="flex justify-between items-center z-10 w-[45%] h-[26%] px-8 backdrop-blur-3xl drop-shadow-sm"
      >
        <h4 class="text-xl">Get Special Prices</h4>
        <v-btn
          color="white"
          tile
          variant="flat"
          :append-icon="RadixIconsArrowTopRight"
          class="text-overline"
          >subscribe now</v-btn
        >
      </div>
    </div>
    <v-img :src="leftSideSofa" class="w-50 position-absolute bottom-0"></v-img>
  </v-sheet>
</template>
