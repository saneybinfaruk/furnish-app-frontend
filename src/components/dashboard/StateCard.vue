<script setup>
import TeenyiconsTrendUpSolid from "~icons/teenyicons/trend-up-solid";
import F7MoneyDollar from "~icons/f7/money-dollar";
import SolarCourseDownLinear from "~icons/solar/course-down-linear";
import SolarCourseUpLinear from "~icons/solar/course-up-linear";
const props = defineProps({
  label: String,
  icon: Object,
  amount: Number,
  color: String,
});
</script>
<template>
  <v-sheet class="mx-auto p-5 drop-shadow-sm" width="100%" rounded>
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div>
          <p>{{ props.label }}</p>
          <p class="text-xs text-gray-400">Last 30 days</p>
        </div>
        <v-icon
          :icon="props.icon"
          :color="props.color"
          :class="`bg-${props.color}-100 rounded-full p-1.5`"
          :size="37"
        ></v-icon>
      </div>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">
          <span v-show="props.label === 'Total Revenue'">$</span
          >{{ props.amount }}
        </h3>

        <div
          v-if="props.label === 'Total Revenue'"
          class="flex items-center gap-1 text-green"
        >
          <v-icon :icon="SolarCourseUpLinear" size="x-small"></v-icon>
          <p class="text-sm">10%</p>
        </div>

        <div v-else class="flex items-center gap-1 text-red">
          <v-icon :icon="SolarCourseDownLinear" size="x-small"></v-icon>
          <p class="text-sm">5%</p>
        </div>
      </div>
    </div>
  </v-sheet>
</template>
