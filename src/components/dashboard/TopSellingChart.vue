<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import greenSofa from "../../assets/green_sofa.png";
import IwwaArrowDown from "~icons/iwwa/arrow-down";
import axios from "axios";
import { apiBaseUrl } from "../../utils/utils";
import { useAuthStore } from "../../store/store";

const authStore = useAuthStore();
const products = [
  {
    name: "A",
    vendor: "AA",
    unitSold: 320,
    revenue: 12001,
    stock: 12,
    status: "In Stock",
  },
  {
    name: "B",
    vendor: "BB",
    unitSold: 150,
    revenue: 4500,
    stock: 0,
    status: "Out of Stock",
  },
  {
    name: "C",
    vendor: "CC",
    unitSold: 78,
    revenue: 2300,
    stock: 5,
    status: "Low Stock",
  },
  {
    name: "D",
    vendor: "DD",
    unitSold: 500,
    revenue: 22000,
    stock: 23,
    status: "In Stock",
  },
  {
    name: "E",
    vendor: "AA",
    unitSold: 95,
    revenue: 3100,
    stock: 0,
    status: "Out of Stock",
  },
  {
    name: "F",
    vendor: "EE",
    unitSold: 102,
    revenue: 7100,
    stock: 9,
    status: "Low Stock",
  },
  {
    name: "G",
    vendor: "BB",
    unitSold: 215,
    revenue: 9700,
    stock: 14,
    status: "In Stock",
  },
  {
    name: "H",
    vendor: "FF",
    unitSold: 12,
    revenue: 400,
    stock: 2,
    status: "Low Stock",
  },
  {
    name: "I",
    vendor: "GG",
    unitSold: 640,
    revenue: 38000,
    stock: 50,
    status: "In Stock",
  },
  {
    name: "J",
    vendor: "HH",
    unitSold: 0,
    revenue: 0,
    stock: 20,
    status: "In Stock",
  },
];

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

const topProducts = ref([]);
const productByTime = reactive({
  daily: [],
  weekly: [],
  monthly: [],
  yearly: [],
});

const fetchedData = async () => {
  const response = await axios.get(apiBaseUrl + "api/top-product-chart", {
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  });

  productByTime.daily = response.data.daily;
  productByTime.weekly = response.data.weekly;
  productByTime.monthly = response.data.monthly;
  productByTime.yearly = response.data.yearly;

  topProducts.value = productByTime.monthly;
};

const getProductsByPeriod = (period) => {
  switch (period) {
    case "Daily":
      return productByTime.daily;
    case "Weekly":
      return productByTime.weekly;
    case "Yearly":
      return productByTime.yearly;
    default:
      return productByTime.monthly;
  }
};

watch(selectedPeriod, (newValue) => {
  topProducts.value = getProductsByPeriod(newValue.label);
});

onMounted(() => {
  fetchedData();
});
</script>
<template>
  <v-sheet class="p-5 drop-shadow-sm" rounded>
    <div class="flex justify-between mb-8">
      <div>
        <p>Top Selling Products</p>
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

    <div v-if="topProducts.length === 0">
      <p class="text-center">
        No product data available for the selected period.
      </p>
    </div>

    <div v-for="(topProduct, index) in topProducts" :key="index">
      <v-row>
        <!-- Product Info (Image + Name + Subheading) -->
        <v-col class="d-flex gap-4">
          <v-img
            :src="greenSofa"
            width="100"
            min-width="100"
            max-width="100"
            height="80"
            min-height="80"
            max-height="80"
            cover
            class="bg-green-200"
            rounded
          />
          <div>
            <p class="text-body-1">{{ topProduct.product.name }}</p>
            <p class="text-caption text-grey">
              {{ topProduct.product.subcategory.name }} -
              {{ topProduct.product.category.name }}
            </p>
          </div>
        </v-col>

        <!-- Vendor -->
        <v-col cols="3">
          <p class="text-caption text-grey">Vendor</p>
          <p>{{ topProduct.product.vendor.store_name }}</p>
        </v-col>

        <!-- Units Sold -->
        <v-col cols="2" class="text-center">
          <p class="text-caption text-grey">Units Sold</p>
          <p>{{ topProduct.total_qunatity }}</p>
        </v-col>

        <!-- Revenue -->
        <v-col cols="2" class="text-center">
          <p class="text-caption text-grey">Revenue</p>
          <p>
            ${{
              (topProduct.product.price * topProduct.total_qunatity).toFixed(2)
            }}
          </p>
        </v-col>
      </v-row>

      <v-divider
        v-show="index !== topProducts.length - 1"
        class="my-4"
        opacity="1"
      />
    </div>
  </v-sheet>
</template>
