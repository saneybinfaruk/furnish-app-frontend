import axios from "axios";
import { ref, onMounted, watch } from "vue";

export const useFetchProducts = (filters) => {
  const fetchedData = ref({
    products: {
      data: [],
      links: [],
      current_page: 0,
      prev_page_url: "",
      next_page_url: "",
    },
    categories: [],
    subcategories: "",
    colors: [],
  });

  const isLoading = ref(true); // Set isLoading to true initially

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products", {
        params: filters,
        paramsSerializer: (params) => {
          console.log("PARAMS === ", params);

          return new URLSearchParams(params).toString();
        },
      });

      fetchedData.value = response.data;

      console.log("fetchedData.value ", fetchedData.value);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Automatically fetch products when composable is used
  onMounted(fetchProducts);

  watch(
    filters,
    () => {
      fetchProducts();
    },
    { deep: true }
  );

  // Return only isLoading and allProducts
  return {
    isLoading,
    fetchedData,
  };
};
