<script setup>
import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
import MaterialSymbolsDeleteForever from "~icons/material-symbols/delete-forever";
import { onMounted, reactive, ref, watch, toRefs } from "vue";
import MaterialSymbolsLightAddPhotoAlternateRounded from "~icons/material-symbols-light/add-photo-alternate-rounded";
import DiscountOption from "./DiscountOption.vue";
import { debounce } from "@/utils/utils.js";
import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";
import { usePiniaStore } from "@/store/store";

const sizes = ["standard", "small", "medium", "large", "king", "extra large"];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const colorMode = ref("hexa");

const props = defineProps({
  colorVariant: Object,
  index: Number,
  variantRules: Object,
});

const variant = reactive({ ...props.colorVariant });
const draggedItemIndex = ref(null);
const store = usePiniaStore();
const {
  removeVariantFromList,
  updateVariantByIndex,
  productVariants,
  product,
} = store;

const imagePreviews = ref([]);
const imageFiles = ref(variant.images);

watch(
  () => props.colorVariant,
  (newValue) => {
    Object.assign(variant, newValue);

    console.log("newValue in colorVariant Component ", newValue);
    console.log("newValue in coloroption ", product.colorOption);
  },
  { deep: true }
);

const previewImages = () => {
  if (imageFiles.value && imageFiles.value.length) {
    imageFiles.value.forEach((file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreviews.value.push(e.target.result);
          variant.images.push(file);
        };
        reader.readAsDataURL(file); // Read file as a Data URL
      }
    });
  }
};

onMounted(() => {
  if (variant.images.length) {
    const initialFiles = [];
    variant.images.forEach((image) => {
      if (typeof image === "string") {
        imagePreviews.value.push(apiBaseUrl + "storage/" + image); // Add existing image URLs to previews

        const pseudoFile = new File([""], image.split("/").pop(), {
          type: "image/*",
        });
        initialFiles.push(pseudoFile);

        console.log("pseudoFile === ", pseudoFile);
      }
    });
    imageFiles.value = initialFiles;
  }

  console.log("Color opiton from color variant === ", product.colorOption);
});

const debouncedEmits = debounce((newValue) => {
  console.log("emits");

  updateVariantByIndex(props.index, newValue);
}, 300);

watch(variant, (newValue) => {
  debouncedEmits(newValue);
});

const handleDragStart = (index) => {
  draggedItemIndex.value = index; // Store the index of the dragged item
};

const handleDragEnter = (index) => {
  // Swap items in the preview list
  const draggedIndex = draggedItemIndex.value;
  if (draggedIndex !== index) {
    const previews = [...imagePreviews.value];
    const draggedItem = previews[draggedIndex];
    previews.splice(draggedIndex, 1); // Remove the dragged item
    previews.splice(index, 0, draggedItem); // Insert it at the new position
    imagePreviews.value = previews;
    draggedItemIndex.value = index; // Update the dragged item's index
  }
};

const handleDrop = () => {
  draggedItemIndex.value = null; // Clear the dragged item index
};

const handleDragEnd = () => {
  draggedItemIndex.value = null; // Clear the dragged item index
};

const removeImage = (index, image) => {
  imagePreviews.value = imagePreviews.value.filter((f, i) => i !== index);
  variant.images.splice(index, 1);

  if (typeof image === "string" && image.startsWith(apiBaseUrl)) {
    variant.removedImages.push(image.replace(apiBaseUrl + 'storage/', ""));
  }
  if (imagePreviews.value.length === 0) {
    imageFiles.value = [];
  }
};

const updateDiscount = ({ discountType, discount }) => {
  variant.discountType = discountType;
  variant.discount = discount;
};

const removeItem = (index) => {
  removeVariantFromList(index);
};
</script>

<template>
  <v-sheet>
    <div class="d-flex items-center bg-deep-purple-lighten-5">
      <v-expansion-panel-title>
        <div
          v-if="product.colorOption === 'color'"
          class="w-full d-flex align-center gap-2"
        >
          <div
            class="w-10 h-10 rounded-full elevation-1"
            :style="{ backgroundColor: variant.colorValue }"
          />
          <p>{{ variant.colorValue }}</p>
          <p v-if="variant.colorName">
            ({{
              variant.colorName.substring(0, 1).toUpperCase() +
              variant.colorName.substring(1)
            }})
          </p>
        </div>

        <div v-else class="w-full d-flex align-center gap-2 py-3">
          <p>No Color</p>
        </div>
      </v-expansion-panel-title>
      <v-btn
        v-if="
          productVariants.length > 1 && store.product.colorOption !== 'no-color'
        "
        @click="() => removeItem(index)"
        variant="text"
        :icon="MaterialSymbolsDeleteForever"
        size="small"
        color="red"
        class="ma-1"
      >
        <v-icon :icon="MaterialSymbolsDeleteForever" size="large" />
      </v-btn>
    </div>
    <v-expansion-panel-text>
      <v-row>
        <v-col>
          <v-sheet>
            <v-sheet v-if="product.colorOption === 'color'">
              <div>
                <v-color-picker
                  v-model="variant.colorValue"
                  v-model:mode="colorMode"
                />

                <v-select
                  v-model="colorMode"
                  :items="['hsla', 'rgba', 'hexa']"
                  style="max-width: 300px"
                  label="Color Mode"
                />
              </div>
              <v-text-field
                variant="outlined"
                label="Color name"
                v-model="variant.colorName"
              />
            </v-sheet>
            <v-combobox
              variant="outlined"
              :items="sizes"
              multiple
              chips
              v-model="variant.sizes"
              label="Sizes"
              :rules="variantRules.sizes"
              small-chips
              :false-icon="mdiCheckboxBlankOutline"
              :true-icon="mdiCheckboxMarked"
            >
            </v-combobox>

            <v-text-field
              v-if="product.colorOption === 'color'"
              variant="outlined"
              type="number"
              placeholder="Price"
              label="Price"
              v-model="variant.price"
            />

            <DiscountOption
              v-if="product.colorOption === 'color'"
              :discountType="variant.discountType"
              :discount="variant.discount"
              @update-discount="updateDiscount"
            />

            <v-text-field
              variant="outlined"
              type="number"
              placeholder="Stock"
              label="Stock"
              v-model="variant.stock"
              :rules="variantRules.stock"
              :value="variant.stock"
            />

            <div class="flex gap-4">
              <v-file-input
                multiple
                v-model="imageFiles"
                label="Upload Images"
                accept="image/*"
                variant="outlined"
                :prepend-icon="MaterialSymbolsLightAddPhotoAlternateRounded"
                @change="previewImages"
                :rules="variantRules.images"
                chips
              >
              </v-file-input>
            </div>
            <div class="flex gap-5 flex-wrap">
              <div
                v-for="(image, index) in imagePreviews"
                :key="index"
                class="border rounded-lg w-36 h-36"
                draggable="true"
                @dragstart="handleDragStart(index)"
                @dragenter="handleDragEnter(index)"
                @dragend="handleDragEnd"
                @dragover.prevent
                @drop="handleDrop"
              >
                <v-img
                  :src="image"
                  alt="Image Preview"
                  class="object-cover w-full h-full position-relative"
                >
                  <v-btn
                    :icon="MaterialSymbolsCloseRounded"
                    size="x-small"
                    class="rounded-full position-absolute right-1 top-1"
                    variant="flat"
                    @click="removeImage(index, image)"
                  />
                </v-img>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-sheet>
</template>

<style scoped></style>
