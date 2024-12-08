<script setup>
import {RouterLink} from "vue-router";
import {mdiAccount} from '@mdi/js'
import MdiShoppingOutline from '~icons/mdi/shopping-outline'
import {usePiniaStore} from "../store/store.ts";
import {storeToRefs} from "pinia";

const furnitureStore = usePiniaStore();
const {cartList} = storeToRefs(furnitureStore);

</script>

<template>
  <nav class="flex items-center justify-between bg-violet-200 px-12 py-5">
    <h1 class="text-xl">Navbar</h1>

    <div class="flex items-center gap-6 ">
      <RouterLink to="/">Home</RouterLink>

      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/cart" class="relative">
        <MdiShoppingOutline/>
        <p class="absolute -top-3 -right-1 font-semibold text-xs">{{  cartList.length }}</p>
      </RouterLink>
      <RouterLink to="/dashboard/home">Dashboard</RouterLink>




    </div>
  </nav>
</template>
