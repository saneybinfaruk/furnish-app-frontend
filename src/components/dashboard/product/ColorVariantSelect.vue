<script setup>

import ProductVariantPanels from "@/components/dashboard/product/ProductVariantPanels.vue";
import IcTwotoneRadioButtonUnchecked from "~icons/ic/twotone-radio-button-unchecked";
import IcTwotoneRadioButtonChecked from "~icons/ic/twotone-radio-button-checked";

const props = defineProps({
  colorOption: String,

})

</script>

<template>
  <v-sheet>
    <h1 class="pb-2.5 font-semibold">Add Color Variant</h1>

    <v-sheet class="pa-7 border-thin rounded-lg">
      <v-sheet>
        <v-radio-group
            v-model="colorOption"
            @change="onColorOptionChange"
            :rules="radioGroupRule"
        >
          <v-row>
            <v-col>
              <v-radio
                  class="border border-dashed rounded py-4 pl-2"
                  label="With Color"
                  value="color"
                  :false-icon="IcTwotoneRadioButtonUnchecked"
                  :true-icon="IcTwotoneRadioButtonChecked"
              />
            </v-col>
            <v-col>
              <v-radio
                  class="border border-dashed rounded py-4 pl-2"
                  label="No Color"
                  value="no-color"
                  :false-icon="IcTwotoneRadioButtonUnchecked"
                  :true-icon="IcTwotoneRadioButtonChecked"
              />
            </v-col>
          </v-row>
        </v-radio-group>
      </v-sheet>

      <v-btn
          @click="addNewColorVariant"
          v-if="product.colorOption === 'color'"
      >Add Variant
      </v-btn>

      <ProductVariantPanels
          :variant-rules="variantRules"
          :color-variants="product.colorVariants"
          :elements="elements"
          :remove-item="removeItem"
          :update-data="updateData"

      />
    </v-sheet>
  </v-sheet>
</template>

<style scoped>

</style>