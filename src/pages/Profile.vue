<script setup>
import { watch, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import MaterialSymbolsServerPersonRounded from "~icons/material-symbols/server-person-rounded";
import IonReceipt from "~icons/ion/receipt";
import MaterialSymbolsReviews from "~icons/material-symbols/reviews";
import IcBaselineLocationOn from "~icons/ic/baseline-location-on";

const route = useRoute();
const items = [
  {
    title: "Account Information",
    route: "/profile/info",
    icon: MaterialSymbolsServerPersonRounded,
  },
  {
    title: "My Orders",
    route: "/profile/my-orders",
    icon: IonReceipt,
  },
  {
    title: "My Product Review",
    route: "/profile/my-product-reviews",
    icon: MaterialSymbolsReviews,
  },
  {
    title: "Manage Addresses",
    route: "/profile/my-addresses",
    icon: IcBaselineLocationOn,
  },
];

const isActive = (path) => {
  return route.path.startsWith(path);
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-list>
          <v-list-subheader
            class="text-h6 font-weight-bold text-black border-b pt-2 pb-4"
            >My Account</v-list-subheader
          >

          <div class="mt-2">
            <v-list-item
              v-for="(item, i) in items"
              :key="item.title"
              class="py-2 my-2"
              :to="item.route"
              :active="isActive(item.route)"
            >
              <template v-slot:prepend>
                <v-avatar class="bg-green">
                  <v-icon :icon="item.icon" size="20"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list>
      </v-col>

      <v-col cols="9">
        <RouterView></RouterView>
      </v-col>
    </v-row>
  </v-container>
</template>
