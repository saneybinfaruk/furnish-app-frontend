<script setup lang="ts">
import axios from "axios";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import RadixIconsStarFilled from "~icons/radix-icons/star-filled";
import RadixIconsStar from "~icons/radix-icons/star";
import orangeSufa from "../assets/fatty_sofa.png";
import IcBaselineFavoriteBorder from "~icons/ic/baseline-favorite-border";
import MaterialSymbolsKeyboardArrowUpRounded from "~icons/material-symbols/keyboard-arrow-up-rounded";
import MaterialSymbolsKeyboardArrowDownRounded from "~icons/material-symbols/keyboard-arrow-down-rounded";
import MaterialSymbolsCheckBoxOutlineBlankSharp from "~icons/material-symbols/check-box-outline-blank-sharp";
import MaterialSymbolsCheckBoxSharp from "~icons/material-symbols/check-box-sharp";
import MaterialSymbolsLightArrowDropUpRounded from "~icons/material-symbols-light/arrow-drop-up-rounded";
import MaterialSymbolsLightArrowDropDownRounded from "~icons/material-symbols-light/arrow-drop-down-rounded";
import IcRoundCancel from "~icons/ic/round-cancel";
import LineMdClose from "~icons/line-md/close";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import { useFetchProducts } from "../composables/useFetchProducts";
import { debounce } from "../utils/utils";

interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

interface Color {
  color_name: string;
  color_value: string;
}

// const filterModes = ["New", "Highest Price", "Lowest Price"];
const filterModes = [
  { label: "New", value: "new" },
  { label: "Highest Price", value: "price_desc" },
  { label: "Lowest Price", value: "price_asc" },
];
const priceRange = ref([0, 1000]);

// Define state variables

const filters = reactive<{
  subcategory: string[];
  sortBy: string;
  page: number;
  current_page: number;
  colors: string[];
  minPrice: number;
  maxPrice: number;
}>({
  subcategory: [],
  page: 1,
  current_page: 1,
  sortBy: null,
  colors: [],
  minPrice: 0,
  maxPrice: 1000,
});

const { fetchedData, isLoading } = useFetchProducts(filters);

const router = useRouter();
const route = useRoute();

const updateURL = () => {
  const queryParams: Record<string, any> = { subcategory: filters.subcategory };

  // Convert subcategory array into repeated query parameters
  if (filters.subcategory.length > 0) {
    queryParams.subcategory = filters.subcategory;
  }

  router.push({ query: queryParams });
};

const filterBySubCategory = (subcategory: string) => {
  const foundIndex = filters.subcategory.findIndex((s) => s === subcategory);

  if (foundIndex !== -1) {
    console.log("item already exist in index => ", foundIndex);
    filters.subcategory.splice(foundIndex, 1);
    // router.push({
    //   query: { ...router.query, subcategory: [filters.subcategory] },
    // });
    console.log("Removed!");
  } else {
    filters.subcategory.push(subcategory);
  }
  router.replace({
    query: {
      ...route.query,
      subcategory: filters.subcategory,
    },
  });
  console.log(filters.subcategory);

  // updateURL();
  // fetchProducts();
};

const filterByColors = (color: Color) => {
  const index = filters.colors.findIndex(
    (c: Color) => c.color_name === color.color_name
  );

  if (index !== -1) {
    console.log("Item already exists at index =>", index);
    filters.colors.splice(index, 1);
    console.log("Removed!");
  } else {
    filters.colors.push(color);
  }

  router.replace({
    query: { ...route.query, colors: filters.colors.map((c) => c.color_name) },
  });

  console.log(filters.colors);
};

// Compute selected colors for checkboxes
const isColorSelected = (colorName: string) => {
  return filters.colors.some((c: Color) => c.color_name === colorName);
};

const handleFavorite = (event: any) => {
  event.stopPropagation();
  console.log("Favorite clicked");
};

const panels = ref({
  pricePanel: [],
  categoryPanel: [],
  innerCategoryPanel: [],
  colorPanel: [],
});

const openAllPanel = ref(false);

