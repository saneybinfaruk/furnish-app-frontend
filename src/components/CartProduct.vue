<script setup>
import CartButton from "./CartButton.vue";
import { ref } from "vue";
import LineMdClose from "~icons/line-md/close";
import MaterialSymbolsCheckBoxOutlineBlankSharp from "~icons/material-symbols/check-box-outline-blank-sharp";
import MaterialSymbolsCheckBoxSharp from "~icons/material-symbols/check-box-sharp";
import MaterialSymbolsStorefrontOutlineRounded from "~icons/material-symbols/storefront-outline-rounded";
import { usePiniaStore } from "@/store/store";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";

const props = defineProps({
  index: Number,
  productId: Number,
  imgUrl: String,
  name: String,
  colorName: String,
  colorValue: String,
  size: String,
  price: Number,
  quantity: Number,
  vendorId: String,
  storeName: String,
  storeNameSlug: String,
});

const store = usePiniaStore();
const { cartList } = storeToRefs(store);
const { removeFromCart, addToCart } = store;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const productQuantity = ref(props.quantity);

const onQuantityChange = (quantity) => {
  productQuantity.value += quantity;

  addToCart(
    {
      productId: props.productId,
      name: props.name,
      imgUrl: props.imgUrl,
      colorName: props.colorName,
      colorValue: props.colorValue,
      size: props.size,
      price: props.price,
      quantity: productQuantity.value,
    },
    quantity
  );
};

const handleDeleteClick = () => {
  removeFromCart(
    props.productId,
    props.colorName,
    props.colorValue,
    props.size
  );
};
</script>

<template>
  <!-- <v-row
      class="border-b"
      v-show="index === 0 || cartList[index - 1].storeName !== storeName"
      ><v-col class="d-inline-flex align-center py-1">
        <v-checkbox
          class="my-1 d-flex mr-4"
          density="compact"
          :false-icon="MaterialSymbolsCheckBoxOutlineBlankSharp"
          :true-icon="MaterialSymbolsCheckBoxSharp"
        ></v-checkbox>
        <RouterLink :to="`/stores/${storeNameSlug}`">
          <div
            class="flex items-center gap-1 hover:text-red-400 transition-colors duration-200"
          >
            <v-icon :icon="MaterialSymbolsStorefrontOutlineRounded"></v-icon>
            <p>{{ storeName }}</p>
          </div>
        </RouterLink>
      </v-col></v-row
    > -->

  <v-row>
    <v-col cols="6">
      <RouterLink :to="`/products/${productId}`">
        <v-row>
          <v-col cols="3">
            <v-img
              :width="100"
              :height="100"
              :src="`${
                apiBaseUrl + 'storage/' + imgUrl ??
                'https://via.assets.so/furniture.png?id=1&q=95&w=360&h=360&fit=fill'
              }`"
              lazy-src="https://picsum.photos/500/500"
            >
              <template v-slot:error>
                <v-img
                  class="mx-auto"
                  height="500"
                  max-width="500"
                  :src="`https://picsum.photos/id/${productId}/500`"
                ></v-img>
              </template>
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
          </v-col>

          <v-col>
            <div class="break-words flex flex-col gap-2">
              <p class="font-weight-bold text-body-1">{{ name }}</p>
              <div class="flex flex-row gap-2">
                <v-sheet
                  class="w-7 h-5 rounded-sm"
                  elevation="1"
                  :style="{ backgroundColor: colorValue }"
                />
                <p class="text-body-2">{{ colorName }}</p>
              </div>
              <p class="text-body-2">{{ size }}</p>
            </div>
          </v-col>
        </v-row>
      </RouterLink>
    </v-col>

    <v-col class="flex align-center justify-center" cols="1">
      <p>${{ price }}</p>
    </v-col>

    <v-col class="flex align-center justify-center" cols="3">
      <CartButton
        :on-quantity-change="onQuantityChange"
        :quantity="productQuantity"
      />
    </v-col>

    <v-col class="flex align-center justify-between font-semibold" cols="2">
      <p class="w-full flex justify-center">
        {{ (price * productQuantity).toFixed(2) }}
      </p>

      <v-btn
        :icon="LineMdClose"
        size="x-small"
        @click.stop="handleDeleteClick()"
        variant="tonal"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<style scoped></style>
