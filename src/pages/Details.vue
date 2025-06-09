<script setup>
import RadixIconsStar from "~icons/radix-icons/star";
import RadixIconsStarFilled from "~icons/radix-icons/star-filled";
import { computed, onMounted, reactive, ref, watch } from "vue";
import CartButton from "../components/CartButton.vue";
import RadixIconsHeart from "~icons/radix-icons/heart";
import StreamlineShoppingBagHandBag2ShoppingBagPurseGoodsItemProducts from "~icons/streamline/shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products";
import { VCol } from "vuetify/components";
import { usePiniaStore } from "@/store/store.js";
import { useFetchProduct } from "../composables/useFetchProduct.js";
import RadixIconsChevronRight from "~icons/radix-icons/chevron-right";
import RadixIconsChevronLeft from "~icons/radix-icons/chevron-left";
import orangeSufa from "../assets/fatty_sofa.png";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import IcRoundStar from "~icons/ic/round-star";
import { formatDateTime, formatDateTime2 } from "../utils/utils.js";
import { useRoute, useRouter } from "vue-router";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();
const route = useRoute();

const props = defineProps({
  id: String,
});

const sizes = ref(["extra small", "small", "medium", "large", "extra large"]);
const productImages = ref([]);
const variants = ref([]);
const colors = ref([]);
const selectedImg = ref(null);
const selectedVariant = ref();
const selectedSize = ref(0);
const showCart = ref(false);
const selectedImageIndex = ref(null);
const product = reactive({
  productQuantity: 0,
  attributes: {},
});
const { fetchedProduct, isLoading } = useFetchProduct(props.id);

// watch(isLoading, () => {
//   product.attributes = fetchedProduct.value;
//   colors.value = product.attributes.productVariants.map((v) => v.colorValue);
//   variants.value = product.attributes.productVariants.map((v) => {
//     return {
//       id: v.id,
//       colors: {
//         name: v.colorName,
//         value: v.colorValue,
//       },
//       sizes: v.sizes,
//       price: v.price,
//       discountType: v.discountType,
//       discount: v.discount,
//       stock: v.stock,
//       images: v.images,
//     };
//   });
//   onColorSelect(variants.value[0]);
//   productImages.value = product.attributes.productVariants.flatMap(
//     (v) => v.images
//   );
//   // console.log("Mov === ", selectedVariant.value);
// });

watch(
  isLoading,
  (newLoading) => {
    if (!newLoading && fetchedProduct.value) {
      product.attributes = fetchedProduct.value;
      colors.value = product.attributes.productVariants.map(
        (v) => v.colorValue
      );
      variants.value = product.attributes.productVariants.map((v) => ({
        id: v.id,
        colors: {
          name: v.colorName,
          value: v.colorValue,
        },
        sizes: v.sizes,
        price: v.price,
        discountType: v.discountType,
        discount: v.discount,
        stock: v.stock,
        images: v.images,
      }));

      if (!selectedVariant.value) {
        onColorSelect(variants.value[0]); // Only call if not already set
      }

      productImages.value = product.attributes.productVariants.flatMap(
        (v) => v.images
      );

      // syncFiltersWithRoute(); // Call once after setting initial state
    }
  },
  { immediate: true }
);

const furnitureStore = usePiniaStore();
const { addToCart } = furnitureStore;

watch([() => product.productQuantity], () => {
  showCart.value = product.productQuantity > 0;
});

const changeImg = (img) => {
  selectedImg.value = img;

  const index = productImages.value.findIndex((v) => v === img);
  selectedImageIndex.value = index;
  // console.log("Selected index ", selectedImageIndex.value);
  // console.log("Selected Images ", selectedImg.value);
};
watch(selectedSize, (v) => (product.productQuantity = 0));

const onColorSelect = (variant) => {
  selectedVariant.value = variant;
  product.productQuantity = 0;

  selectedSize.value = 0;
  changeImg(variant.images[0]);

  console.log("selected variant == ", variant);
};

const onUpdatedQuantity = (value) => {
  showCart.value = value > 0;
  console.log(value);
};

const onAddToCart = (productQuantity) => {
  product.productQuantity += productQuantity;
  if (product.productQuantity > 0) {
    addToCart(
      {
        productId: product.attributes.id,
        vendorId: product.attributes.vendor_id,
        storeName: product.attributes.vendor.store_name,
        storeNameSlug: product.attributes.vendor.store_name_slug,
        productVariantId: selectedVariant.value.id,
        name: product.attributes.name,
        imgUrl: selectedVariant.value.images[0],
        colorName: selectedVariant.value.colors.name,
        colorValue: selectedVariant.value.colors.value,
        size: selectedVariant.value.sizes[selectedSize.value],
        price: calculateDiscountedPrice.value,
        quantity: product.productQuantity,
        timeDate: Date.now(),
      },
      productQuantity
    );
  }
};