const togglePanels = () => {
  openAllPanel.value = !openAllPanel.value;

  if (openAllPanel.value) {
    panels.value.pricePanel = [0];
    panels.value.categoryPanel = [0];
    panels.value.colorPanel = [0];
  } else {
    panels.value.pricePanel = [];
    panels.value.categoryPanel = [];
    panels.value.colorPanel = [];
  }
};

const changePage = (pageNumber: number) => {
  filters.page = Number(filters.page) + pageNumber;

  router.push({
    query: {
      ...route.query,
      page: filters.page,
    },
  });

  console.log("Query ==== ", filters.page);
};

const changePrice = () => {
  filters.minPrice = priceRange.value[0];
  filters.maxPrice = priceRange.value[1];
};

// Function to sync URL query with filters.subcategory
const syncFiltersWithRoute = () => {
  const subcategoryQuery = route.query.subcategory;
  const sortBy = route.query.sortBy;
  const colors = route.query.colors;
  const page = route.query.page;
  priceRange.value[0] = route.query.minPrice ?? 0;
  priceRange.value[1] = route.query.maxPrice ?? 1000;

  if (typeof subcategoryQuery === "string") {
    console.log("subcategoryQuery === ", subcategoryQuery.split(","));
  }

  // If subcategory is present, update filters.subcategory
  if (subcategoryQuery) {
    filters.subcategory = Array.isArray(subcategoryQuery)
      ? subcategoryQuery
      : subcategoryQuery.split(",");
    console.log("subcategoryQuery === ", subcategoryQuery.split(","));

    if (filters.subcategory.length > 0) {
      // Always open outer category panel
      // Find all category indices that contain at least one selected subcategory
      const matchedCategoryIndices = fetchedData.value.categories
        .map((category, index) => ({
          index,
          hasMatch: category.subcategories.some((sub: { slug: string }) =>
            filters.subcategory.includes(sub.slug)
          ),
        }))
        .filter((item) => item.hasMatch)
        .map((item) => item.index);

      // Always open outer category panel
      panels.value.categoryPanel = [0];

      // Open all matching inner panels
      panels.value.innerCategoryPanel = matchedCategoryIndices;
    } else {
      panels.value.categoryPanel = [];
      panels.value.innerCategoryPanel = [];
    }
  }

  if (sortBy) {
    filters.sortBy = sortBy;

    console.log("filters === ", filters);
  }

  if (colors) {
    const colorArray = Array.isArray(colors) ? colors : colors.split(",");
    const formattedColors = colorArray.map((color) => {
      const [color_name, color_value] = color.split("-");
      return { color_name: color_name.replace(/\+/g, " "), color_value };
    });

    filters.colors = formattedColors;
    console.log("Color Name ", formattedColors);

    panels.value.colorPanel = [0];
  }

  if (page) {
    filters.page = page;
  }
};

watch(
  () => isLoading.value,
  (newfetchedData) => {
    syncFiltersWithRoute();
  }
);

// Watch for query changes and update filters.subcategory
// watch(() => route.query, syncFiltersWithRoute, { immediate: true });

const updateQueryParams = () => {
  const currentQuery = { ...route.query };

  // Update only the price range query parameters
  currentQuery.minPrice = priceRange.value[0];
  currentQuery.maxPrice = priceRange.value[1];

  currentQuery.page = filters.page;

  if (filters.subcategory.length > 0) {
    currentQuery.subcategory = filters.subcategory.join(",");
  } else {
    delete currentQuery.subcategory; // Remove the parameter from the query
  }

  if (filters.sortBy) {
    currentQuery.sortBy = filters.sortBy;
  } else {
    delete currentQuery.sortBy;
  }

  if (filters.colors.length > 0) {
    currentQuery.colors = filters.colors
      .map((c: Color) => {
        return `${c.color_name}-${c.color_value}`;
      })
      .join(",");
  } else {
    delete currentQuery.colors; // Remove the parameter from the query
  }

  // Navigate with shallow routing to prevent page reload
  router.replace({ query: currentQuery });
  debouncedChangePrice();

  console.log("currentQuery ", currentQuery);
};
const debouncedChangePrice = debounce(changePrice, 1000);
watch([priceRange, filters], () => {
  updateQueryParams();
});

