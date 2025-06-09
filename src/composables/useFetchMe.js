import axios from "axios";
import { ref, onMounted } from "vue";
import { apiBaseUrl } from "../utils/utils";

export const useFetchMe = (token) => {
  const fetchedStore = ref(null);
  const isLoading = ref(true);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchedStore.value = await response.data;
      console.log("fetch Stores:", fetchedStore.value);
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
    fetchedStore,
  };
};
