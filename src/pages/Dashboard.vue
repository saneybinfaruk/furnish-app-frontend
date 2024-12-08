<script setup>
import LineMdHomeSimple from '~icons/line-md/home-simple';
import MaterialSymbolsHomeOutlineRounded from '~icons/material-symbols/home-outline-rounded';
import IconParkOutlineAdProduct from '~icons/icon-park-outline/ad-product';
import IcRoundKeyboardArrowDown from '~icons/ic/round-keyboard-arrow-down';
import IcRoundKeyboardArrowUp from '~icons/ic/round-keyboard-arrow-up';


import {ref} from "vue";


const selectedMenu = ref('Home');


</script>


<template>

  <v-container fluid>

    <v-row class="h-20">
      <v-col cols="3" class="border-r border-b "></v-col>
      <v-col class="border-r border-b"></v-col>
    </v-row>

    <v-row  >
      <v-col cols="3"  class="">
        <v-list v-model="selectedMenu">

          <!-- Home Item -->
          <v-list-item
              :prepend-icon="MaterialSymbolsHomeOutlineRounded"
              title="Home"
              variant="flat"
              :value="'Home'"
              to="home"
          />

          <!-- Products Group -->
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

            <v-list-item title="Add Product"
                         variant="flat"
                         :value="'Add Product'"
                         to="add-product"

            />
            <v-list-item title="Product 2"/>
          </v-list-group>


          <!-- Settings Item -->
          <v-list-item
              :prepend-icon="MaterialSymbolsSettingsOutlineRounded"
              title="Settings"
              variant="flat"
              :value="'Settings'"
          />

          <!-- About Item -->
          <v-list-item
              :prepend-icon="MaterialSymbolsInfoOutlineRounded"
              title="About"
              variant="flat"
              :value="'About'"
          />
        </v-list >


      </v-col>

      <v-col class="bg-blue-accent-1 pa-0">
        <RouterView/>
      </v-col>
    </v-row>

  </v-container>

</template>

<style scoped>

</style>