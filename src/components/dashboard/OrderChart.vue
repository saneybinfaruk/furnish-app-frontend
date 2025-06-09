<script setup>
import { Doughnut } from "vue-chartjs";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import * as salesChartConfig from "./chart-config/salesChartConfig";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../../store/store";
import { apiBaseUrl } from "../../utils/utils";
ChartJS.register(ArcElement, Tooltip, Legend);
const options = salesChartConfig.option;
const data = ref({ datasets: [] });

const authStore = useAuthStore();
const isLoading = ref(false);

const orderStatusLabels = ref([]);
const orderStatusValues = ref([0, 0, 0, 0]);

const orderStatus = () => ({
  labels: orderStatusLabels.value,
  datasets: [
    {
      backgroundColor: ["gray", "orange", "green", "red"],
      data: orderStatusValues.value,
    },
  ],
});

const fetchedData = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(apiBaseUrl + "api/order-status-chart", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    orderStatusLabels.value = Object.keys(response.data);
    orderStatusValues.value = Object.values(response.data);

    data.value = orderStatus();

    console.log("orderStatus ", Object.keys(response.data));
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchedData();
});
</script>
<template>
  <v-sheet class="p-5 drop-shadow-sm">
    <div class="mb-8">
      <p>Delivery Status</p>
      <p class="text-xs text-gray-400">Last 30 days</p>
    </div>

    <div>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="primary"
        height="4"
        class="mb-4"
      />
      <div v-else>
        <Doughnut :data="data" :options="options" />
      </div>
    </div>
  </v-sheet>
</template>
