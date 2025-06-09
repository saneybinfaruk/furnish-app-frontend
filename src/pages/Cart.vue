<script setup>
import { usePiniaStore } from "@/store/store";
import CartProduct from "../components/CartProduct.vue";
import MaterialSymbolsCheckBoxOutlineBlankSharp from "~icons/material-symbols/check-box-outline-blank-sharp";
import MaterialSymbolsCheckBoxSharp from "~icons/material-symbols/check-box-sharp";
import MaterialSymbolsStorefrontOutlineRounded from "~icons/material-symbols/storefront-outline-rounded";
import LineMdClose from "~icons/line-md/close";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const store = usePiniaStore();
const { addToSelectedCartList } = store;
const { cartList, selectedCartList } = storeToRefs(store);

// Group and sort cart items by store name
const groupedByVendor = computed(() => {
  const groups = cartList.value.reduce((acc, product) => {
    if (!acc[product.storeName]) acc[product.storeName] = [];
    acc[product.storeName].push(product);
    return acc;
  }, {});

  for (const products of Object.values(groups)) {
    products.sort((a, b) => b.timeDate - a.timeDate);
  }

  return Object.entries(groups)
    .sort(
      ([_, productsA], [__, productsB]) =>
        productsB[0].timeDate - productsA[0].timeDate
    )
    .reduce((sortedGroups, [storeName, products]) => {
      sortedGroups[storeName] = products;
      return sortedGroups;
    }, {});
});

const subTotalPrice = computed(() => {
  return selectedCartList.value
    .reduce((total, product) => total + product.quantity * product.price, 0)
    .toFixed(2);
});

// Check if all items are selected
const isAllSelected = computed(
  () => selectedCartList.value.length === cartList.value.length
);

// Toggle all items
const toggleAll = () => {
  console.log("isAllSelected ==== ", selectedCartList.value);

  if (isAllSelected.value) {
    selectedCartList.value = [];
  } else {
    selectedCartList.value = [];
    cartList.value.forEach((product) => selectedCartList.value.push(product));
  }
};

// Check if all items of a store are selected
const isStoreSelected = (storeName) => {
  const storeProducts = groupedByVendor.value[storeName] || [];
  return (
    storeProducts.length > 0 &&
    storeProducts.every((p) => selectedCartList.value.includes(p))
  );
};
// Toggle a specific store's items
const toggleStore = (storeName) => {
  let storeProducts = groupedByVendor.value[storeName] || [];

  if (isStoreSelected(storeName)) {
    console.log("isStoreSelected ==== ", storeProducts);
    selectedCartList.value = selectedCartList.value.filter(
      (fromCartProduct) =>
        !storeProducts.some(
          (product) =>
            fromCartProduct.productId === product.productId &&
            fromCartProduct.colorName === product.colorName &&
            fromCartProduct.colorValue === product.colorValue &&
            fromCartProduct.size === product.size
        )
    );
  } else {
    selectedCartList.value = [...selectedCartList.value, ...storeProducts];
  }
};

// Toggle individual product
const toggleProduct = (product) => {
  addToSelectedCartList(product);

  console.log("CartItem === ", product);
};

const checkoutItems = () => {
  console.log("checkoutItems === ", selectedCartList.value);
};

const clearSelectedCartList = () => (selectedCartList.value = []);
</script>

<template>
  <v-container max-width="1152">
    <!-- SELECT ALL -->
    <v-row align="center" class="bg-white mb-2">
      <v-col class="py-0">
        <v-checkbox
          v-model="isAllSelected"
          @click="toggleAll"
          class="my-1 d-flex"
          density="compact"
          :false-icon="MaterialSymbolsCheckBoxOutlineBlankSharp"
          :true-icon="MaterialSymbolsCheckBoxSharp"
        >
          <template v-slot:label>
            <p class="ml-4 text-sm">
              SELECT ALL <strong>({{ cartList.length }} ITEMS)</strong>
            </p>
          </template>
        </v-checkbox>
      </v-col>
      <v-col cols="auto">
        <v-btn
          :prepend-icon="LineMdClose"
          variant="plain"
          @click="clearSelectedCartList()"
          >Clear</v-btn
        >
      </v-col>
    </v-row>

    <!-- CART LIST -->
    <v-row
      class="bg-white mb-2"
      v-for="(products, storeName) in groupedByVendor"
      :key="storeName"
    >
      <!-- Store Name Header -->
      <v-col class="d-inline-flex align-center py-1 border-b" cols="12">
        <v-checkbox
          :model-value="isStoreSelected(storeName)"
          @click="toggleStore(storeName)"
          class="my-1 d-flex mr-4"
          density="compact"
          :false-icon="MaterialSymbolsCheckBoxOutlineBlankSharp"
          :true-icon="MaterialSymbolsCheckBoxSharp"
        ></v-checkbox>
        <RouterLink :to="`/stores/${products[0].storeNameSlug}`">
          <div
            class="flex items-center gap-1 hover:text-red-400 transition-colors duration-200"
          >
            <v-icon :icon="MaterialSymbolsStorefrontOutlineRounded"></v-icon>
            <p>{{ storeName }}</p>
          </div>
        </RouterLink>
      </v-col>

      <!-- Store Products -->
      <v-col
        v-for="(product, index) in products"
        :key="product.productId"
        cols="12"
        class="d-flex my-1"
      >
        <v-checkbox
          :model-value="
            selectedCartList.some(
              (p) =>
                p.productId === product.productId &&
                p.colorName === product.colorName &&
                p.size === product.size
            )
          "
          @click="toggleProduct(product)"
          class="d-flex mr-4"
          density="compact"
          :false-icon="MaterialSymbolsCheckBoxOutlineBlankSharp"
          :true-icon="MaterialSymbolsCheckBoxSharp"
        ></v-checkbox>

        <CartProduct
          :productId="product.productId"
          :index="index"
          :imgUrl="product.imgUrl"
          :name="product.name"
          :colorName="product.colorName"
          :colorValue="product.colorValue"
          :size="product.size"
          :price="product.price"
          :quantity="product.quantity"
          :vendorId="product.vendorId"
          :storeName="product.storeName"
          :storeNameSlug="product.storeNameSlug"
        />
      </v-col>
    </v-row>

    <!-- CHECKOUT -->
    <v-row class="flex justify-end">
      <v-col cols="4" class="flex flex-col">
        <div class="flex justify-between">
          <p>Subtotal</p>
          <p>${{ subTotalPrice }}</p>
        </div>
        <v-btn
          text="checkout"
          class="my-2"
          variant="flat"
          color="primary"
          @click="checkoutItems"
          :disabled="!selectedCartList.length > 0"
          to="/checkout"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
