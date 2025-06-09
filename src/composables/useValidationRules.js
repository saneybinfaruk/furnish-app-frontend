import { ref } from "vue";

export const useValidationRules = () => {
  // Product rules
  const productNameRules = [
    (value) => !!value || "Product name is required.",
    (value) =>
      value?.length >= 3 || "Product name must be at least 3 characters.",
  ];

  const productDescriptionRules = [
    (value) => !!value || "Product description is required.",
    (value) =>
      value?.length >= 10 || "Description must be at least 10 characters.",
  ];

  const productPriceRules = [
    (value) => !!value || "Price is required.",
    (value) => value > 0 || "Price must be greater than 0.",
  ];

  // Category rules
  const categoryRules = [(value) => !!value || "Category is required."];

  const subcategoryRules = [(value) => !!value || "Subcategory is required."];

  // Radio group rules
  const colorOptionRules = [
    (value) => value !== null || "Please select a color option.", // Error message if no option is selected
  ];

  // Variant rules
  const variantRules = ref({
    stock: [(value) => value >= 0 || "Stock must be 0 or greater."],
    sizes: [(value) => value.length > 0 || "Select at least 1 size"],
    images: [(value) => value.length > 0 || "Select at least 1 image."],
  });

  

  // Return all the rules as an object
  return {
    productNameRules,
    productDescriptionRules,
    productPriceRules,
    categoryRules,
    subcategoryRules,
    colorOptionRules,
    variantRules, 
  };
};
