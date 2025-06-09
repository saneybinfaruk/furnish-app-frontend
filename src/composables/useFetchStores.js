import axios from "axios";
import { ref, onMounted } from "vue";
import { apiBaseUrl } from "../utils/utils";
export const useFetchStores = () => {
  const fetchedStores = ref(null);
  const isLoading = ref(true);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}api/stores`);
      fetchedStores.value = response.data;
      console.log("fetch Stores:", fetchedStores.value);
    } catch (error) {
      console.error("Failed to fetch Stores:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Automatically fetch products when composable is used
  onMounted(fetchStores);

  // Return only isLoading and allProducts
  return {
    isLoading,
    fetchedStores,
  };
};
