<script setup>

import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import IcTwotoneRadioButtonUnchecked from '~icons/ic/twotone-radio-button-unchecked';
import IcTwotoneRadioButtonChecked from '~icons/ic/twotone-radio-button-checked';
import IcSharpRadio from '~icons/ic/sharp-radio';

const categories = ref();
const subCategories = ref();
const selectedCategory = ref();
const selectedSubCategory = ref();
const fetchedData = ref();
const selectedColorMode = ref('rgba');
const colorModes = ['hsla', 'rgba', 'hexa'];
const selectedColor = ref('#000')
const selectedDiscountType = ref('1');
const discountPercentage = ref(0);

watch(selectedColorMode, (value) => {
  selectedColorMode.value = value;
})

watch(selectedColor, (value) => {
  selectedColor.value = value;
})

watch(discountPercentage, (value) => {
  discountPercentage.value = value;

  console.log('Selected discount Percentage => ', discountPercentage.value);
})


watch(selectedDiscountType, (value) => {
  discountPercentage.value = 0;
  selectedDiscountType.value = value;

  console.log('Selected discount price => ', selectedDiscountType.value);
})

const fixedDiscountValue = computed({
  get() {
    // Display an empty string when discountPercentage is 0
    return discountPercentage.value === 0 ? '' : discountPercentage.value;
  },
  set(value) {
    // Reset to 0 if the input is empty or set the number value otherwise
    discountPercentage.value = value === '' ? 0 : Number(value);
  },
});

const fetch = async () => {

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/categories')
    fetchedData.value = response.data;
    categories.value = fetchedData.value.map((category) => ({
      text: category.name,
      value: category.id,
    }));


  } catch (e) {
    console.log(e)
  }
}

watch(selectedCategory, (newValue) => {
  selectedSubCategory.value = null;
  // Find the selected category and map its subcategories
  const category = fetchedData.value.find((c) => c.id === newValue);
  if (category) {
    subCategories.value = category.subcategories.map((subcategory) => ({
      text: subcategory.name,
      value: subcategory.id,
    }));
  } else {
    subCategories.value = []; // Clear subcategories if no category is selected
  }

  console.log("Selected Category:", newValue);
  console.log("Subcategories:", subCategories.value);
});
onMounted(() => fetch());
</script>

<template>
  <div class="bg-white h-16"></div>
  <v-container>

    <v-row>
      <v-col class="bg-white rounded-md pa-6 space-y-9 ma-4 mr-2">
        <div>
          <h1 class="pb-2.5 font-semibold">Description</h1>

          <v-sheet class="pa-7 border-thin rounded-lg">

            <h3 class="pb-1">Product Name</h3>
            <v-text-field variant="outlined" placeholder="Product Name..."></v-text-field>

            <h3 class="py-1">Product Description</h3>
            <v-textarea variant="outlined" placeholder="Product Name..."></v-textarea>

          </v-sheet>
        </div>

        <div>
          <h1 class="pb-2.5 font-semibold">Category</h1>

          <v-sheet class="pa-7 border-thin rounded-lg">

            <h3 class="pb-1">Product Category</h3>
            <v-select
                variant="outlined"
                :items="categories"
                item-title="text"
                item-value="value"
                v-model="selectedCategory"
            ></v-select>

            <h3 class="py-1">Product Subcategory</h3>
            <v-select
                variant="outlined"
                :items="subCategories"
                item-title="text"
                item-value="value"
                v-model="selectedSubCategory"
            ></v-select>

          </v-sheet>
        </div>

        <v-sheet>
          <h1 class="pb-2.5 font-semibold">Color</h1>
          <v-sheet class="pa-7 border-thin rounded-lg">

            <h3 class="py-1">Select Color</h3>
            <v-color-picker
                v-model="selectedColor"
                v-model:mode="selectedColorMode"
            ></v-color-picker>

            <v-select
                v-model="selectedColorMode"
                :items="colorModes"
                style="max-width: 300px"
                label="Color Mode"
            ></v-select>

            <div class="d-flex gap-8 items-center ">
              <div
                  class="w-33 rounded-full border border-gray-300"
                  :style="{ backgroundColor: selectedColor || '#ff0000' }"

              ></div>
              <p>{{ selectedColor }}</p>
            </div>
          </v-sheet>
        </v-sheet>


      </v-col>

      <v-col class="bg-white rounded-md pa-6 space-y-9 ma-4 ml-2">

          <v-sheet>
            <h1 class="pb-2.5 font-semibold">Pricing</h1>

            <v-sheet class="pa-7 border-thin rounded-lg">
              <h3 class="pb-1">Base Price</h3>
              <v-text-field
                  variant="outlined"
                  placeholder="Product Name..."
              ></v-text-field>

              <h3 class="py-1">Discount Type</h3>
              <v-radio-group v-model="selectedDiscountType">
                <v-row justify="space-between" align="center">
                  <v-col cols="4">
                    <v-radio
                        class="border border-dashed rounded"
                        label="No Discount"
                        value="1"
                        :false-icon="IcTwotoneRadioButtonUnchecked"
                        :true-icon="IcTwotoneRadioButtonChecked"
                    />
                  </v-col>

                  <v-col cols="4">
                    <v-radio
                        class="border border-dashed rounded"
                        label="Percentage"
                        value="2"
                        :false-icon="IcTwotoneRadioButtonUnchecked"
                        :true-icon="IcTwotoneRadioButtonChecked"
                    />
                  </v-col>

                  <v-col cols="4">
                    <v-radio
                        class="border border-dashed rounded"
                        label="Fixed"
                        value="3"
                        :false-icon="IcTwotoneRadioButtonUnchecked"
                        :true-icon="IcTwotoneRadioButtonChecked"
                    />
                  </v-col>
                </v-row>
              </v-radio-group>

              <v-sheet v-if="selectedDiscountType === '2'" class="mt-5">
                <p class="mb-5">Set Discount Percentage</p>
                <p class="font-weight-bold d-flex justify-center text-h4 mb-10">{{discountPercentage}}%</p>
                <v-slider
                    max="100"
                    min="5"
                    show-ticks="always"
                    step="5"
                    thumb-label="always"
                    messages="Set a percentage discount to be applied on this product."
                    v-model="discountPercentage"
                ></v-slider>
              </v-sheet>

              <v-sheet v-if="selectedDiscountType === '3'" class="mt-5">
                <p class="mb-2">Fixed Discounted Price</p>
                <v-text-field
                    variant="outlined"
                    placeholder="Discounted Price"
                    type="number"
                    v-model="discountPercentage"
                    messages="Set the discounted product price. The product will be reduced at the determined fixed price"
                ></v-text-field>
              </v-sheet>


            </v-sheet>
          </v-sheet>

        <v-sheet>
          <h1 class="pb-2.5 font-semibold">Size</h1>

          <v-sheet class="pa-7 border-thin rounded-lg">
            <h3 class="pb-1">Select Size</h3>
            <v-combobox variant="outlined" items="[]">

            </v-combobox>

          </v-sheet>
        </v-sheet>


      </v-col>

    </v-row>
  </v-container>
</template>

<style scoped>
.v-input__messages {
  padding-left: 0 !important;
}
</style>