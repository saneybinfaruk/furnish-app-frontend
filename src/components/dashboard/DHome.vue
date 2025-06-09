<script setup>
import SalesChart from "./SalesChart.vue";
import OrderChart from "./OrderChart.vue";
import TopSellingChart from "./TopSellingChart.vue";
import TopVendorsChart from "./TopVendorsChart.vue";
import RecentOrdersChart from "./RecentOrdersChart.vue";
import SmallStatesCards from "./SmallStatesCards.vue";
</script>

<template>
  <v-row>
    <SmallStatesCards />
  </v-row>
  <v-row>
    <v-col>
      <SalesChart />
    </v-col>
    <v-col cols="4">
      <OrderChart />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <TopVendorsChart />
    </v-col>
    <v-col cols="8">
      <TopSellingChart />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <RecentOrdersChart />
    </v-col>
  </v-row>
</template>
