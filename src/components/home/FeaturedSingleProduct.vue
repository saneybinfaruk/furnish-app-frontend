<script setup>
import pattern from "@/assets/pattern.png";
import sofa from "@/assets/luxury_sofa.png";
import yellowSofa from "@/assets/yellow_sofa.png";
import RadixIconsArrowTopRight from "~icons/radix-icons/arrow-top-right";
</script>
<template>
  <v-container fluid class="pa-0 position-relative">
    <v-row class="h-[400px] bg-[#6D9082]">
      <v-col class="h-100 position-relative">
        <v-img cover :src="yellowSofa"></v-img>

        <v-sheet
          class="d-flex flex-column align-center justify-center position-absolute top-5 right-0"
          width="100"
          height="100"
          border="opacity-50 error lg"
          rounded="circle"
        >
          <p class="text-[9px] text-[#409573]">UPTO</p>
          <h5 class="text-2xl mt-1 font-bold text-[#409573]">50%</h5>
          <p class="text-sm text-[#409573]">OFF</p>
        </v-sheet>
      </v-col>
      <v-col class="align-self-center text-white">
        <div class="space-y-8">
          <h4 class="text-2xl">Axton Dou Leather Sofa</h4>
          <div class="flex items-center gap-4">
            <p class="text-md">$28.00</p>
            <p class="text-decoration-line-through text-sm text-gray-300">
              $35.56
            </p>
          </div>
          <p class="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, rem?
            Quas nobis error dolore sequi, laborum quasi minus cumque numquam.
          </p>

          <v-btn
            :append-icon="RadixIconsArrowTopRight"
            class="text-none"
            variant="flat"
            color="white"
            size="large"
            tile
            >Add to cart</v-btn
          >
        </div>

        <v-img
          width="200"
          :src="pattern"
          class="position-absolute -right-20 bottom-[10%] rotate-45 opacity-10"
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