const badgeContent = computed(() => {
  const variant = selectedVariant.value;
  const productPrice = variant?.price ?? product.attributes.price;

  // Check if the base product discount is "no-discount"
  const baseDiscountType = product.attributes.discount_type;
  const baseDiscountValue = product.attributes.discount;

  const variantDiscountType = variant?.discountType;
  const variantDiscountValue = variant?.discount;

  let discountedPrice = productPrice;

  // Determine the effective discount type and value
  const discountType =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountType
      : baseDiscountType !== "no-discount"
      ? baseDiscountType
      : "no-discount";

  const discountValue =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountValue
      : baseDiscountType !== "no-discount"
      ? baseDiscountValue
      : 0;

  if (discountType === "fixed") {
    return `$${discountValue}`;
  } else if (discountType === "percentage") {
    return `${discountValue}%`;
  }
  return null; // No discount
});

const calculateDiscountedPrice = computed(() => {
  const variant = selectedVariant.value;
  const productPrice = variant?.price ?? product.attributes.price;

  // Check if the base product discount is "no-discount"
  const baseDiscountType = product.attributes.discount_type;
  const baseDiscountValue = product.attributes.discount;

  const variantDiscountType = variant?.discountType;
  const variantDiscountValue = variant?.discount;

  let discountedPrice = productPrice;

  // Determine the effective discount type and value
  const discountType =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountType
      : baseDiscountType !== "no-discount"
      ? baseDiscountType
      : "no-discount";

  const discountValue =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountValue
      : baseDiscountType !== "no-discount"
      ? baseDiscountValue
      : 0;

  // Calculate the discounted price
  if (discountType === "fixed") {
    discountedPrice = productPrice - discountValue;
  } else if (discountType === "percentage") {
    discountedPrice = productPrice - (productPrice * discountValue) / 100;
  }

  // Ensure the price is non-negative and rounded to two decimal places
  return Math.max(0, discountedPrice).toFixed(2);
});

const isVariantPriceValid = computed(() => {
  const variantPrice = selectedVariant.value?.price ?? 0;
  const productPrice = product.attributes.price;
  return variantPrice <= productPrice;
});

const saveAmount = computed(() => {
  const variant = selectedVariant.value;
  const productPrice = variant?.price ?? product.attributes.price;

  // Check discount type and value for both variant and base product
  const baseDiscountType = product.attributes.discount_type;
  const baseDiscountValue = product.attributes.discount;

  const variantDiscountType = variant?.discountType;
  const variantDiscountValue = variant?.discount;

  // Determine the effective discount type and value
  const discountType =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountType
      : baseDiscountType !== "no-discount"
      ? baseDiscountType
      : "no-discount";

  const discountValue =
    variantDiscountType !== "no-discount" && variantDiscountType
      ? variantDiscountValue
      : baseDiscountType !== "no-discount"
      ? baseDiscountValue
      : 0;

  // Return 0 saved amount if no valid discount is applicable
  if (discountType === "no-discount" || !productPrice || discountValue === 0) {
    return 0;
  }

  // Calculate the saved amount based on discount type
  let savedAmount = 0;
  if (discountType === "fixed") {
    savedAmount = discountValue;
  } else if (discountType === "percentage") {
    savedAmount = (productPrice * discountValue) / 100;
  }

  // Round to 2 decimal places and ensure non-negative
  return Math.max(0, savedAmount).toFixed(2);
});

const toggle = (v) => {
  console.log("Toggle == ", v);
};

const tabs = ref(null);

const updateQueryParams = () => {
  const currentQuery = { ...route.query };

  currentQuery.variant = selectedVariant.value.id;
  currentQuery.size = selectedSize.value;

  router.replace({ query: currentQuery });

  console.log("currentQuery ", currentQuery);
};

watch([selectedVariant, selectedSize], () => {
  updateQueryParams();
});

const syncFiltersWithRoute = () => {
  const variantId = route.query.variant;
  const sizeIndex = route.query.size;

  if (!fetchedProduct.value?.productVariants?.length) return;

  // Find the variant from the fetched product
  const variant = fetchedProduct.value.productVariants
    .map((v) => ({
      id: v.id,
      colors: {
        name: v.colorName,
        value: v.colorValue,
      },
      sizes: v.sizes,
      price: v.price,
      discountType: v.discountType,
      discount: v.discount,
      stock: v.stock,
      images: v.images,
    }))
    .find((v) => v.id == variantId);

  if (variant) {
    onColorSelect(variant); // Select the variant
    selectedSize.value = sizeIndex ? parseInt(sizeIndex) : 0; // Set size if provided
  }
};

