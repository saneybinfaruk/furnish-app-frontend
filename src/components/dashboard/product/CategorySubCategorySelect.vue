<script setup>
import {onMounted, ref, watch, watchEffect} from "vue";
import axios from "axios";

const props = defineProps({

  productCategory: Number,
  productSubCategory: Number,
  categoryRules: Array,
  subCategoryRules: Array,
});


const productCategory = ref(props.productCategory);
const productSubCategory = ref(props.productSubCategory);

const categories = ref();
const subCategories = ref();

const fetchedData = ref();

const emit = defineEmits(['update:productCategory', 'update:productSubCategory']);

const fetch = async () => {

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/categories");
    fetchedData.value = response.data;

    categories.value = fetchedData.value.map((category) => ({
      categoryName: category.name,
      categoryId: category.id,
    }));


    console.log("Sub Category Id ", productSubCategory.value);
    if(productSubCategory.value) {
      setSubCategory(productCategory.value);
    }

  } catch (e) {
    console.log(e);
  }
};


watch(productCategory, (newValue) => {
  emit('update:productCategory', newValue);

  productSubCategory.value = null;
  setSubCategory(newValue);
});


watch(productSubCategory, (newValue) => {
  emit('update:productSubCategory', newValue);
});

const setSubCategory = (categoryId) => {
  const selectedCategory = fetchedData.value.find((c) => c.id === categoryId);
  if (selectedCategory) {
    subCategories.value = selectedCategory.subcategories.map(
        (subcategory) => ({
          subcategoryName: subcategory.name,
          subcategoryId: subcategory.id,
        })
    );
  } else {
    subCategories.value = []; // Clear subcategories if no category is selected
  }
}
onMounted(() => {
  fetch();
});
</script>

<template>
  <h1 class="pb-2.5 font-semibold">Category</h1>

  <v-sheet class="pa-7 border-thin rounded-lg">
    <v-sheet class="pb-6 space-y-2.5">
      <v-select
          v-model="productCategory"
          :items="categories"
          :rules='categoryRules'
          item-title="categoryName"
          item-value="categoryId"
          label="Select a category"
          variant="outlined"
      ></v-select>

    </v-sheet>

    <v-sheet v-show="productCategory != null">

      <v-select
          variant="outlined"
          :items="subCategories"
          item-title="subcategoryName"
          item-value="subcategoryId"
          v-model="productSubCategory"
          label="Select a subcategory"
          :rules='subCategoryRules'
      ></v-select>


    </v-sheet>
  </v-sheet>


</template>

<style scoped>

</style>