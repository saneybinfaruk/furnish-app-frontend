<script setup>
import { ref, watch } from "vue";
import IcTwotoneRadioButtonUnchecked from "~icons/ic/twotone-radio-button-unchecked";
import IcTwotoneRadioButtonChecked from "~icons/ic/twotone-radio-button-checked";

const props = defineProps({
  discountType: String,
  discount: Number,
});



const discountType = ref(props.discountType);
const discount = ref(props.discount);

const emits = defineEmits(["updateDiscount"]);

const onChange = (e) => {
  discount.value = 0;
};

watch([discountType, discount], ([discountType, discount]) => {
  emits("updateDiscount", { discountType, discount });
});
</script>

<template>
  <v-sheet class="pb-5">
    <h3 class="py-1">Discount Type</h3>
    <v-radio-group v-model="discountType" @change="onChange">
      <v-row justify="space-between">

        <v-col cols="12" md="4">
          <v-radio
            class="border border-dashed rounded py-4 pl-2"
            label="No Discount"
            value="no-discount"
            :false-icon="IcTwotoneRadioButtonUnchecked"
            :true-icon="IcTwotoneRadioButtonChecked"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-radio
            class="border border-dashed rounded py-4 pl-2"
            label="Percentage"
            value="percentage"
            :false-icon="IcTwotoneRadioButtonUnchecked"
            :true-icon="IcTwotoneRadioButtonChecked"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-radio
            class="border border-dashed rounded py-4 pl-2"
            label="Fixed"
            value="fixed"
            :false-icon="IcTwotoneRadioButtonUnchecked"
            :true-icon="IcTwotoneRadioButtonChecked"
          />
        </v-col>
      </v-row>
    </v-radio-group>

    <v-sheet v-if="discountType === 'percentage'" class="mt-5">
      <p class="mb-5">Set Discount Percentage</p>
      <p class="font-weight-bold d-flex justify-center text-h4 mb-10">
        {{ discount }}%
      </p>
      <v-slider
        max="100"
        min="0"
        show-ticks="always"
        step="5"
        thumb-label="always"
        messages="Set
                a percentage discount to be applied on this product."
        v-model="discount"
      ></v-slider>
    </v-sheet>

    <v-sheet v-if="discountType === 'fixed'" class="mt-5">
      <p class="mb-2">Fixed Discounted Price</p>
      <v-text-field
        variant="outlined"
        placeholder="Discounted Price"
        type="number"
        v-model="discount"
        messages="Set the discounted product price. The product will be reduced at the determined fixed price"
      ></v-text-field>
    </v-sheet>
  </v-sheet>
</template>
