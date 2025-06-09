import {onMounted, ref, watch} from "vue";
import axios from "axios";

export const useFetchCategory = (productCategoryId, productSubCategoryId) => {
    const categories = ref([]);
    const subCategories = ref([]);
    const isLoading = ref(true);
    const fetchedData = ref([]);
    const productCategory = ref(productCategoryId);
    const productSubCategory = ref(productSubCategoryId);


    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/categories");
            fetchedData.value = response.data;

            categories.value = fetchedData.value.map((category) => ({
                categoryName: category.name,
                categoryId: category.id,
            }));

            if (productSubCategory.value) {
                setSubCategory(productCategory.value);
            }

            isLoading.value = false; // Set isLoading to false after data is fetched
        } catch (e) {
            console.log(e);
            isLoading.value = false; // Handle the error case
        }
    };

    watch(productCategory, (newValue) => {
            const selectedCategory = fetchedData.value.find((c) => c.id === newValue);
            if (selectedCategory) {
                subCategories.value = selectedCategory.subcategories.map(
                    (subcategory) => ({
                        subcategoryName: subcategory.name,
                        subcategoryId: subcategory.id,
                    })
                );
            } else {
                subCategories.value = [];
            }
        }
    );

    const setSubCategory = (categoryId) => {
        const selectedCategory = fetchedData.value.find((c) => c.id === categoryId);
        if (selectedCategory) {
            subCategories.value = selectedCategory.subcategories.map(
                (subcategory) => ({
                    subcategoryName: subcategory.name,
                    subcategoryId: subcategory.id,
                })
            );
        } else {
            subCategories.value = []; // Clear subcategories if no category is selected
        }
    }

    onMounted(fetchProducts);

    return {
        isLoading,
        categories,
        subCategories
    };
};
