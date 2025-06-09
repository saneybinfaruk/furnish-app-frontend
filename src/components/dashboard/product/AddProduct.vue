<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, toRef, watch } from "vue";
import MdiContentSaveAll from "~icons/mdi/content-save-all";
import DiscountOption from "./DiscountOption.vue";
import ProductVariantPanels from "./ProductVariantPanels.vue";
import { usePiniaStore } from "@/store/store";
import TitleDescriptionInput from "@/components/dashboard/product/TitleDescriptionInput.vue";
import CategorySubCategorySelect from "@/components/dashboard/product/CategorySubCategorySelect.vue";
import RatingStar from "@/components/dashboard/product/RatingStar.vue";
import ColorOptionChoose from "@/components/dashboard/product/ColorOptionChoose.vue";
import { useValidationRules } from "@/composables/useValidationRules.js";
import axios from "axios";

const store = usePiniaStore();
const {
  productVariants,
  resetProductVariants,
  clearProductVariants,
  addToProductVariants,
  setProductProperty,
} = store;

watch(
  () => store.product.discountType,
  (newValue, oldValue) => {
    setProductProperty("discount", 0);

    // product.discount = 0;
    setProductProperty("discountType", newValue);

    // product.discountType = newValue;

    console.log("Selected discount price => ", store.product.discountType);
  }
);

const setSnackbar = (color, message) => {
  snackbar.show = true;
  snackbar.color = color;
  snackbar.message = message;
};
const saveProduct = async () => {
  const formData = new FormData();

  console.log("productVariants => ", productVariants);

  // Add basic fields
  formData.append("name", store.product.name);
  formData.append("description", store.product.description);
  formData.append("category", store.product.category);
  formData.append("subcategory", store.product.subcategory);
  formData.append("price", store.product.price);
  formData.append("rating", store.product.rating);
  formData.append("discount", store.product.discount);
  formData.append("discountType", store.product.discountType);
  formData.append("colorOption", store.product.colorOption);

  // Add color variants
  productVariants.forEach((variant, index) => {
    formData.append(`colorVariants[${index}][colorValue]`, variant.colorValue);
    formData.append(`colorVariants[${index}][colorName]`, variant.colorName);
    formData.append(
      `colorVariants[${index}][colorOption]`,
      variant.colorOption
    );

    formData.append(`colorVariants[${index}][price]`, variant.price);
    formData.append(`colorVariants[${index}][stock]`, variant.stock);
    formData.append(
      `colorVariants[${index}][discountType]`,
      variant.discountType
    );
    formData.append(`colorVariants[${index}][discount]`, variant.discount);

    // Add images for each color variant
    variant.images.forEach((file, fileIndex) => {
      formData.append(`colorVariants[${index}][images][${fileIndex}]`, file);
    });

    // Add sizes for each color variant
    variant.sizes.forEach((size, sizeIndex) => {
      formData.append(`colorVariants[${index}][sizes][${sizeIndex}]`, size);
    });
  });

  console.log("formData => ", formData);

  try {
    const response = await axios.post(
      "http://localhost:8000/api/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      setSnackbar("green", response.data.message);

      store.dialog.isVisible = false;
    } else {
      setSnackbar("red", response.data.message);
    }
  } catch (error) {
    setSnackbar("red", error);
  }
};

const colorVariantObj = (colorValue = "no-color") => {
  return {
    colorValue: colorValue,
    colorName: "",
    sizes: [],
    price: store.product.price,
    stock: 0,
    images: [],
    discountType: store.product.discountType,
    discount: store.product.discount,
    colorOption: store.product.colorOption,
  };
};
const addNewColorVariant = () => addToProductVariants(colorVariantObj("#000"));

const updateDiscount = ({ discountType, discount }) => {
  store.product.discountType = discountType;
  store.product.discount = discount;
};

watch(
  () => store.product.colorOption,
  (n) => {
    resetProductVariants();
  }
);

const {
  productNameRules,
  productDescriptionRules,
  productPriceRules,
  categoryRules,
  subcategoryRules,
  colorOptionRules,
  variantRules,
} = useValidationRules();

const snackbar = reactive({
  show: false,
  message: "",
  timeout: 1000,
  color: "bg-green",
});

const submitForm = async (event) => {
  const { valid } = await event;

  if (valid) {
    await saveProduct();
  } else {
    setSnackbar("red", "Fill all required field!");
  }

  console.log("product  ==> ", store.product);
  console.log("productVariants ==> ", productVariants);
};

onBeforeUnmount(() => {
  store.product = {
    name: "",
    description: "",
    category: null,
    subcategory: null,
    price: "",
    discountType: "no-discount",
    discount: null,
    rating: 4,
    colorOption: "color",
  };
  clearProductVariants();
});

onMounted(() => {
  clearProductVariants();

  console.log("Add Product ===> onMount == Product ", store.product);

  addToProductVariants(colorVariantObj("#000"));
});
</script>

<template>
  <v-form validate-on="input" @submit.prevent="submitForm">
    <v-container fluid>
      <v-row no-gutters class="gap-4">
        <v-col class="bg-white rounded-md px-6 py-2 space-y-9">
          <TitleDescriptionInput
            v-model:product-description="store.product.description"
            v-model:product-name="store.product.name"
            :product-name-rules="productNameRules"
            :product-description-rules="productDescriptionRules"
          />

          <CategorySubCategorySelect
            :category-rules="categoryRules"
            :sub-category-rules="subcategoryRules"
            v-model:product-category="store.product.category"
            v-model:product-sub-category="store.product.subcategory"
          />

          <v-sheet class="pa-7 border-thin rounded-lg space-y-4">
            <v-text-field
              variant="outlined"
              placeholder="Base price..."
              type="number"
              v-model="store.product.price"
              :rules="productPriceRules"
              label="Base price"
            />

            <DiscountOption
              :discountType="store.product.discountType"
              :discount="store.product.discount"
              @update-discount="updateDiscount"
            />

            <RatingStar v-model:product-rating="store.product.rating" />
          </v-sheet>

          <v-sheet>
            <h1 class="pb-2.5 font-semibold">Add Color Variant</h1>

            <v-sheet class="pa-7 border-thin rounded-lg">
              <ColorOptionChoose :color-option-rules="colorOptionRules" />

              <v-btn
                @click="addNewColorVariant"
                v-if="store.product.colorOption === 'color'"
                >Add Variant
              </v-btn>

              <p>{{ store.product.colorOption }}</p>

              <ProductVariantPanels :variant-rules="variantRules" />
            </v-sheet>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="gap-4 px-10 pb-8 pt-2">
        <v-snackbar
          v-model="snackbar.show"
          :timeout="snackbar.timeout"
          :color="`bg-${snackbar.color}`"
        >
          {{ snackbar.message }}
        </v-snackbar>
        <v-btn
          :prepend-icon="MdiContentSaveAll"
          type="submit"
          text="save changes"
        />
        <v-btn color="red-accent-2" text="cancel" />
      </v-row>
    </v-container>
  </v-form>
</template>
