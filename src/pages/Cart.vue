<script setup>
import {usePiniaStore} from "../store/store.ts";
import CartButton from "../components/CartButton.vue";
import LineMdClose from "~icons/line-md/close";
import {loadStripe} from "@stripe/stripe-js";
import CartProduct from "../components/CartProduct.vue";
import {computed} from "vue";

const {cartList} = usePiniaStore();

// Create a computed property for the total price
const totalPrice = computed(() => {
  return cartList
      .reduce((total, product) => total + product.quantity * product.price, 0)
      .toFixed(2);
});


const onPaymentClick = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/make-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: cartList,
      }),
    });

    if (!response.ok) throw new Error("Failed to create checkout session.");

    const {clientSecret, publishableKey} = await response.json();
    const stripe = await loadStripe(publishableKey);

    await stripe.redirectToCheckout({sessionId: clientSecret});
  } catch (error) {
  }
};

</script>

<template>
  <h2 class="">Your Cart (4 items)</h2>

  <v-container>

    <v-row v-for="cartItem in cartList" >
      <CartProduct class="my-1" :name="cartItem.name"
                   :img-url="cartItem.img_url"
                   :color="cartItem.color"
                   :size="cartItem.size"
                   :price="cartItem.price"
                   :quantity="cartItem.quantity"/>
    </v-row>


    <v-row class="flex justify-end">
      <v-col cols="4" class="flex flex-col">
        <div class="flex justify-between">
          <p>Subtotal</p>
          <p>$1019</p>
        </div>
        <v-divider class="border-opacity-100 my-3"></v-divider>
        <div class="flex justify-between">
          <p>Shipping</p>
          <p>$10</p>
        </div>
        <v-divider class="border-opacity-100 my-3"></v-divider>
        <div class="flex justify-between">
          <p>Total</p>
          <p>
            ${{totalPrice}}
          </p>
        </div>

        <v-btn
            text="checkout"
            class="my-2"
            variant="outlined"
            @click="onPaymentClick"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
