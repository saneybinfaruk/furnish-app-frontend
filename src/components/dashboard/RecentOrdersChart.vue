<script setup>
import axios from "axios";
import { onMounted, ref, watchEffect } from "vue";
import { apiBaseUrl } from "../../utils/utils";
import { useAuthStore } from "../../store/store";

const isLoading = ref(false);
const recentOrders = ref([]);
const authStore = useAuthStore();

// Table headers
const headers = [
  { title: "Order ID", value: "id" },
  { title: "Customer", value: "customer_name" },
  { title: "Item", value: "order_items_count" },
  { title: "Amount", value: "total_amount" },
  { title: "Date", value: "paid_at" },
  { title: "Status", value: "delivery_status" },
];

const fetchedData = async () => {
  try {
    isLoading.value = true;

    const response = await axios.get(apiBaseUrl + "api/recent-order-chart", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    console.log("response ", response.data);

    recentOrders.value = response.data.recent_orders;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchedData();
});

// Status color logic
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
  <v-sheet class="p-5 drop-shadow-sm">
    <p class="text-h6 mb-4">Recent Orders</p>

    <v-data-table-server
      :headers="headers"
      :items="recentOrders"
      :loading="isLoading"
      hide-default-footer
    >
      <template #item.id="{ item }">
        <p>#{{ item.id }}</p>
      </template>

      <template #item.customer_name="{ item }">
        <p>{{ item.user.first_name }} {{ item.user.last_name }}</p>
      </template>

      <template #headers="{ columns }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="text-left font-weight-bold"
          >
            {{ column.title }}
          </th>
        </tr>
      </template>
      <template #item.delivery_status="{ item }">
        <v-chip
          :color="getStatusColor(item.delivery_status)"
          variant="flat"
          size="small"
        >
          <p class="font-semibold">
            {{
              item.delivery_status.charAt(0).toUpperCase() +
              item.delivery_status.slice(1)
            }}
          </p>
        </v-chip>
      </template>
    </v-data-table-server>
  </v-sheet>
</template>
