<script setup>
import axios from "axios";
import { onMounted, ref, watch, watchEffect } from "vue";
import {
  apiBaseUrl,
  FirstLetterUppercase,
  formatDateTime,
  formatDateTime2,
} from "../../../utils/utils";
import { useAuthStore } from "../../../store/store";
import SolarAltArrowLeftLinear from "~icons/solar/alt-arrow-left-linear";
import SolarDoubleAltArrowLeftLinear from "~icons/solar/double-alt-arrow-left-linear";
import SolarAltArrowRightLinear from "~icons/solar/alt-arrow-right-linear";
import SolarDoubleAltArrowRightLinear from "~icons/solar/double-alt-arrow-right-linear";

const authStore = useAuthStore();

const isLoading = ref(false);
const orders = ref([]);
const totalItems = ref(0);
const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  sortDesc: [],
});

const fetchedData = async (options) => {
  try {
    isLoading.value = true;

    const { page, itemsPerPage: per_page } = options;
    const response = await axios.get(apiBaseUrl + "api/all-orders", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
      params: {
        page,
        per_page,
      },
    });

    orders.value = response.data.all_orders;
    totalItems.value = response.data.total_items;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const headers = [
  {
    title: "Order",
    value: "id",
  },
  {
    title: "Customer",
    value: "customer",
  },
  {
    title: "Payment",
    value: "payment_status",
  },
  {
    title: "Total",
    value: "total_amount",
  },
  {
    title: "Items",
    value: "order_items_count",
  },
  {
    title: "Ordered Date",
    value: "created_at",
  },
  {
    title: "Status",
    value: "delivery_status",
  },
  {
    title: "",
    value: "details",
  },
];

const getPaymentStatusColor = (paymentStatus) => {
  switch (paymentStatus) {
    case "unpaid":
      return "orange";
    case "refunded":
      return "red";
    case "paid":
      return "green";
    default:
      return "primary";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "shipped":
      return "blue";
    case "processing":
      return "orange";
    case "cancelled":
      return "red";
    case "completed":
      return "green";
    default:
      return "primary";
  }
};
</script>
<template>
  <v-sheet class="pa-6 drop-shadow-sm">
    <v-data-table-server
      :headers="headers"
      :items="orders"
      :loading="isLoading"
      :items-length="totalItems"
      :options="options"
      @update:options="fetchedData"
      :prev-icon="SolarAltArrowLeftLinear"
      :first-icon="SolarDoubleAltArrowLeftLinear"
      :next-icon="SolarAltArrowRightLinear"
      :last-icon="SolarDoubleAltArrowRightLinear"
    >
      <template v-slot:headers="{ columns }">
        <tr class="rounded-lg">
          <th
            v-for="column in columns"
            :key="column.key"
            class="font-weight-bold"
          >
            {{ column.title }}
          </th>
        </tr>
      </template>

      <template v-slot:item.customer="{ item }">
        <p>{{ item.user.first_name }} {{ item.user.last_name }}</p>
      </template>

      <template v-slot:item.payment_status="{ item }">
        <v-chip
          variant="outlined"
          density="compact"
          :color="getPaymentStatusColor(item.payment_status)"
          >{{ FirstLetterUppercase(item.payment_status) }}</v-chip
        >
      </template>

      <template v-slot:item.created_at="{ item }">
        <p class="whitespace-nowrap text-xs">
          {{ formatDateTime(item.created_at) }}
        </p>
      </template>

      <template v-slot:item.delivery_status="{ item }">
        <v-chip
          class="font-weight-bold"
          variant="tonal"
          density="compact"
          :color="getStatusColor(item.delivery_status)"
          >{{ FirstLetterUppercase(item.delivery_status) }}</v-chip
        >
      </template>

      <template v-slot:item.details>
        <v-btn variant="tonal" size="small" color="primary">Details</v-btn>
      </template>
    </v-data-table-server>
  </v-sheet>
</template>
