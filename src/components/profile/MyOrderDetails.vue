<script setup>
import axios from "axios";
import { apiBaseUrl } from "@/utils/utils";
import { useAuthStore } from "@/store/store";
import { ref } from "vue";
import FormatDate from "../../utils/FormatDate";
import { formatDateTime, formatDateTime2 } from "@/utils/utils";

const order = ref(null);
const shippingAddress = ref(null);
const authStore = useAuthStore();

const props = defineProps({
  id: Number,
});

const fetchOrder = async () => {
  const response = await axios.get(apiBaseUrl + `api/orders/${props.id}`, {
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  });

  order.value = await response.data;

  console.log("order === ", order.value);

  shippingAddress.value = JSON.parse(order.value.shipping_address);
};

fetchOrder();
</script>
<template>
  <h1 class="text-h6 font-weight-medium mb-4">Order Details</h1>

  <v-row no-gutters>
    <v-col
      v-for="(orderItem, index) in order?.order_items"
      cols="12"
      class="bg-white"
    >
      <v-row
        v-show="
          index === 0 ||
          orderItem.vendor_id !== order.order_items[index - 1].vendor_id
        "
        class="pa-3"
      >
        <v-col>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <v-avatar>
                <v-img
                  alt="John"
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                ></v-img>
              </v-avatar>
              <h5>{{ orderItem?.vendor?.store_name }}</h5>
            </div>

            <p class="bg-gray-200 px-3 py-0.5 rounded-full text-subtitle-1">
              {{ order.payment_status ?? "PENDING" }}
            </p>
          </div>
        </v-col>
      </v-row>
      <v-divider
        v-show="
          index === 0 ||
          orderItem.vendor_id !== order.order_items[index - 1].vendor_id
        "
        class="border-opacity-100"
      ></v-divider>
      <v-row class="my-2 px-6">
        <v-col cols="2">
          <v-img
            height="100"
            :src="`https://picsum.photos/id/${orderItem.product_id}/100`"
          ></v-img>
        </v-col>
        <v-col cols="4" class="d-flex flex-col gap-0.5">
          <h5 class="text-body-1">{{ orderItem.product_name }}</h5>
          <div class="flex items-center gap-2">
            <p v-if="orderItem.color_name" class="text-gray-400 text-caption">
              Color: {{ orderItem.color_name }}
            </p>
            <div
              v-if="orderItem.color_value"
              class="w-6 h-4 rounded-full"
              :style="`background-color: ${orderItem.color_value}`"
            ></div>
          </div>
          <p v-if="orderItem.size" class="text-gray-400 text-caption">
            Size: {{ orderItem.size }}
          </p>
        </v-col>
        <v-col class="d-flex justify-center">
          <p>$ {{ orderItem.price }}</p>
        </v-col>
        <v-col>
          <div class="flex gap-1">
            <p class="text-gray-400">Qty:</p>
            <p>{{ orderItem.quantity }}</p>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-sheet class="pa-5">
        <h1 class="font-weight-medium">Order {{ order?.id }}</h1>
        <p class="text-caption">
          Placed on {{ formatDateTime(order?.created_at) }}
        </p>
        <p class="text-caption">Paid on {{ formatDateTime(order?.paid_at) }}</p>
      </v-sheet>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-sheet class="pa-5">
        <v-chip color="primary" variant="elevated" class="mb-2">
          <h6>Shipped</h6>
        </v-chip>
        <h5 class="my-2 font-semibold">
          {{ shippingAddress?.first_name }}
          {{ shippingAddress?.last_name }}
        </h5>
        <h5>
          {{ shippingAddress?.street_address }}
        </h5>
        <h5>
          {{ shippingAddress?.city }}, {{ shippingAddress?.state_name }} ({{
            shippingAddress?.state_code
          }}) {{ shippingAddress?.zip_code }}
        </h5>
        <h5>
          {{ shippingAddress?.country }}
        </h5>
        <h5 class="mt-2 font-semibold text-red-400">
          Phone: {{ shippingAddress?.contact_number }}
        </h5>
      </v-sheet>
    </v-col>
    <v-col>
      <v-sheet class="pa-5">
        <h3 class="text-h6 mb-3">Total Summary</h3>
        <div class="flex items-center justify-between my-1">
          <p>Subtotal({{ order?.order_items?.length }} Items)</p>
          <p>$ {{ order?.total_amount - order?.delivery_charge }}</p>
        </div>
        <div class="flex items-center justify-between">
          <p>Shipping Fee</p>
          <p>$ {{ order?.delivery_charge }}</p>
        </div>
        <v-divider class="border-opacity-100 my-5"></v-divider>
        <div class="flex items-center justify-between">
          <p>Total</p>
          <p>$ {{ order?.total_amount }}</p>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>
