<script setup>
import { useFetchStores } from "../composables/useFetchStores";

const { fetchedStores, isLoading } = useFetchStores();
</script>
<template>
  <v-container max-width="1120">
    <v-row>
      <v-col
        v-for="(fetchedStore, index) in fetchedStores"
        class="!min-w-[220px] !max-w-[250px]"
      >
        <v-card>
          <v-img
            height="160"
            :src="`https://picsum.photos/id/${20 + index}/300/200`"
            cover
          ></v-img>

          <v-card-text>
            <p class="text-center font-semibold">
              {{ fetchedStore.store_name }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="green"
              variant="flat"
              :to="`/stores/${fetchedStore.store_name_slug}`"
              >Visit</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