// Watch for product fetching completion
watch(
  () => fetchedProduct.value,
  (newProduct) => {
    if (newProduct && newProduct.productVariants?.length) {
      syncFiltersWithRoute();
    }
  },
  { immediate: true }
);

// Ensure it runs on mount
// onMounted(() => {
//   if (!isLoading.value) {
//     syncFiltersWithRoute();
//   }
// });

// Sync filters when the component is mounted
</script>

<template>
  <v-container max-width="1320">
    <v-row>
      <v-col class="px-0">
        <Breadcrumbs :productName="fetchedProduct?.name" />
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-progress-linear
        color="yellow-darken-2"
        indeterminate
      ></v-progress-linear>
    </v-row>

    <v-row v-else class="gap-8">
      <v-col cols="5" class="relative pa-0">
        <v-row no-gutters>
          <v-col class="flex flex-col">
            <v-img
              :width="500"
              :height="500"
              :src="
                selectedImg
                  ? `${apiBaseUrl}storage/${selectedImg}`
                  : `${apiBaseUrl}storage/${selectedVariant.images[0]}`
              "
              class="bg-gray-100"
            >
              <template v-slot:error>
                <v-img
                  class="mx-auto"
                  height="500"
                  max-width="500"
                  :src="orangeSufa"
                ></v-img>
              </template>
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </template>
            </v-img>
            <v-sheet max-width="600">
              <v-slide-group
                show-arrows
                center-active
                :next-icon="RadixIconsChevronRight"
                :prev-icon="RadixIconsChevronLeft"
                v-model="selectedImageIndex"
              >
                <v-slide-group-item
                  v-for="i in productImages"
                  :key="i"
                  v-slot="{ isSelected, toggle }"
                >
                  <v-img
                    @click="
                      () => {
                        changeImg(i);
                        toggle();
                      }
                    "
                    :class="selectedImg === i ? 'ring-2' : ''"
                    class="w-20 h-20 border border-red-700 p-3 my-3 mx-2 rounded cursor-pointer hover:ring ring-green-800"
                    :src="`${apiBaseUrl}storage/${i}`"
                    lazy-src="https://picsum.photos/200/300"
                    :alt="`product images ${i}`"
                  >
                    <template v-slot:placeholder>
                      <div
                        class="d-flex align-center justify-center fill-height"
                      >
                        <v-progress-circular
                          color="grey-lighten-4"
                          indeterminate
                        ></v-progress-circular>
                      </div>
                    </template>
                    <template v-slot:error>
                      <v-img
                        class="mx-auto"
                        height="300"
                        max-width="500"
                        src="https://picsum.photos/500/300"
                      ></v-img>
                    </template>
                  </v-img>
                </v-slide-group-item>
              </v-slide-group>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="pa-0">
        <v-row>
          <v-col class="space-y-2">
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

            <div class="flex flex-row items-center gap-2 mt-2">
              <h3
                v-if="
                  product.attributes.discount_type !== 'no-discount' ||
                  selectedVariant.discountType !== 'no-discount'
                "
                class="text-2xl text-decoration-line-through text-grey-darken-1"
              >
                ${{
                  selectedVariant.price > product.attributes.price
                    ? selectedVariant.price
                    : product.attributes.price
                }}
              </h3>

              <div>
                <v-badge
                  v-if="badgeContent"
                  :content="`Save ${badgeContent}`"
                  :offset-x="-15"
                  rounded="0"
                  color="warning"
                >
                  <h3 class="text-3xl font-weight-bold">
                    ${{ calculateDiscountedPrice }}
                  </h3>
                </v-badge>

                <!-- Show price without badge if no discount -->
                <h3 v-else class="text-3xl font-weight-bold">
                  ${{ calculateDiscountedPrice }}
                </h3>
              </div>
            </div>
            <p class="py-2 font-bold">
              Sold by:
              <RouterLink
                :to="`/stores/${product.attributes.vendor.store_name_slug}`"
                class="font-semibold text-blue hover:underline"
                >{{ product.attributes.vendor.store_name }}</RouterLink
              >
            </p>

            <h3 class="text-uppercase text-subtitle-2">
              Color: <strong>{{ selectedVariant.colors?.name }}</strong>
            </h3>

            <div class="flex items-center cursor-pointer">
              <div v-for="variant in variants" class="inline-flex">
                <v-tooltip :text="variant.colors.name" location="top">
                  <template v-slot:activator="{ props }">
                    <div
                      v-bind="props"
                      @click="onColorSelect(variant)"
                      :style="{ backgroundColor: variant.colors.value }"
                      :class="`w-7 h-5 bg-[${
                        variant.colors.value
                      }] block shadow-md rounded-sm mx-1 hover:ring ${
                        selectedVariant.id === variant.id
                          ? 'ring ring-violet-600'
                          : 'ring-gray-300'
                      } transition-all duration-200`"
                    />
                  </template>
                </v-tooltip>
              </div>
            </div>
            <v-btn-toggle
              class="my-3"
              color="primary"
              v-model="selectedSize"
              variant="outlined"
              divided
            >
              <v-btn
                v-for="size in selectedVariant.sizes"
                color="success"
                size="small"
                >{{ size }}
              </v-btn>
            </v-btn-toggle>

            <p>{{ selectedVariant.stock }} in stock</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="showCart" class="d-inline-flex align-center">
            <span class="mr-2">QTY</span>
            <CartButton
              :quantity="product.productQuantity"
              :on-quantity-change="onAddToCart"
            />
          </v-col>
          <v-col v-else cols="auto">
            <v-btn
              active-color="red"
              base-color="#000"
              disable-color="blue"
              :tile="true"
              elevation="0"
              density="comfortable"
              size="large"
              @click="onAddToCart(1)"
              :append-icon="
                StreamlineShoppingBagHandBag2ShoppingBagPurseGoodsItemProducts
              "
              :disabled="selectedSize === undefined"
            >
              <p class="text-xs font-semibold">Add to cart</p>
            </v-btn>
          </v-col>

          <v-col>
            <v-btn
              variant="outlined"
              :icon="RadixIconsHeart"
              class="text-red"
              size="small"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mt-10">
      <v-col>
        <v-tabs v-model="tabs" density="comfortable" align-tabs="center">
          <v-tab value="one">description</v-tab>
          <v-tab value="two">reviews</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tabs" class="py-8">
          <v-tabs-window-item value="one">
            <div>
              <p>{{ product.attributes.description }}</p>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-row class="gap-12">
              <v-col cols="6">
                <v-row align="center">
                  <v-col cols="3">
                    <p class="text-h2 font-weight-black">
                      {{ product.attributes.rating }}
                    </p>
                  </v-col>
                  <v-col>
                    <p class="ml-1">Average Rating</p>
                    <div class="flex items-center gap-3">
                      <v-rating
                        class="text-3xl"
                        half-increments
                        :length="5"
                        :model-value="product.attributes.rating"
                        active-color="#E3BF43"
                        color="#D0D0D0"
                        size="36"
                        readonly
                        :empty-icon="IcRoundStar"
                        :full-icon="IcRoundStar"
                      />
                      <p class="mt-2">
                        {{ product.attributes.product_reviews.length }} Ratings
                      </p>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-list
                    class="d-flex flex-column-reverse w-100"
                    density="compact"
                  >
                    <v-list-item v-for="(rating, i) in 5" :key="i" class="">
                      <template v-slot:prepend>
                        <div>
                          <v-rating
                            half-increments
                            :length="5"
                            :model-value="rating"
                            active-color="#E3BF43"
                            color="#D0D0D0"
                            size="22"
                            readonly
                            :empty-icon="IcRoundStar"
                            :full-icon="IcRoundStar"
                          />
                        </div>
                      </template>

                      <v-progress-linear
                        :model-value="rating * 15"
                        color="yellow-darken-3"
                        height="20"
                        rounded
                      ></v-progress-linear>

                      <template v-slot:append>
                        <div class="rating-values">
                          <span class="d-flex justify-end">
                            {{ rating * 224 }}
                          </span>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-row
                  v-for="(productReview, index) in product.attributes
                    .product_reviews"
                  :key="productReview.id"
                  class="gap-3"
                >
                  <v-col cols="1" class="align-self-start pa-0 mt-1">
                    <v-img
                      cover
                      height="80"
                      :src="`https://picsum.photos/id/${50 + index}/200/300`"
                    ></v-img>
                  </v-col>

                  <v-col class="py-0 ma-0">
                    <h4 class="text-lg font-semibold">
                      {{ productReview.user.first_name }}
                      {{ productReview.user.last_name }}
                    </h4>
                    <div class="flex gap-3">
                      <v-rating
                        half-increments
                        :length="5"
                        :model-value="productReview.rating"
                        active-color="#E3BF43"
                        color="#D0D0D0"
                        size="20"
                        readonly
                        :empty-icon="IcRoundStar"
                        :full-icon="IcRoundStar"
                      />
                      <p class="mt-1 font-semibold">
                        {{ productReview.rating }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-500">
                      Posted on {{ formatDateTime(productReview.created_at) }}
                    </p>
                    <p class="my-5">
                      {{ productReview.review }}
                    </p>
                  </v-col>

                  <v-col
                    v-if="index < product.attributes.product_reviews.length - 1"
                    cols="12"
                  >
                    <v-divider class="border-opacity-100 my-3"></v-divider>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>
  </v-container>
</template>
