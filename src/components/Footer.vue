<script setup>
import logo from "../assets/furn_logo.png";
import IcBaselineFacebook from "~icons/ic/baseline-facebook";
import HugeiconsNewTwitter from "~icons/hugeicons/new-twitter";
import SolarArrowRightOutline from "~icons/solar/arrow-right-outline";
import { RouterLink } from "vue-router";

const links = ["Home", "About Us", "Team", "Services", "Blog", "Contact Us"];
</script>
<template>
  <v-container fluid max-width="1120" class="px-0">
    <v-row no-gutters>
      <v-col cols="5">
        <v-img :src="logo" width="60"></v-img>
        <p class="py-5">
          <strong>Hotline:</strong>
          <span class="text-gray-500"> +1 999 000 4547</span>
        </p>
        <h5 class="uppercase font-bold py-2">sofana shop</h5>
        <div class="text-gray-500">
          <p>demo@demo.com</p>
          <p>Germany - 785 15h Street, Office 478</p>
          <p>Berlin, De 81566</p>
        </div>

        <v-btn
          :append-icon="SolarArrowRightOutline"
          width="120"
          class="d-flex justify-space-between mt-6"
          tile
          variant="flat"
          color="black"
          >MAP</v-btn
        >
      </v-col>
      <v-col class="d-flex gap-20 mt-5">
        <div>
          <RouterLink
            v-for="(label, index) in [
              'Showroom & Store',
              'Gift Cards',
              'Return Policy',
              'Furniture Assembling',
              'Shipping Methods',
            ]"
            ><p
              :class="[
                `${index === 0 ? 'font-semibold mb-7' : 'my-2 text-gray-500'}`,
              ]"
            >
              {{ label }}
            </p></RouterLink
          >
        </div>

        <div>
          <RouterLink
            v-for="(label, index) in [
              'Useful Links',
              'Studio',
              'Visit our Store',
              'About Us',
              'Our Blog',
              'Craftmanship',
              'Apply For a Job',
            ]"
            ><p
              :class="[
                `${index === 0 ? 'font-semibold mb-7' : 'my-2 text-gray-500'}`,
              ]"
            >
              {{ label }}
            </p></RouterLink
          >
        </div>
      </v-col>
    </v-row>
    <v-row justify="space-between" align="center" class="my-10">
      <v-col><p>Copyright@2025Saney. All right reserved.</p></v-col>
      <v-col cols="2" class="space-x-3">
        <v-btn
          :icon="IcBaselineFacebook"
          variant="outlined"
          size="small"
        ></v-btn>
        <v-btn
          :icon="HugeiconsNewTwitter"
          variant="outlined"
          size="small"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
