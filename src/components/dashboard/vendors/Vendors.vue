<script setup>
import axios from "axios";
import { useAuthStore } from "@/store/store.js";
import { onMounted, ref } from "vue";
import { apiBaseUrl } from "@/utils/utils";
import cate from "@/assets/cate.jpg";

const authStore = useAuthStore();
const vendors = ref([]);
const isLoading = ref(false);

const headers = [
  {
    title: "VENDORS",
    align: "start",
    sortable: false,
    key: "store_name",
  },
  {
    title: "ADDRESS",
    align: "start",
    sortable: false,
    key: "store_address",
  },
  {
    title: "STATUS",
    align: "start",
    sortable: false,
    key: "status",
  },
  {
    title: "",
    align: "start",
    sortable: false,
    key: "action",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "green-darken-2";
    case "pending":
      return "orange";

    default:
      return "red";
  }
};

const fetchVendor = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(apiBaseUrl + "api/stores", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    vendors.value = response.data;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchVendor);
</script>

<template>
  <v-data-table-server
    :loading="isLoading"
    :items="vendors"
    :headers="headers"
    hide-default-footer
  >
    <template v-slot:item.store_name="{ item }">
      <div class="flex items-center gap-2 p-2">
        <v-img
          :src="`https://picsum.photos/id/5${item.id}/400`"
          width="50"
          height="50"
          max-width="50"
          max-height="50"
          min-width="50"
          min-height="50"
          rounded
          cover
        />
        <p class="font-semibold">
          {{ item.store_name }}
        </p>
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" class="font-weight-bold">
        {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
      </v-chip>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn
        class="text-none"
        variant="tonal"
        color="blue"
        :to="{
          name: 'vendor-details',
          params: { slug: item.store_name_slug },
        }"
        >View Details</v-btn
      >
    </template>
  </v-data-table-server>
</template>
