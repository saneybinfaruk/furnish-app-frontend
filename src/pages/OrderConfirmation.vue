<script setup></script>
<template>
  <v-container max-width="1120">
    <v-row>
      <v-col align-self="center">
        <v-row>
          <v-col>
            <h1 class="text-4xl font-bold">Thank you for your purchase! 🎉</h1>
            <p class="text-sm py-6">
              Your order is now being processed, and you’ll receive another
              update when it has been shipped.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12"><p class="font-bold">Billing address</p></v-col>
          <v-col class="text-sm">
            <v-row dense>
              <v-col cols="3" class="font-bold">Name</v-col>
              <v-col>Jane Smith</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3" class="font-bold">Address</v-col>
              <v-col>456 Oak st #4, San Francisco, CA 45694, USA</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3" class="font-bold">Phone</v-col>
              <v-col>+1(415) 555-1234</v-col>
            </v-row>
            <v-row dense>
              <v-col cols="3" class="font-bold">Email</v-col>
              <v-col>Boga@gmail.com</v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="my-6">
          <v-col>
            <v-btn
              class="text-none px-10"
              rounded
              color="red-accent-2"
              size="large"
              variant="flat"
              to="/profile/my-orders"
              >Track Your Order</v-btn
            >
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-sheet class="pa-6" rounded elevation="1">
          <v-row>
            <v-col>
              <v-row>
                <v-col class="text-xl font-bold py-6">Order Summary</v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0 pb-4">
                  <v-divider
                    :thickness="2"
                    color="success"
                    opacity="80"
                  ></v-divider
                ></v-col>
              </v-row>

              <v-row class="gap-4 text-sm" justify="space-between">
                <v-col class="text-gray-500 text-start">
                  <p>Date</p>
                  <p class="text-black font-semibold">02 May 2023</p>
                </v-col>

                <v-divider
                  :thickness="2"
                  color="success"
                  opacity="80"
                  vertical
                  inset
                ></v-divider>

                <v-col class="text-gray-500 text-start">
                  <p>Order Number</p>
                  <p class="text-black font-semibold">024-598725698</p>
                </v-col>

                <v-divider
                  :thickness="2"
                  color="success"
                  opacity="80"
                  vertical
                  inset
                ></v-divider>

                <v-col class="text-gray-500 text-start">
                  <p>Payment Method</p>
                  <p class="text-black font-semibold">Stripe</p>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="py-4">
                  <v-divider
                    :thickness="2"
                    color="success"
                    opacity="80"
                    class="border-dashed"
                  ></v-divider
                ></v-col>
              </v-row>

              <v-row v-for="cartItem in 3" class="ma-1">
                <v-col cols="7">
                  <v-row>
                    <v-col cols="3" class="pa-1">
                      <v-img
                        :width="100"
                        :height="100"
                        :src="`${
                          apiBaseUrl + 'storage/' + imgUrl ??
                          'https://via.assets.so/furniture.png?id=1&q=95&w=360&h=360&fit=fill'
                        }`"
                        lazy-src="https://picsum.photos/500/500"
                      >
                        <template v-slot:error>
                          <v-img
                            class="mx-auto"
                            height="500"
                            max-width="500"
                            :src="`https://picsum.photos/id/${cartItem.productId}/500`"
                          ></v-img>
                        </template>
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>
                    </v-col>

                    <v-col>
                      <div class="break-words flex flex-col gap-2">
                        <p class="font-weight-bold text-body-1">
                          {{ "cartItem.name" }}
                        </p>
                        <div class="flex flex-row gap-2">
                          <v-sheet
                            class="w-7 h-5 rounded-sm"
                            elevation="1"
                            :style="{ backgroundColor: 'red' }"
                          />
                          <p class="text-body-2">{{ "cartItem.colorName" }}</p>
                        </div>
                        <p class="text-body-2">{{ "cartItem.size" }}</p>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col class="flex align-center justify-center">
                  <p>${{ 50 }}</p>
                </v-col>
              </v-row>

              <v-row>
                <v-col class="pt-0 pb-4">
                  <v-divider
                    :thickness="2"
                    color="success"
                    opacity="80"
                  ></v-divider
                ></v-col>
              </v-row>

              <v-row dense>
                <v-col class="text-gray-500 text-sm mx-1">
                  <v-row dense>
                    <v-col>Sub Total</v-col>
                    <v-col cols="auto">$100.00</v-col>
                  </v-row>
                  <v-row dense>
                    <v-col>Shipping</v-col>
                    <v-col cols="auto">$15.00</v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-divider
                    :thickness="2"
                    color="success"
                    opacity="80"
                  ></v-divider
                ></v-col>
              </v-row>

              <v-row>
                <v-col class="text-lg font-weight-bold mx-1">
                  <v-row dense>
                    <v-col>Order Total</v-col>
                    <v-col cols="auto">$100.00</v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
