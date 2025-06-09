<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import IcBaselineFavoriteBorder from "~icons/ic/baseline-favorite-border";
import MaterialSymbolsArrowOutwardRounded from "~icons/material-symbols/arrow-outward-rounded";
import BrownSofa from "../../assets/brown_sofa.png";
import ChairSofa from "../../assets/chair_sofa.png";
import FattySofa from "../../assets/fatty_sofa.png";
import GreenSofa from "../../assets/green_sofa.png";
import LuxurySofa from "../../assets/luxury_sofa.png";
import OrangeSofa from "../../assets/orange_sofa.png";
import RedSofa from "../../assets/red_sofa.png";
import YellowSofa from "../../assets/y_sofa.png";
import YellowSofa2 from "../../assets/yellow_sofa.png";

// Define Swiper modules
const modules = [Navigation];

// State for active slide
const activeIndex = ref(0);

// List of slides
const slides = ref([
  "Slide 1",
  "Slide 2",
  "Slide 3",
  "Slide 4",
  "Slide 5",
  "Slide 6",
  "Slide 7",
  "Slide 8",
  "Slide 9",
]);

const images = [
  BrownSofa,
  ChairSofa,
  FattySofa,
  GreenSofa,
  LuxurySofa,
  OrangeSofa,
  RedSofa,
  YellowSofa,
  YellowSofa2,
];

// Track the currently centered slide
const onSwiper = (swiper) => {
  activeIndex.value = swiper.realIndex;
};

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.realIndex;
};
</script>

<template>
  <div class="w-full">
    <swiper
      :slidesPerView="5"
      :spaceBetween="20"
      :centeredSlides="true"
      :pagination="{ clickable: true }"
      :modules="modules"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :navigation="true"
      class="bg-white h-[560px] relative flex flex-col justify-end py-8"
    >
      <swiper-slide
        v-for="(slide, index) in images"
        :key="index"
        class="transition-all duration-300 !h-[80%] flex self-end position-relative relative"
        :class="activeIndex === index ? '!-translate-y-32 bg-[#6D9082]' : 'bg-[#F4EDE5]'"
      >
        <v-img
          class="w-full h-full object-cover position-relative relative"
          :src="slide"
        ></v-img>

        <div
          v-if="activeIndex === index"
          class="bg-white absolute left-0 right-[20%] -bottom-24 p-3 space-y-6"
        >
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-sm">Heavy office chair</p>
              <p class="text-xs">Office Chair</p>
            </div>
            <p class="font-semibold text-sm">$98</p>
          </div>
          <p class="text-sm">Lorem ipsum dolor sit amet,dolor sit amet.</p>

          <v-btn
            variant="outlined"
            :icon="IcBaselineFavoriteBorder"
            size="x-small"
          ></v-btn>
        </div>

        <div
          v-if="activeIndex === index"
          class="absolute top-[10%] -left-[110%] w-full text-right"
        >
          <h3 class="text-2xl">Just Arrived</h3>
        </div>

        <div
          v-if="activeIndex === index"
          class="absolute top-[3%] -right-[110%] space-y-4 w-full"
        >
          <p class="text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <v-btn
            variant="flat"
            :append-icon="MaterialSymbolsArrowOutwardRounded"
            tile
            class="text-none"
            color="#6D9082"
            >View More</v-btn
          >
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped></style>
