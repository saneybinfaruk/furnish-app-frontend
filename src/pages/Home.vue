<script setup lang="ts">
import Layout from "../components/Layout.vue";
import axios from "axios";
import {reactive, ref, watch} from "vue";
import Product from "../components/Product.vue";
import {useRouter} from "vue-router";
import {ProductType} from "../interfaces/types";


interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

// Define state variables
const fetchedData = ref<{
  products: { data: [], links: [], current_page: number, prev_page_url: string, next_page_url: string};
  categories: Category[];
  subcategories: string;
}>({products: {data: [], links: [],  current_page: 0, prev_page_url: '', next_page_url: '' }, categories: [], subcategories: ''});

const filters = reactive<{ subcategory: string[],page:number,current_page: number  }>({
  subcategory: [],
  page: 1,
  current_page: 1
});

// Fetch products and categories
const fetchProducts = async () => {


  try {
    const response = await axios.get('http://localhost:8000/api/products', {
      params: filters
    });


    fetchedData.value = response.data;



  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const router = useRouter();

const updateURL = () => {
  const queryParams: Record<string, any> = {subcategory: filters.subcategory};

  // Convert subcategory array into repeated query parameters
  if (filters.subcategory.length > 0) {
    queryParams.subcategory = filters.subcategory;
  }

  router.push({query: queryParams});
};
const filterBySubCategory = (subcategory: string) => {
  if (filters.subcategory.includes(subcategory)) {
    const index = filters.subcategory.indexOf(subcategory);
    console.log('item already exist in index => ', index);
    filters.subcategory.splice(index, 1)
    console.log('Removed!');

  } else {
    filters.subcategory.push(subcategory)

  }
  console.log(filters.subcategory)

  // updateURL();
  fetchProducts();
};

watch(filters, () =>{
  console.log('boga')
  // updateURL()
  fetchProducts()
});

// Fetch data on component mount
fetchProducts();
</script>


<template>
  <v-container>

    <v-row>

      <v-col cols="3">
        <!-- Categories -->
        <div  >
          <h1 class="text-xl font-bold mb-4">Product Categories</h1>

          <div v-for="category in fetchedData.categories" :key="category.slug" class="my-2 p-2 rounded">
            <h4

                class="font-semibold py-1 cursor-pointer hover:text-blue-600"
            >
              {{ category.name }}
            </h4>
            <div v-for="subcategory in category.subcategories" :key="subcategory.slug" class="mx-5 p-1">
              <h5
                  @click="filterBySubCategory(subcategory.slug)"
                  :class="filters.subcategory.includes(subcategory.slug) ? 'font-bold' : '' "
                  class="py-0.5 cursor-pointer hover:text-blue-600"
              >
                {{ subcategory.name }}
              </h5>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="9" >
        <!-- Products -->
        <v-container fluid >

          <v-row  >
            <v-col v-for="product in fetchedData.products.data" :key="product.id"  >
              <Product :product="product"/>
            </v-col>
          </v-row>



          <v-row align="center" justify="center" class="py-5">
            <v-btn variant="outlined" @click="filters.page--" :disabled="!fetchedData.products.prev_page_url">prev</v-btn>
            <p  class="px-3 py-1 font-semibold text-md mx-2 rounded-full ">{{fetchedData.products.current_page}}</p>
            <v-btn variant="outlined" @click="filters.page++" :disabled="!fetchedData.products.next_page_url">Next</v-btn>

<!--            <p class="mx-2 cursor-pointer" :class="link.active ? 'font-bold bg-red-300 px-2 rounded-full bg-opacity-30' : '' ">fff</p>-->
<!--            <div v-for="link in fetchedData.products.links" :key="link.label" class="flex gap-4"  >-->
<!--              <p @click="filters.current_page++" v-html="link.label" class="mx-2 cursor-pointer" :class="link.active ? 'font-bold bg-red-300 px-2 rounded-full bg-opacity-30' : '' "></p>-->
<!--            </div>-->
          </v-row>

        </v-container>
      </v-col>


    </v-row>

  </v-container>
</template>

