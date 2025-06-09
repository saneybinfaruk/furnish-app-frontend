<script setup>
import { usePiniaStore } from "@/store/store";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { apiBaseUrl } from "../utils/utils";
import { useAuthStore } from "../store/store";

const defaultAddresses = ref(null);

const store = usePiniaStore();
const authStore = useAuthStore();
const { cartList, selectedCartList } = storeToRefs(store);
const isLoading = ref(true);
const deliveryCharge = ref(null);

const fetchDefaultAddress = async () => {
  try {
    const response = await axios.get(apiBaseUrl + `api/address/default`, {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    defaultAddresses.value = await response.data.addresses;
    deliveryCharge.value = await response.data.deliveryCharge;

    console.log("Default Address === ", defaultAddresses.value);
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const subTotalPrice = computed(() => {
  return selectedCartList.value
    .reduce((total, product) => total + product.quantity * product.price, 0)
    .toFixed(2);
});

const totalPrice = computed(() => {
  const subTotal = parseFloat(subTotalPrice.value) || 0;
  const delivery = parseFloat(deliveryCharge.value) || 0;
  return (subTotal + delivery).toFixed(2);
});

fetchDefaultAddress();

const onPaymentClick = async () => {
  const cartSendForCheckout = cartList.value.map((cartItem) => {
    return {
      productId: cartItem.productId,
      productVariantId: cartItem.productVariantId,
      quantity: cartItem.quantity,
      size: cartItem.size,
      vendorId: cartItem.vendorId,
    };
  });

  try {
    const response = await axios.post(
      apiBaseUrl + "api/make-payment",
      { cart: cartSendForCheckout },
      {
        headers: {
          Authorization: `Bearer ${authStore.user.token}`,
        },
      }
    );
    const { clientSecret, publishableKey } = await response.data;
    const stripe = await loadStripe(publishableKey);

    await stripe.redirectToCheckout({ sessionId: clientSecret });
  } catch (error) {
    console.log("Error == ", error);
  }
};

console.log("Selected Cart List === ", selectedCartList.value);
</script>
<template>
  <v-container max-width="1152">
    <v-row v-if="isLoading">
      <v-progress-linear
        color="yellow-darken-2"
        indeterminate
      ></v-progress-linear>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-row>
          <v-col v-for="(address, index) in defaultAddresses">
            <v-sheet class="h-auto" min-width="280" max-width="340" rounded>
              <div class="pa-8 space-y-2">
                <h5
                  class="text-subtitle-1 font-weight-black pb-2"
                  v-if="
                    address.is_default_shipping && address.is_default_billing
                  "
                >
                  Default Shipping & Billing Address
                </h5>
                <h5
                  class="text-subtitle-1 font-weight-black pb-2"
                  v-if="
                    address.is_default_shipping && !address.is_default_billing
                  "
                >
                  Default Shipping Address
                </h5>
                <h5
                  class="text-subtitle-1 font-weight-black pb-2"
                  v-if="
                    !address.is_default_shipping && address.is_default_billing
                  "
                >
                  Default Billing Address
                </h5>

                <p>{{ address.first_name }} {{ address.last_name }}</p>
                <p>{{ address.contact_number }}</p>
                <p>{{ address.street_address }}</p>
                <p>
                  {{ address.city }}, {{ address.state_name }},
                  {{ address.zip_code }}
                </p>
                <p>{{ address.country }}</p>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-sheet rounded class="pa-5">
              <v-col>
                <v-row v-for="cartItem in selectedCartList" class="mb-1">
                  <v-col cols="7">
                    <v-row>
                      <v-col cols="3" class="pa-1">
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
                              :src="`https://picsum.photos/id/${cartItem.productId}/500`"
                            ></v-img>
                          </template>
                          <template v-slot:placeholder>
                            <div
                              class="d-flex align-center justify-center fill-height"
                            >
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
                          <p class="font-weight-bold text-body-1">
                            {{ cartItem.name }}
                          </p>
                          <div class="flex flex-row gap-2">
                            <v-sheet
                              class="w-7 h-5 rounded-sm"
                              elevation="1"
                              :style="{ backgroundColor: cartItem.colorValue }"
                            />
                            <p class="text-body-2">{{ cartItem.colorName }}</p>
                          </div>
                          <p class="text-body-2">{{ cartItem.size }}</p>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col class="flex align-center justify-center">
                    <p>${{ cartItem.price }}</p>
                  </v-col>

                  <v-col class="flex align-center justify-center">
                    <p>
                      Qty: <strong class="px-1">{{ cartItem.quantity }}</strong>
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="4">
        <v-sheet class="pa-5" rounded>
          <h5 class="text-h6 font-weight-bold">Order Summary</h5>
          <div class="flex items-center justify-between">
            <h5>Sub total</h5>
            <h5>${{ subTotalPrice }}</h5>
          </div>
          <div class="flex items-center justify-between">
            <h5>Delivery fees</h5>
            <h5>${{ deliveryCharge }}</h5>
          </div>
          <v-divider class="border-opacity-100 my-3"></v-divider>
          <div class="flex items-center justify-between">
            <h5>Total</h5>
            <h5>${{ totalPrice }}</h5>
          </div>
          <v-btn
            variant="tonal"
            color="blue-accent-3"
            @click="onPaymentClick"
            block
          >
            <p>
              pay <strong class="text-lg">${{ totalPrice }}</strong>
            </p>
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row></v-container
  >
</template>
