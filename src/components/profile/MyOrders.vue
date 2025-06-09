<script setup>
import axios from "axios";
import { apiBaseUrl } from "@/utils/utils";
import { useAuthStore } from "@/store/store";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const orders = ref([]);

const fetchMyOrders = async () => {
  const response = await axios.get(apiBaseUrl + "api/orders", {
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  });
  orders.value = await response.data;

  console.log("Orders === ", orders.value);
};

fetchMyOrders();
</script>

<template>
  <RouterLink v-for="order in orders" :to="`my-orders/${order.id}`">
    <v-row no-gutters class="bg-white mb-5">
      <v-col v-for="(orderItem, index) in order.order_items" cols="12">
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
                <h5>{{ orderItem.vendor.store_name }}</h5>
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
  </RouterLink>
</template>
