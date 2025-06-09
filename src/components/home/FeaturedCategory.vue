<script setup>
import MynauiArrowLongRight from "~icons/mynaui/arrow-long-right";
import MaterialSymbolsLightDeliveryTruckSpeed from "~icons/material-symbols-light/delivery-truck-speed";
import MaterialSymbolsPlayArrow from "~icons/material-symbols/play-arrow";
import sofaPillow from "@/assets/sofa_pillow.jpg";
import SofaCategory from "@/assets/cate.jpg";
import DoubleChairSofa from "@/assets/double_chair_sofa.jpg";
import { ref } from "vue";

const isPlaying = ref(false);
const videoRef = ref(null);

// Function to play the video
const playVideo = () => {
  isPlaying.value = true;
  if (videoRef.value) {
    videoRef.value.play();
  }
};
</script>
<template>
  <v-container max-width="1120" class="px-0 py-1">
    <v-row class="h-[350px]">
      <v-col class="pl-0 h-100">
        <v-parallax
          scale="0"
          gradient="to top right, rgba(0,0,0,.5), rgba(0,0,0,.4)"
          :src="sofaPillow"
          class="text-white"
        >
          <div class="flex flex-col justify-center h-full px-20 space-y-4">
            <h4 class="text-h4 mb-4">Chair & pillow collection</h4>
            <p>
              Lorem ipsum dolorsint sequi fugit fugiat velit doloremque
              voluptate inventore voluptas animi in adipisci?
            </p>
            <v-btn
              class="text-none align-self-start"
              tile
              variant="flat"
              color="amber-lighten-3"
              size="x-large"
            >
              <p class="text-sm">More Projects</p>
            </v-btn>
          </div></v-parallax
        >
      </v-col>
      <v-col cols="4" class="pr-0 h-100 relative">
        <v-img
          gradient="to top right, rgba(0,0,0,.0), rgba(0,0,0,.2)"
          class="relative"
          cover
          :src="SofaCategory"
        >
          <div class="flex flex-col justify-between h-full p-6 text-white">
            <h6 class="text-h5 mt-10 text-yellow-100 font-semibold">
              Fochan Sofa
            </h6>

            <div class="flex items-center gap-14">
              <p>More Products</p>
              <v-btn
                :icon="MynauiArrowLongRight"
                variant="outlined"
                color="yellow"
                tile
              ></v-btn>
            </div>
          </div>
          <p
            class="absolute top-0 right-0 px-6 py-1.5 bg-white font-semibold text-sm"
          >
            New
          </p>
        </v-img>
      </v-col>
    </v-row>
    <v-row class="h-[350px]">
      <v-col class="pl-0 h-100">
        <div class="flex flex-col justify-between h-full">
          <div class="flex ga-5">
            <div class="bg-red flex justify-center items-center w-[120px]">
              <v-icon
                size="x-large"
                :icon="MaterialSymbolsLightDeliveryTruckSpeed"
              ></v-icon>
            </div>
            <div class="flex flex-col justify-between gap-2">
              <p class="font-semibold">Fast & free shipping</p>
              <p class="text-xs">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit, sit
                amet consectetur adipisicing elitconsectetur adipisicing elit,
                consectetur!
              </p>
            </div>
          </div>

          <div class="flex ga-5">
            <div class="bg-red flex justify-center items-center w-[120px]">
              <v-icon
                size="x-large"
                :icon="MaterialSymbolsLightDeliveryTruckSpeed"
              ></v-icon>
            </div>
            <div class="flex flex-col justify-between gap-2">
              <p class="font-semibold">Modular, easy-to-move design</p>
              <p class="text-xs">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit, sit
                amet consectetur adipisicing elitconsectetur adipisicing elit,
                consectetur!
              </p>
            </div>
          </div>

          <div class="flex ga-5">
            <div class="bg-red flex justify-center items-center w-[120px]">
              <v-icon
                size="x-large"
                :icon="MaterialSymbolsLightDeliveryTruckSpeed"
              ></v-icon>
            </div>
            <div class="flex flex-col justify-between gap-2">
              <p class="font-semibold">Durable, premium materials</p>
              <p class="text-xs">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit, sit
                amet consectetur adipisicing elitconsectetur adipisicing elit,
                consectetur!
              </p>
            </div>
          </div>
        </div>
      </v-col>
      <v-col class="pr-0 h-100 relative">
        <v-img
          v-show="!isPlaying"
          gradient="to top right, rgba(0,0,0,.0), rgba(0,0,0,.2)"
          class="position-relative"
          :src="DoubleChairSofa"
          cover
        >
          <v-btn
            :icon="MaterialSymbolsPlayArrow"
            class="position-absolute top-[45%] left-[45%]"
            variant="outlined"
            color="white"
            size="x-large"
            @click="playVideo"
          ></v-btn>
        </v-img>
        <video v-show="isPlaying" ref="videoRef" controls class="w-100" cover>
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </v-col>
    </v-row>
  </v-container>
</template>
