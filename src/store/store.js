import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";

export const usePiniaStore = defineStore(
  "furnitureStore",
  () => {
    let cartList = ref([]);
    let selectedCartList = ref([]);

    let productVariants = reactive([]);

    let dialog = reactive({
      isVisible: false,
      selectedProductId: null,
      componentName: "",
    });

    let product = reactive({
      name: "",
      description: "",
      category: null,
      subcategory: null,
      price: "",
      discountType: "no-discount",
      discount: null,
      rating: 4,
      colorOption: "color",
      vendorId: null,
    });

    const setProductProperty = (property, value) => {
      if (property in product) {
        product[property] = value;
        console.log(`Product property '${property}' set to:`, value);
      } else {
        console.warn(`Property '${property}' does not exist on product.`);
      }
    };

    let productVariantsOriginalLength;

    const resetProductVariants = () => {
      productVariantsOriginalLength = productVariants;
      productVariants.length = 1;
    };

    const resetProductVariantsToDefault = () => {
      console.log(productVariantsOriginalLength);

      productVariants = productVariantsOriginalLength;
      productVariants.length = productVariantsOriginalLength.length;
    };

    const clearProductVariants = () => {
      productVariants.length = 0;

      console.log("Clearing Product ", product);
    };

    const addToProductVariants = (productVariant) => {
      productVariants.push({
        ...productVariant,
        id: productVariant.id ? productVariant.id : Date.now(),
        price: productVariant.price ? productVariant.price : "",
        colorName: productVariant.colorName ? productVariant.colorName : "",
        discount: productVariant.discount ? productVariant.discount : "",

        removedImages: [],
      });

      console.log("Product Variants ===> ", productVariants);
    };

    const removeVariantFromList = (index) => {
      console.log(`Removed variant : ${productVariants[index].id}`);

      productVariants.splice(index, 1);

      console.log(`Removed variant at index: ${index}`);
    };

    const updateVariantByIndex = (index, updatedVariant) => {
      // Update the variant at the given index
      productVariants[index] = { ...updatedVariant };
      console.log("Updated variant at index:", index);
      console.log("Updated variant ", productVariants[index]);
    };

    const addToCart = (cartProduct, quantity) => {
      console.log("CartProduct ", cartProduct);

      const item = cartList.value.find(
        (fromCartProduct) =>
          fromCartProduct.productId === cartProduct.productId &&
          fromCartProduct.colorName === cartProduct.colorName &&
          fromCartProduct.colorValue === cartProduct.colorValue &&
          fromCartProduct.size === cartProduct.size
      );

      if (item) {
        console.log("item already exist!");
        item.quantity += quantity;

        console.log(item);
      } else {
        cartList.value.push(cartProduct);
      }
    };

    const addToSelectedCartList = (cartProduct) => {
      const itemIndex = selectedCartList.value.findIndex(
        (fromCartProduct) =>
          fromCartProduct.productId === cartProduct.productId &&
          fromCartProduct.colorName === cartProduct.colorName &&
          fromCartProduct.colorValue === cartProduct.colorValue &&
          fromCartProduct.size === cartProduct.size
      );

      if (itemIndex >= 0) {
        console.log("item already exist! == ", itemIndex);
        selectedCartList.value.splice(itemIndex, 1);
      } else {
        selectedCartList.value.push(cartProduct);
      }
    };

    const removeFromCart = (productId, colorName, colorValue, size) => {
      const itemIndex = cartList.value.findIndex(
        (fromCartProduct) =>
          fromCartProduct.productId === productId &&
          fromCartProduct.colorName === colorName &&
          fromCartProduct.colorValue === colorValue &&
          fromCartProduct.size === size
      );

      if (itemIndex >= 0) {
        cartList.value.splice(itemIndex, 1);
      }

      const selecledCartItemIndex = selectedCartList.value.findIndex(
        (fromCartProduct) =>
          fromCartProduct.productId === productId &&
          fromCartProduct.colorName === colorName &&
          fromCartProduct.colorValue === colorValue &&
          fromCartProduct.size === size
      );

      if (selecledCartItemIndex >= 0) {
        selectedCartList.value.splice(selecledCartItemIndex, 1);
      }
    };

    const clearCartList = () => {};

    return {
      cartList,
      addToCart,
      productVariants,
      addToProductVariants,
      resetProductVariants,
      resetProductVariantsToDefault,
      clearProductVariants,
      removeVariantFromList,
      updateVariantByIndex,
      setProductProperty,
      removeFromCart,
      product,
      dialog,
      addToSelectedCartList,
      selectedCartList,
    };
  },
  {
    persist: {
      pick: ["cartList", "selectedCartList"], // Persist both `cartList` and `user`
      key: "furnitureStore",
      beforeHydrate(context) {
        const storedState = localStorage.getItem("furnitureStore");
        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);
            context.store.cartList = parsedState.cartList || [];
          } catch (e) {
            console.error("Error deserializing state:", e);
          }
        }
      },
      afterHydrate(context) {
        try {
          const stateToPersist = {
            cartList: context.store.cartList,
          };
          localStorage.setItem(
            "furnitureStore",
            JSON.stringify(stateToPersist)
          );
        } catch (e) {
          console.error("Error serializing state:", e);
        }
      },
      debug: true,
    },
  }
);

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = reactive({
      firstName: null,
      lastName: null,
      email: null,
      role: null,
      token: null,
    });

    const isAuthenticated = ref(user.token);

    const login = (firstName, lastName, email,role, token) => {
      isAuthenticated.value = true;

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.role = role;
      user.token = token;

      console.log(" From User Auth Login === ", user);
    };

    const logout = () => {
      isAuthenticated.value = false;

      user.firstName = null;
      user.lastName = null;
      user.email = null;
      user.role = null;
      user.token = null;
    };

    return { isAuthenticated, user, login, logout };
  },
  {
    persist: {
      pick: ["user"], // Persist `user`
      key: "auth",
      beforeHydrate(context) {
        const storedState = localStorage.getItem("auth");
        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);

            Object.assign(context.store.user, parsedState.user || {});
          } catch (e) {
            console.error("Error deserializing state:", e);
          }
        }
      },
      afterHydrate(context) {
        try {
          const stateToPersist = {
            user: context.store.user,
          };
          localStorage.setItem("auth", JSON.stringify(stateToPersist));
        } catch (e) {
          console.error("Error serializing state:", e);
        }
      },
      debug: true,
    },
  }
);
