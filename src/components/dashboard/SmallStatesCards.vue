<script setup>
import SolarMoneyBagOutline from "~icons/solar/money-bag-outline";
import SolarCartCheckLinear from "~icons/solar/cart-check-linear";
import SolarUserLinear from "~icons/solar/user-linear";
import SolarAddFolderOutline from "~icons/solar/add-folder-outline";
import SolarDollarMinimalisticLinear from "~icons/solar/dollar-minimalistic-linear";
import SolarSofaLinear from "~icons/solar/sofa-linear";
import StateCard from "./StateCard.vue";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "../../store/store";
import { apiBaseUrl } from "../../utils/utils";

const authStore = useAuthStore();

const total = reactive({
  money: 0,
  orders: 0,
  customers: 0,
  products: 0,
});

const isLoading = ref(false);

const fetchSmallCards = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get(apiBaseUrl + "api/dashboard", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    const result = await response.data;

    total.money = result.total_money;
    total.orders = result.total_orders;
    total.customers = result.total_customers;
    total.products = result.total_products;

    console.log(result);
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchSmallCards();
});
</script>
<template>
  <v-progress-linear
    v-if="isLoading"
    indeterminate
    color="primary"
    height="4"
    class="mb-4"
  />
  <template v-else>
    <v-col>
      <StateCard
        label="Total Revenue"
        :amount="total.money"
        :icon="SolarDollarMinimalisticLinear"
        color="green"
      />
    </v-col>

    <v-col>
      <StateCard
        label="Total Order"
        :amount="total.orders"
        :icon="SolarCartCheckLinear"
        color="gray"
      />
    </v-col>

    <v-col>
      <StateCard
        label="Total Customer"
        :amount="total.customers"
        :icon="SolarUserLinear"
        color="green"
      />
    </v-col>

    <v-col>
      <StateCard
        label="Total Product"
        :amount="total.products"
        :icon="SolarSofaLinear"
        color="gray"
      />
    </v-col>
  </template>
</template>
