<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from "vue";
import axios from "axios";
import IcTwotoneRadioButtonUnchecked from "~icons/ic/twotone-radio-button-unchecked";
import IcTwotoneRadioButtonChecked from "~icons/ic/twotone-radio-button-checked";
import MdiContentSaveAll from "~icons/mdi/content-save-all";
import DiscountOption from "./DiscountOption.vue";
import RadixIconsStarFilled from "~icons/radix-icons/star-filled";
import RadixIconsStar from "~icons/radix-icons/star";
import ProductVariantPanels from "./ProductVariantPanels.vue";
import { useFetchProduct } from "@/composables/useFetchProduct.js";
import TitleDescriptionInput from "@/components/dashboard/product/TitleDescriptionInput.vue";
import { useValidationRules } from "@/composables/useValidationRules.js";
import CategorySubCategorySelect from "@/components/dashboard/product/CategorySubCategorySelect.vue";
import RatingStar from "@/components/dashboard/product/RatingStar.vue";
import ColorOptionChoose from "@/components/dashboard/product/ColorOptionChoose.vue";
import { usePiniaStore } from "@/store/store";

const store = usePiniaStore();

const { fetchedProduct, isLoading } = useFetchProduct(
  store.dialog.selectedProductId
);
const {
  productVariants,
  clearProductVariants,
  addToProductVariants,
  resetProductVariants,
  resetProductVariantsToDefault,
} = store;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL + "storage/";
watch(fetchedProduct, (newVal) => {
  console.log("newVal in watch:", newVal);
  if (!newVal || Object.keys(newVal).length === 0) {
    console.error("newVal is undefined or empty");
    return;
  }

  store.product.name = newVal.name;
  store.product.description = newVal.description;
  store.product.price = newVal.price;
  store.product.discountType = newVal.discount_type;
  store.product.rating = newVal.rating;
  store.product.colorOption = newVal.color_option;
  store.product.discount = newVal.discount;
  store.product.category = newVal.category_id;
  store.product.subcategory = newVal.sub_category_id;

  if (newVal.productVariants && Array.isArray(newVal.productVariants)) {
    newVal.productVariants.forEach((variant) => {
      // variant.images = variant.images.map(image => `${apiBaseUrl}${image}`);
      addToProductVariants(variant); // Call addToProductVariants for each variant
    });
  }

  console.log("product =====> ", store.product);
});

// watch(
//     () => product.discountType,
//     (newValue, oldValue) => {
//       product.discount = 0;
//       product.discountType = newValue;
//
//       console.log("Selected discount price => ", product.discountType);
//     }
// );

const saveProduct = async () => {
  console.log("Product ", store.product);

  const formData = new FormData();

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

  formData.append("_method", "PATCH");

  // Add color variants
  productVariants.forEach((variant, index) => {
    console.log("Variant ==== ", variant);

    formData.append(`colorVariants[${index}][id]`, variant.id);
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

    variant.removedImages.forEach((image, imageIndex) => {
      formData.append(
        `colorVariants[${index}][removedImages][${imageIndex}]`,
        image
      );
    });
  });

  console.log("formData => ", formData);

  try {
    const response = await axios.post(
      `http://localhost:8000/api/products/${store.dialog.selectedProductId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      setSnackbar("green", response.data.message);
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
  timeout: 2000,
  color: "bg-green",
});
const setSnackbar = (color, message) => {
  snackbar.show = true;
  snackbar.color = color;
  snackbar.message = message;
};
const isValid = ref(true);

const submitForm = async (event) => {
  const { valid } = await event;

  if (valid) {
    await saveProduct();
  } else {
    setSnackbar("red", "Fill all required field!");
  }
};

// watch(
//   () => store.product.colorOption,
//   (n) => {
//     if(n === 'no-color') {
//       resetProductVariants();
//     } else {
//       productVariants.forEach((variant) => {
//       // variant.images = variant.images.map(image => `${apiBaseUrl}${image}`);
//       addToProductVariants(variant); // Call addToProductVariants for each variant
//     });

//     }

//   }
// );

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
</script>

<template>
  <v-progress-linear v-if="isLoading" model-value="20"></v-progress-linear>
  <v-form
    v-else
    validate-on="input"
    @submit.prevent="submitForm"
    v-model="isValid"
  >
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

          <v-sheet class="pa-7 border-thin rounded-lg">
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

              <ProductVariantPanels :variant-rules="variantRules" />
            </v-sheet>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="gap-4 px-10 pb-8 pt-2">
        <v-snackbar
          v-model="snackbar.show"
          :timeout="snackbar.timeout"
          :color="snackbar.color"
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

<style scoped></style>
