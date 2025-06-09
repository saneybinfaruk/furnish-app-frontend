<script setup>
import IconParkOutlineAdProduct from "~icons/icon-park-outline/ad-product";
import IcRoundKeyboardArrowDown from "~icons/ic/round-keyboard-arrow-down";
import IcRoundKeyboardArrowUp from "~icons/ic/round-keyboard-arrow-up";
import { apiBaseUrl } from "../utils/utils";
import axios from "axios";
import SolarSettingsLinear from "~icons/solar/settings-linear";
import SolarInfoCircleLinear from "~icons/solar/info-circle-linear";
import SolarShopLinear from "~icons/solar/shop-linear";
import SolarHomeAngleLinear from "~icons/solar/home-angle-linear";
import SolarCartLinear from "~icons/solar/cart-linear";

import { onMounted, ref, watchEffect } from "vue";
import { useAuthStore } from "../store/store";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const selectedMenu = ref("");

const isLoading = ref(false);
const authStore = useAuthStore();

const checkUserRole = async () => {
  try {
    isLoading.value = true;

    const response = await axios.get(`${apiBaseUrl}api/me`, {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    authStore.user.role = response.data.role;

    if (!["admin", "vendor"].includes(response.data.role)) {
      router.replace({ name: "home" });
    }
  } catch (error) {
    console.log("submitStoreForm === ", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkUserRole();
});
</script>

<template>
  <v-container fluid>
    <v-row v-if="isLoading">
      <v-progress-linear
        color="yellow-darken-2"
        indeterminate
      ></v-progress-linear>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-row class="h-20">
          <v-col cols="3" class="border-r border-b"></v-col>
          <v-col class="border-r border-b"></v-col>
        </v-row>

        <v-row>
          <v-col cols="3" class="">
            <v-list v-model="selectedMenu">
              <v-list-item
                title="Home"
                :value="'home'"
                :to="{ name: 'dashboard-home' }"
                :prepend-icon="SolarHomeAngleLinear"
              />

              <v-list-item
                title="Vendors"
                :value="'vendors'"
                :to="{ name: 'vendors' }"
                v-show="authStore.user.role === 'vendor'"
                :prepend-icon="SolarShopLinear"
              />

              <v-list-item
                title="Orders"
                :value="'orders'"
                :to="{ name: 'orders' }"
                v-show="authStore.user.role === 'vendor'"
                :prepend-icon="SolarCartLinear"
              />

              <v-list-group
                value="Products"
                :prepend-icon="IcRoundKeyboardArrowDown"
                :collapse-icon="IcRoundKeyboardArrowUp"
                :expand-icon="IcRoundKeyboardArrowDown"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="IconParkOutlineAdProduct"
                    title="Products"
                  ></v-list-item>
                </template>

                <v-list-item
                  title="Product List"
                  variant="flat"
                  :value="'Product List'"
                  to="product-list"
                />

                <v-list-item
                  title="Add Product"
                  variant="flat"
                  :value="'Add Product'"
                  to="add-product"
                />
              </v-list-group>

              <v-list-group
                value="Categories"
                :prepend-icon="IcRoundKeyboardArrowDown"
                :collapse-icon="IcRoundKeyboardArrowUp"
                :expand-icon="IcRoundKeyboardArrowDown"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :prepend-icon="IconParkOutlineAdProduct"
                    title="Categories"
                  ></v-list-item>
                </template>

                <v-list-item
                  title="Category List"
                  variant="flat"
                  :value="'Category List'"
                  :to="{ name: 'Category List' }"
                  exact
                />

                <v-list-item
                  title="Sub Category List"
                  variant="flat"
                  value="Sub Category List"
                  :to="{ name: 'Sub Category List' }"
                  exact
                />
              </v-list-group>

              <v-list-item
                :prepend-icon="SolarSettingsLinear"
                title="Settings"
                variant="flat"
                :value="'Settings'"
              />

              <v-list-item
                :prepend-icon="SolarInfoCircleLinear"
                title="About"
                variant="flat"
                :value="'About'"
              />
            </v-list>
          </v-col>

          <v-col>
            <RouterView />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
