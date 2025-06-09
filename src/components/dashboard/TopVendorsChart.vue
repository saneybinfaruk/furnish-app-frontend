<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import redSofa from "../../assets/red_sofa.png";
import axios from "axios";
import { apiBaseUrl } from "../../utils/utils";
import { useAuthStore } from "../../store/store";

const isLoading = ref(false);
const selectedPeriod = ref({
  label: "Monthly",
  value: "30 days",
});

const timeOptions = [
  {
    label: "Daily",
    value: "24 hours",
  },
  {
    label: "Weekly",
    value: "7 days",
  },
  {
    label: "Monthly",
    value: "30 days",
  },
  {
    label: "Yearly",
    value: "12 months",
  },
];

const authStore = useAuthStore();
const topVendors = ref([]);
 

const vendorsByTime = reactive({
  daily: [],
  weekly: [],
  monthly: [],
  yearly: [],
});

const fetchedData = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(apiBaseUrl + "api/top-vendor-chart", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    vendorsByTime.daily = response.data.daily;
    vendorsByTime.weekly = response.data.weekly;
    vendorsByTime.monthly = response.data.monthly;
    vendorsByTime.yearly = response.data.yearly;

    topVendors.value = vendorsByTime.monthly;
    
  } catch (error) {
    console.error("Failed to fetch top vendors:", error);
  } finally {
    isLoading.value = false;
  }
};

const getVendorsByPeriod = (period) => {
  switch (period) {
    case "Daily":
      return vendorsByTime.daily;
    case "Weekly":
      return vendorsByTime.weekly;
    case "Yearly":
      return vendorsByTime.yearly;
    default:
      return vendorsByTime.monthly;
  }
};
watch(selectedPeriod, (newValue) => {
  topVendors.value = getVendorsByPeriod(newValue.label);
});

onMounted(() => {
  fetchedData();
});
</script>
<template>
  <v-sheet class="p-5 drop-shadow-sm" rounded>
    <div class="flex justify-between mb-8">
      <div>
        <p>Top Vendors</p>
        <p class="text-xs text-gray-400">Last {{ selectedPeriod.value }}</p>
      </div>

      <div>
        <v-select
          v-model="selectedPeriod"
          :items="timeOptions"
          variant="outlined"
          density="compact"
          item-title="label"
          item-value="value"
          append-inner-icon="mdi-menu-down"
          return-object
        >
        </v-select>
      </div>
    </div>

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      height="4"
      class="my-4"
    />

    <div v-if="topVendors.length === 0">
      <p class="text-center">
        No vendor data available for the selected period.
      </p>
    </div>

    <div v-else v-for="(vendor, index) in topVendors">
      <div class="flex gap-3">
        <v-img
          :src="redSofa"
          class="bg-red-200"
          width="65"
          max-width="65"
          min-width="65"
          height="50"
          max-height="50"
          min-height="50"
          rounded
        ></v-img>
        <div class="flex justify-between w-full">
          <div>
            <p class="text-xs text-slate-400">Vendor</p>
            <p class="text-sm">{{ vendor.vendor_name }}</p>
          </div>

          <div>
            <p class="text-xs text-slate-400">Orders</p>
            <p class="text-center">{{ vendor.total_orders }}</p>
          </div>
        </div>
      </div>
      <v-divider
        v-show="index != topVendors.length - 1"
        opacity="0.5"
        class="my-5"
      ></v-divider>
    </div>
  </v-sheet>
</template>
