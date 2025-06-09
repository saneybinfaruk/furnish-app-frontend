<script setup>
import { ref } from "vue";
import { useFetchStore } from "../composables/useFetchStore";
import { useRoute, useRouter } from "vue-router";
import IcRoundStar from "~icons/ic/round-star";
import { formatDateTime } from "../utils/utils";
import FormatDate from "../utils/FormatDate";
const props = defineProps({
  storeId: String,
});

const { fetchedStore, isLoading } = useFetchStore(props.storeId);
const router = useRouter();
const tabs = ref(null);
 

</script>
<template>
  <v-container fluid class="!max-w-6xl mx-auto">
    <v-row v-if="isLoading">
      <v-col>
        <v-progress-linear
          color="red-darken-2"
          model-value="100"
          rounded
          indeterminate
        ></v-progress-linear>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <h3 class="font-semibold text-lg">{{ fetchedStore?.store_name }}</h3>
        <p class="text-sm">{{ fetchedStore?.product.length }} items</p>
      </v-col>

      <v-col class="max-w-6xl mx-auto">
        <v-tabs v-model="tabs" align-tabs="start">
          <v-tab value="storeProducts" class="text-none">Products</v-tab>
          <v-tab value="storeProfile" class="text-none">Profile</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tabs" class="py-5">
          <v-tabs-window-item value="storeProducts">
            <v-row justify="start">
              <v-col
                class="!min-w-[240px] !max-w-[240px] ma-0"
                v-for="(product, index) in fetchedStore?.product"
              >
                <v-sheet class="overflow-hidden">
                  <v-img
                    height="360"
                    :src="`https://picsum.photos/id/${40 + index}/300`"
                    color="grey-lighten-3"
                    class="position-relative"
                    role="button"
                    @click="router.push(`/products/${product.id}`)"
                    cover
                  >
                    <p class="w-fit bg-red px-3 absolute left-0 text-sm py-1">
                      33%
                    </p>
                  </v-img>

                  <div class="space-y-2 pa-4">
                    <div class="flex items-center gap-2">
                      <v-rating
                        :empty-icon="IcRoundStar"
                        :full-icon="IcRoundStar"
                        readonly
                        :length="5"
                        active-color="orange"
                        color="grey-lighten-1"
                        :model-value="3"
                        density="0"
                        half-increament
                        size="small"
                      ></v-rating>
                      <p class="text-xs text-gray-400">(2 reviews)</p>
                    </div>
                    <h5 class="text-sm font-semibold">{{ product.name }}</h5>
                    <div class="flex gap-3 items-center">
                      <p class="text-md text-gray-600">$20.00-$29.00</p>
                    </div>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <v-tabs-window-item value="storeProfile">
            <v-sheet class="px-6 py-4 space-y-6">
              <p>
                Joined at -
                <span class="font-semibold text-lg">{{
                  FormatDate(fetchedStore?.created_at)
                }}</span>
              </p>
              <p>{{ fetchedStore?.store_description }}</p>

              <div>
                <p>Address:</p>
                <p class="font-bold">
                  {{ fetchedStore?.store_address }}
                </p>
              </div>
            </v-sheet>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
  </v-container>
</template>
