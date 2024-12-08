<script setup>
import LineMdStarAltFilled from '~icons/line-md/star-alt-filled'
import RadixIconsStar from '~icons/radix-icons/star'
import RadixIconsStarFilled from '~icons/radix-icons/star-filled'
import RadixIconsChevronDown from '~icons/radix-icons/chevron-down'
import {onMounted, reactive, ref, watch} from "vue";
import CartButton from "../components/CartButton.vue";
import RadixIconsHeart from '~icons/radix-icons/heart'
import LineMdArrowSmallDown from '~icons/line-md/arrow-small-down'
import StreamlineShoppingBagHandBag2ShoppingBagPurseGoodsItemProducts
  from '~icons/streamline/shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products'
import {VCol} from "vuetify/components";
import {usePiniaStore} from "../store/store.ts";
import axios from "axios";

const props = defineProps({
  id: String
})

const sizes = ['extra small', 'small', 'medium', 'large', 'extra large'];
const colors = ['red', 'green', 'blue', 'yellow', 'black'];
const selectedImg = ref(0);
const selectedColor = ref(colors[0]);
const selectedSize = ref(sizes[0]);
const showCart = ref(false);
const product = reactive({
  productQuantity: 0,
  attributes: {}
});


const furnitureStore = usePiniaStore();
const {addToCart} = furnitureStore;


watch([() => product.productQuantity], () => {
  showCart.value = product.productQuantity > 0;
});

const changeImg = (img) => {
  selectedImg.value = img;
}

const onColorSelect = (color) => {
  selectedColor.value = color;
  product.productQuantity = 0;
}

const fetchProducts = async () => {

  try {
    const response = await axios.get(`http://localhost:8000/api/products/${props.id}`);


    product.attributes = response.data;

    // console.log('products === ', response.data)

  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(() => fetchProducts())

const onUpdatedQuantity = (value) => {
  showCart.value = value > 0
  console.log(value)
}

const onAddToCart = (value) => {

  product.productQuantity += value;
  if (product.productQuantity > 0) {
    addToCart(product.attributes, selectedColor.value, selectedSize.value)
  }

}



</script>

<template>

  <v-container>
    <v-row class="" align="center">

      <v-col class=" relative" cols="7">

        <v-row class=" ">

          <v-col class="pt-6 flex flex-col items-center justify-center  max-h-[500px] overflow-y-scroll no-scrollbar">

            <div v-for="i in 8" :key="i">
              <img
                  @click="changeImg(i)"
                  :class="selectedImg === i ? 'bg-green-500' : '' "
                  class="w-[70px] border border-red-700 p-3 my-2 rounded cursor-pointer hover:ring ring-green-800"
                  :src="`https://media.assets.so/?url=https://via.assets.so/furniture.png?id=${i}&q=95&w=360&h=360&fit=fill`"
                  alt=""
              />


            </div>

          </v-col>


          <v-col cols="9" class="flex items-center">
            <v-img :width="500" class="px-6"
                   :src="`https://media.assets.so/?url=https://via.assets.so/furniture.png?id=${selectedImg}&q=95&w=360&h=360&fit=fill`"></v-img>

          </v-col>


        </v-row>


      </v-col>

      <v-col>
        <v-row>
          <v-col>
            <h1>{{ product.attributes.name }}</h1>
            <div class="flex flex-row items-center gap-4">
              <v-rating
                  half-increments
                  readonly
                  :length="5"
                  size="small"
                  density="compact"
                  :model-value="product.attributes.rating"
                  active-color="orange"
                  color="orange-lighten-1"
                  :empty-icon="RadixIconsStar"
                  :full-icon="RadixIconsStarFilled"
              />
              <p class="text-gray-300">(34 Reviews)</p>
            </div>

            <div class="flex flex-row items-center gap-4 mt-2">
              <h3 class="text-3xl">${{ product.attributes.price }}</h3>
              <div class="flex items-center cursor-pointer">
                <div v-for="color in colors" class="inline-flex">
                  <span @click="onColorSelect(color)"
                        :class="`w-6 h-6 bg-${color} block rounded-full mx-1 hover:ring ${selectedColor === color ? 'ring ring-violet-600' : ''} transition-all duration-200`"></span>
                </div>
              </div>
            </div>
            <v-select
                hint="Choose size"
                label="The Size"
                :append-inner-icon="RadixIconsChevronDown"
                :items="sizes"
                v-model="selectedSize"
                persistent-hint
            ></v-select>

          </v-col>

        </v-row>
        <v-row align="center">
          <v-col v-if="showCart">
            QTY
            <CartButton :product="product.attributes" :quantity="product.productQuantity"
                        :on-quantity-change="onAddToCart"/>
          </v-col>
          <v-col v-else cols="auto">

            <v-btn active-color="red" base-color="#000" :tile="true" elevation="0" density="comfortable" size="large"
                   @click="onAddToCart(1)">
              <p class="text-xs font-semibold">Add to cart</p>
              <!-- Ensure Streamline icon is correctly defined/imported -->
              <v-icon :icon="StreamlineShoppingBagHandBag2ShoppingBagPurseGoodsItemProducts" size="x-small"
                      class="ml-2"></v-icon>
            </v-btn>

          </v-col>

          <v-col>
            <v-btn variant="outlined" :icon="RadixIconsHeart" class="text-red" size="small"/>
          </v-col>
        </v-row>


      </v-col>
    </v-row>
  </v-container>


</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Edge */
}

.no-scrollbar {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}

</style>