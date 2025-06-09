<script setup>
import ColorVariant from "./ColorVariant.vue";
import MaterialSymbolsArrowDropDownRounded from "~icons/material-symbols/arrow-drop-down-rounded";
import MaterialSymbolsArrowDropUpRounded from "~icons/material-symbols/arrow-drop-up-rounded";
import {onMounted, ref, watch} from "vue";
import {usePiniaStore} from "@/store/store";

const props = defineProps({
  variantRules: Object,
})

const store = usePiniaStore();
const { productVariants } = store;

 


const panel = ref([]);
const isValidList = ref([]);

 
watch(() => productVariants, (newVariants) => {

  isValidList.value = isValidated(newVariants);

  const newIndices = [];

  newVariants.forEach((_, index) => {
    if (!isValidList.value[index] && !panel.value.includes(index)) {
      newIndices.push(index);
    }
  });

  panel.value = [...new Set([...panel.value, ...newIndices])];
}, {deep: true});


onMounted(() => {
  isValidList.value = isValidated(productVariants);
  panel.value = productVariants.map((_, index) => index);


  console.log("productVariants From Panel Ex", productVariants);
})

const isValidated = (listToCheck) => listToCheck.map((variant) => variant.sizes.length > 0 && variant.images.length > 0);
</script>

<template>
  <p>{{productVariants.length}}</p>
  <v-expansion-panels v-if="productVariants.length > 0" class="py-5" v-model="panel"  multiple>
    <v-expansion-panel
        v-for="(colorVariant, index) in productVariants"
        :key="colorVariant.id"
        :expand-icon="MaterialSymbolsArrowDropDownRounded"
        :collapse-icon="MaterialSymbolsArrowDropUpRounded"
        :disabled="!isValidList[index]"
    >

      <ColorVariant
          :color-variant="colorVariant"
          :index="index"
          :variant-rules="variantRules"

      />
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>