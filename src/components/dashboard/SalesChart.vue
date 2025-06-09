<script setup>
import { Bar, Line } from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { computed, onMounted, ref } from "vue";
import * as salesChartConfig from "./chart-config/salesChartConfig";
import axios from "axios";
import { useAuthStore } from "../../store/store";
import { apiBaseUrl } from "../../utils/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = salesChartConfig.option;
const data = ref({ datasets: [] });
const selected = ref("weekly");
const authStore = useAuthStore();

const weekLabels = ref(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const weekValues = ref([0, 0, 0, 0, 0, 0, 0]);

const monthLabels = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);
const monthValues = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

const isLoading = ref(false);

const weeklyData = () => ({
  labels: weekLabels.value,

  datasets: [
    {
      label: "Weekly Sales",
      backgroundColor: "#42A5F5",
      data: weekValues.value,
      fill: true,
      tension: 0.4,
    },
  ],
});

const monthlyData = () => ({
  labels: monthLabels.value,
  datasets: [
    {
      label: "Monthly Sales",
      backgroundColor: "green",
      fill: true,
      tension: 0.4,
      data: monthValues.value,
    },
  ],
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(apiBaseUrl + "api/sales-chart", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    weekLabels.value = Object.keys(response.data.weekly);
    weekValues.value = Object.values(response.data.weekly);

    monthLabels.value = Object.keys(response.data.monthly);
    monthValues.value = Object.values(response.data.monthly);
    console.log("Data ", response.data);
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const chartData = computed(() =>
  selected.value === "weekly" ? weeklyData() : monthlyData()
);
onMounted(() => {
  data.value = monthlyData();

  fetchData();
});
</script>
<template>
  <v-sheet class="p-5 drop-shadow-sm">
    <div class="flex items-center justify-between mb-2">
      <p>Sales Chart</p>
      <v-btn-toggle
        v-model="selected"
        rounded="small"
        variant="outlined"
        density="compact"
      >
        <v-btn value="weekly">Weekly</v-btn>
        <v-btn value="monthly">Monthly</v-btn>
      </v-btn-toggle>
    </div>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      height="4"
      class="my-4"
    />

    <div v-else>
      <Line :data="chartData" :options="options" :height="300" />
    </div>
  </v-sheet>
</template>
