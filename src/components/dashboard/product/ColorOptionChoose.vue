<script setup>
import IcTwotoneRadioButtonUnchecked from "~icons/ic/twotone-radio-button-unchecked";
import IcTwotoneRadioButtonChecked from "~icons/ic/twotone-radio-button-checked";
import { ref, watch, toRef } from "vue";
import { usePiniaStore } from "../../../store/store";

const props = defineProps({
  colorOptionRules: Array,
});

const store = usePiniaStore();

 

console.log("Color Option Choose ", store.product.colorOption);


watch(() => store.product.colorOption, (newValue) => {
  console.log("Pinia store product.colorOption updated:", newValue);

});

</script>

<template>
  <v-radio-group v-model="store.product.colorOption" :rules="colorOptionRules">
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
</template>

<style scoped></style>
