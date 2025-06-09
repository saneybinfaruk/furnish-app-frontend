<script setup>
import { onMounted, ref, watch } from "vue";
import greenSofa from "../../../assets/green_sofa.png";
import Product from "../../Product.vue";
import { useFetchStore } from "../../../composables/useFetchStore";
import { useRoute } from "vue-router";
import axios from "axios";
import { apiBaseUrl } from "../../../utils/utils";
import { useAuthStore } from "../../../store/store";

const selectedStatus = ref();

const status = [
  { title: "Approved", value: "approved" },
  { title: "Pending", value: "pending" },
  { title: "Rejected", value: "rejected" },
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

const route = useRoute();
const authStore = useAuthStore();

const { fetchedStore, isLoading } = useFetchStore(route.params.slug);

watch(isLoading, () => {
  selectedStatus.value = fetchedStore.value.status;
});

onMounted(() => {
  window.scrollTo(0, 0);
});

const snackbar = ref(false);
const snackbarText = ref("");
const updateStatus = ref(true);
const updateStore = async () => {
  try {
    const response = await axios.patch(
      apiBaseUrl + `api/stores/${route.params.slug}`,
      {
        storeStatus: selectedStatus.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.user.token}`,
        },
      }
    );
    updateStatus.value = response.data.success;
    snackbar.value = true;
    snackbarText.value = "Store status updated!";
  } catch (error) {
    snackbarText.value = "Failed to update store status!";
    snackbar.value = true;
  } finally {
  }
};
</script>
<template>
  <v-progress-linear
    v-if="isLoading"
    indeterminate
    color="primary"
    height="4"
    class="my-4"
  />
  <v-col v-else>
    <v-row>
      <v-col cols="1" class="pa-0">
        <v-img :src="greenSofa" class="bg-red-200"></v-img>
      </v-col>
      <v-col class="pt-0">
        <p class="text-lg font-weight-bold">{{ fetchedStore.store_name }}</p>
        <p class="my-1 text-sm">{{ fetchedStore.store_description }}</p>
        <p class="font-weight-bold text-sm my-6">
          {{ fetchedStore.store_address }}
        </p>
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedStatus"
          :items="status"
          item-title="title"
          item-value="value"
          label="Status"
          variant="outlined"
          :color="getStatusColor(selectedStatus)"
          :class="`text-${getStatusColor(selectedStatus)}`"
          @update:model-value="updateStore"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="gap-5">
      <v-col
        v-for="product in fetchedStore.product"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        class="d-flex justify-center pa-0"
      >
        <v-sheet class="rounded-lg overflow-hidden drop-shadow-sm" width="100%">
          <v-img :src="greenSofa" height="300" class="bg-blue-100"></v-img>

          <div class="flex flex-col gap-1 p-3">
            <p class="font-semibold text-truncate">{{ product.name }}</p>
            <p class="text-sm text-gray-600">${{ product.price }}</p>
          </div>
        </v-sheet>
      </v-col>
    </v-row>
  </v-col>

  <v-snackbar
    v-model="snackbar"
    timeout="2000"
    :color="updateStatus ? 'green' : 'red'"
  >
    <p class="text-center">{{ snackbarText }}</p>
  </v-snackbar>
</template>
