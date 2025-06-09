import axios from "axios";
import { ref, onMounted } from "vue";
import { apiBaseUrl } from "../utils/utils";
export const useFetchProduct = (id) => {
  const fetchedProduct = ref(null);
  const isLoading = ref(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}api/products/${id}`);
      fetchedProduct.value = response.data;
      console.log("fetch products:", fetchedProduct.value);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Automatically fetch products when composable is used
  onMounted(fetchProducts);

  // Return only isLoading and allProducts
  return {
    isLoading,
    fetchedProduct,
  };
};
