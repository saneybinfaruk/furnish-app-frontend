<script setup>
import Navbar from "./components/Navbar.vue"; // Import Navbar component
import Footer from "./components/Footer.vue";
import second from "./components/Footer.vue";
import SubNav from "./components/SubNav.vue"; // Import SubNav component
import { RouterView, useRoute } from "vue-router"; // Import RouterView for routing

const route = useRoute();
</script>

<template>
  <v-app>
    <!-- Vuetify's root component to wrap everything -->
    <!-- Navbar and SubNav are global components for the layout -->
    <template v-if="!route.meta.hideSubNav">
      <Navbar />
    </template>

    <!-- Main content area, limits width for centering -->
    <v-main class="bg-[#F4F5F7]">
      <!-- This is where the route-specific components will be rendered -->
      <RouterView />
    </v-main>

    <Footer />
  </v-app>
</template>

<style scoped>
/* Add any global or component-specific styles here */
</style>
