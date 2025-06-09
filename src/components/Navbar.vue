<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { mdiAccount } from "@mdi/js";
import MdiShoppingOutline from "~icons/mdi/shopping-outline";
import { useAuthStore, usePiniaStore } from "../store/store";
import { storeToRefs } from "pinia";
import vuesvg from "../assets/vue.svg";
import axios from "axios";
import { apiBaseUrl } from "../utils/utils";
import logo from "@/assets/furn_logo.png";
import { ro } from "vuetify/locale";
import MingcuteSearchLine from "~icons/mingcute/search-line";
import MingcuteUser1Line from "~icons/mingcute/user-1-line";
import MingcuteShoppingBag1Line from "~icons/mingcute/shopping-bag-1-line";
const store = usePiniaStore();
const authStore = useAuthStore();
const router = useRouter();
const logout = async () => {
  console.log("Logout");

  const response = await axios.post(
    apiBaseUrl + "api/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    }
  );

  console.log("Logout", response.data);

  if (response.data.success) {
    authStore.logout();
    router.replace({ name: "home" });
  }
};
const profileItems = [
  { title: "Manage Account", route: "/profile/info" },
  { title: "My Orders", route: "/profile/my-orders" },
  {
    title: "Log Out",
    route: null,
    action: logout,
  },
];

console.log("Navbar CartList ", store.cartList);

const menus = [
  { label: "Home", route: "/" },
  { label: "Products", route: "/products" },
  { label: "Stores", route: "/stores" },
  { label: "About", route: "/about" },
  { label: "Contact", route: "/contact" },
];
const route = useRoute();
const isActive = (path) => {
  return route.path === path;
};
</script>

<template>
  <nav class="h-20">
    <div class="flex items-center justify-between max-w-6xl mx-auto h-full">
      <img class="w-16" :src="logo" />
      <div class="flex gap-6 h-full mb-11">
        <RouterLink
          :class="`hover:bg-orange-200 px-1 pb-1 h-full flex items-end text-sm transition-colors duration-200 ${
            isActive(menu.route) ? 'bg-orange-100 font-semibold' : 'font-thin'
          }`"
          v-for="menu in menus"
          :to="`${menu.route}`"
        >
          {{ menu.label }}
        </RouterLink>
      </div>

      <div class="flex items-center">
        <v-btn variant="text" :icon="MingcuteSearchLine" size="small"></v-btn>

        <v-btn
          variant="text"
          to="/cart"
          :icon="MingcuteShoppingBag1Line"
          size="small"
        >
          <v-badge
            v-if="store.cartList.length"
            color="error"
            :content="store.cartList.length"
          >
            <v-icon :icon="MingcuteShoppingBag1Line"> </v-icon>
          </v-badge>
          <v-icon v-else :icon="MingcuteShoppingBag1Line"> </v-icon>
        </v-btn>

        <v-menu v-if="!authStore.user.token">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              :icon="MingcuteUser1Line"
              size="small"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in [
                { label: 'Login', route: '/login' },
                { label: 'Register', route: '/register' },
              ]"
              :key="item.label"
              :to="item.route"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu v-if="authStore.user.token">
          <template v-slot:activator="{ props }">
            <v-avatar size="small" role="button" v-bind="props">
              <v-img
                alt="John"
                src="https://cdn.vuetifyjs.com/images/john.jpg"
              ></v-img>
            </v-avatar>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in profileItems"
              :key="item.title"
              :value="index"
              :to="item.route"
              @click="item.action && item.action()"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </nav>
</template>