const getSubcategoryBySlug = (slug: string) => {
  for (const category of fetchedData.value.categories) {
    const found = category.subcategories.find((sub) => sub.slug === slug);
    if (found) return found.name;
  }
  return slug;
};

// watch(
//   () => filters.subcategory,
//   (newSubcategories) => {
//     if (newSubcategories.length > 0) {
//       // Always open outer category panel
//       panels.value.categoryPanel = [0];

//       // Find index of category that has any selected subcategory
//       const foundCategoryIndex = fetchedData.value.categories.findIndex(
//         (category) =>
//           category.subcategories.some((sub: { name: string; slug: string }) =>
//             newSubcategories.includes(sub.slug)
//           )
//       );

//       console.log("foundCategoryIndex === ", fetchedData.value.categories);

//       if (foundCategoryIndex !== -1) {
//         panels.value.innerCategoryPanel = [foundCategoryIndex];
//       } else {
//         panels.value.innerCategoryPanel = [];
//       }
//     } else {
//       panels.value.categoryPanel = [];
//       panels.value.innerCategoryPanel = [];
//     }
//   },
//   { immediate: true }
// );
</script>

<template>
  <v-container max-width="1120">
    <v-row v-if="isLoading">
      <v-progress-linear
        color="yellow-darken-2"
        indeterminate
      ></v-progress-linear>
    </v-row>

    <v-row v-else>
      <v-col>
        <v-row>
          <v-col class="d-flex align-center gap-16">
            <Breadcrumbs />
          </v-col>
          <v-col cols="7" class="d-flex items-center justify-end space-x-2">
            <p class="mr-4">Sort by:</p>
            <v-btn
              v-for="filterMode in filterModes"
              class="text-none"
              tile
              variant="tonal"
              :color="
                filters.sortBy === filterMode.value
                  ? 'warning'
                  : 'grey-darken-1'
              "
              @click="filters.sortBy = filterMode.value"
              >{{ filterMode.label }}</v-btn
            >

            <p class="font-semibold text-md text-gray-500 ml-10">
              {{ fetchedData.total }} results
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <v-row>
              <v-col class="space-y-4">
                <div class="flex justify-between items-center">
                  <p class="uppercase font-bold">filter</p>
                  <v-btn
                    variant="text"
                    slim
                    tile
                    size="small"
                    class="text-none"
                    @click="togglePanels"
                    >{{
                      openAllPanel ? "Close All Tabs" : "Open All Tabs"
                    }}</v-btn
                  >
                </div>

                <v-expansion-panels
                  flat
                  tile
                  class="border"
                  v-model="panels.categoryPanel"
                >
                  <v-expansion-panel
                    :collapse-icon="MaterialSymbolsKeyboardArrowUpRounded"
                    :expand-icon="MaterialSymbolsKeyboardArrowDownRounded"
                  >
                    <v-expansion-panel-title class="font-weight-bold uppercase"
                      >category</v-expansion-panel-title
                    >
                    <v-expansion-panel-text>
                      <v-expansion-panels
                        flat
                        tile
                        multiple
                        v-model="panels.innerCategoryPanel"
                      >
                        <v-expansion-panel
                          v-for="category in fetchedData.categories"
                          :key="category.slug"
                          :collapse-icon="
                            MaterialSymbolsLightArrowDropUpRounded
                          "
                          :expand-icon="
                            MaterialSymbolsLightArrowDropDownRounded
                          "
                        >
                          <v-expansion-panel-title
                            class="font-weight-bold text-body-2"
                            >{{ category.name }}</v-expansion-panel-title
                          >

                          <v-expansion-panel-text>
                            <v-checkbox
                              v-for="subcategory in category.subcategories"
                              class="d-flex"
                              density="compact"
                              @click="filterBySubCategory(subcategory.slug)"
                              :false-icon="
                                MaterialSymbolsCheckBoxOutlineBlankSharp
                              "
                              :true-icon="MaterialSymbolsCheckBoxSharp"
                              :model-value="
                                filters.subcategory.includes(subcategory.slug)
                              "
                              ><template v-slot:label>
                                <p class="text-sm text-grey-900">
                                  {{ subcategory.name }}
                                </p>
                              </template></v-checkbox
                            >
                          </v-expansion-panel-text>
                        </v-expansion-panel></v-expansion-panels
                      >
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels
                  flat
                  tile
                  class="border"
                  v-model="panels.pricePanel"
                >
                  <v-expansion-panel
                    :collapse-icon="MaterialSymbolsKeyboardArrowUpRounded"
                    :expand-icon="MaterialSymbolsKeyboardArrowDownRounded"
                  >
                    <v-expansion-panel-title class="font-weight-bold uppercase"
                      >price</v-expansion-panel-title
                    >
                    <v-expansion-panel-text>
                      <v-range-slider
                        v-model="priceRange"
                        density="comfortable"
                        thumb-size="12"
                        track-size="2"
                        :step="1"
                        thumb-label="true"
                        :min="0"
                        :max="1000"
                      ></v-range-slider>
                      <p class="border py-1 px-4 rounded-md text-center">
                        ${{ priceRange[0] }} - ${{ priceRange[1] }}
                      </p>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-expansion-panels
                  flat
                  tile
                  class="border"
                  v-model="panels.colorPanel"
                >
                  <v-expansion-panel
                    :collapse-icon="MaterialSymbolsKeyboardArrowUpRounded"
                    :expand-icon="MaterialSymbolsKeyboardArrowDownRounded"
                  >
                    <v-expansion-panel-title class="font-weight-bold uppercase"
                      >color</v-expansion-panel-title
                    >
                    <v-expansion-panel-text>
                      <v-checkbox
                        v-for="color in fetchedData.colors"
                        :key="color.color_value"
                        class="my-1 d-flex"
                        density="compact"
                        :false-icon="MaterialSymbolsCheckBoxOutlineBlankSharp"
                        :true-icon="MaterialSymbolsCheckBoxSharp"
                        @click="filterByColors(color)"
                        :model-value="isColorSelected(color.color_name)"
                      >
                        <template #label>
                          <div class="flex items-center gap-2 ml-2">
                            <v-sheet
                              :color="color.color_value"
                              width="20"
                              height="20"
                              elevation="3"
                              rounded="circle"
                              border
                            />
                            <p class="text-black text-sm">
                              {{ color.color_name }}
                            </p>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="9">
            <v-row>
              <v-col>
                <v-sheet
                  class="pa-5"
                  v-show="
                    filters.subcategory.length > 0 || filters.colors.length > 0
                  "
                  border
                >
                  <v-row align="center">
                    <v-col>
                      <v-row
                        dense
                        align="center"
                        v-show="filters.subcategory.length > 0"
                      >
                        <v-col cols="auto text-sm"
                          >Filter by <strong>categories:</strong></v-col
                        >
                        <v-col>
                          <v-chip
                            v-for="subcategory in filters.subcategory"
                            :key="subcategory"
                            class="ma-1"
                            closable
                            density="comfortable"
                            variant="tonal"
                            tile
                            @click:close="filterBySubCategory(subcategory)"
                          >
                            <p class="px-1 font-semibold text-grey-darken-3">
                              {{ getSubcategoryBySlug(subcategory) }}
                            </p>
                            <template v-slot:close>
                              <v-icon
                                :icon="IcRoundCancel"
                                color="grey-darken-1"
                              ></v-icon> </template
                          ></v-chip>
                        </v-col>
                      </v-row>

                      <v-row
                        dense
                        align="center"
                        v-show="filters.colors.length > 0"
                      >
                        <v-col cols="auto text-sm"
                          >Filter by <strong>colors:</strong></v-col
                        >
                        <v-col>
                          <v-chip
                            v-for="(color, index) in filters.colors"
                            :key="color.color_name + index"
                            class="ma-1"
                            closable
                            density="comfortable"
                            variant="tonal"
                            tile
                            @click:close="filterByColors(color)"
                          >
                            <div class="flex items-center gap-1">
                              <v-sheet
                                :color="color.color_value"
                                width="18"
                                height="18"
                                elevation="1"
                                rounded="circle"
                                border
                              />
                              <p class="px-1 font-semibold text-grey-darken-3">
                                {{ color.color_name }}
                              </p>
                            </div>

                            <template v-slot:close>
                              <v-icon
                                :icon="IcRoundCancel"
                                color="grey-darken-1"
                              ></v-icon> </template
                          ></v-chip>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="auto">
                      <v-btn
                        :append-icon="LineMdClose"
                        variant="tonal"
                        color="error"
                        @click="
                          () => {
                            filters.subcategory = [];
                            filters.colors = [];
                          }
                        "
                        size="small"
                        >clear</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row justify="center" class="my-0">
              <v-col
                class="!min-w-[230px] ma-0"
                v-for="(product, index) in fetchedData.products.data"
              >
                <v-sheet>
                  <v-img
                    height="360"
                    :src="orangeSufa"
                    color="grey-lighten-3"
                    class="position-relative"
                    role="button"
                    @click="router.push(`/products/${product.slug}`)"
                  >
                    <p class="bg-red w-fit px-3 absolute left-0 text-sm py-1">
                      33%
                    </p>
                    <div class="w-fit absolute right-0 text-sm">
                      <v-btn
                        :icon="IcBaselineFavoriteBorder"
                        size="x-small"
                        variant="flat"
                        class="ma-1"
                        @click="handleFavorite"
                      >
                      </v-btn>
                    </div>
                  </v-img>

                  <div class="space-y-2 p-4">
                    <div class="flex items-center gap-2">
                      <v-rating
                        :empty-icon="RadixIconsStar"
                        :full-icon="RadixIconsStarFilled"
                        readonly
                        :length="5"
                        color="orange"
                        :model-value="3"
                        density="0"
                        half-increament
                        size="small"
                      ></v-rating>
                      <p class="text-xs text-gray-400">(2 reviews)</p>
                    </div>
                    <h5 class="text-sm font-semibold">
                      {{ product.category.name }} ///
                      {{ product.sub_category.name }}
                    </h5>
                    <div class="flex gap-3 items-center">
                      <p class="text-md text-gray-600">${{ product.price }}</p>
                    </div>
                    <div
                      class="flex ga-1 whitespace-nowrap break-keep flex-wrap items-center"
                    >
                      <p>by</p>
                      <RouterLink
                        :to="`stores/${product.vendor.store_name}`"
                        class="hover:underline"
                      >
                        <p>{{ product.vendor.store_name }}</p>
                      </RouterLink>
                      <p>in</p>
                      <RouterLink to="" class="hover:underline">
                        <p>{{ product.sub_category.name }}</p>
                      </RouterLink>
                    </div>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <v-row align="center" justify="center" class="py-5">
              <v-btn
                variant="outlined"
                @click="changePage(-1)"
                :disabled="!fetchedData.products.prev_page_url"
                >prev</v-btn
              >
              <p class="px-3 py-1 font-semibold text-md mx-2 rounded-full">
                {{ fetchedData.products.current_page }}
              </p>
              <v-btn
                variant="outlined"
                @click="changePage(1)"
                :disabled="!fetchedData.products.next_page_url"
                >Next</v-btn
              >

              <!--            <p class="mx-2 cursor-pointer" :class="link.active ? 'font-bold bg-red-300 px-2 rounded-full bg-opacity-30' : '' ">fff</p>-->
              <!--            <div v-for="link in fetchedData.products.links" :key="link.label" class="flex gap-4"  >-->
              <!--              <p @click="filters.current_page++" v-html="link.label" class="mx-2 cursor-pointer" :class="link.active ? 'font-bold bg-red-300 px-2 rounded-full bg-opacity-30' : '' "></p>-->
              <!--            </div>-->
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
