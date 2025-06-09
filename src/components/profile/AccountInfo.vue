<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import RadixIconsCross2 from "~icons/radix-icons/cross-2";
import { useAuthStore } from "@/store/store";
import LogosStripe from "~icons/logos/stripe";
import CibStripeS from "~icons/cib/stripe-s";
import { useFetchMe } from "../../composables/useFetchMe";
import axios from "axios";
import { apiBaseUrl } from "../../utils/utils";

const authStore = useAuthStore();
const gender = ["Male", "Female"];

const user = reactive({
  firstName: "",
  lastName: "",
  email: null,
  contactNumber: "",
  selectedGender: null,
});

const isEditing = ref(true);

const newPhoneNumber = ref("");
const OTP = ref("");

const changeEmail = ref(false);

const demoPassword = ref(123456);

const password = reactive({
  currrent: "",
  new: "",
});
const changePassword = ref(false);

const submitForm = () => {
  console.log("User Info === ", user);
};

const submitOTP = () => {
  console.log("OTP is ", OTP.value);
};

const { fetchedStore, isLoading } = useFetchMe(authStore.user.token);
const vendor = reactive({
  storeName: null,
  storeNameSlug: null,
  storeDescription: null,
  storeAddress: null,
  stripeAccountId: null,
});

watch(fetchedStore, (value) => {
  user.firstName = value.first_name;
  user.lastName = value.last_name;
  user.contactNumber = value.contactNumber;
  user.selectedGender =
    value.gender.substring(0, 1).toUpperCase() + value.gender.substring(1);
  user.email = value.email;

  if (!value.vendor) return;
  vendor.storeName = value.vendor.store_name;
  vendor.storeNameSlug = value.vendor.store_name_slug;
  vendor.storeDescription = value.vendor.store_description;
  vendor.storeAddress = value.vendor.store_address;
  vendor.stripeAccountId = value.vendor.stripe_account_id;
});

const storeFormValidation = ref(true);
const vendorRules = {
  name: [
    (value) =>
      value?.length >= 3 || "Store Name must be at least 3 characters.",
  ],
  description: [
    (value) =>
      value?.length >= 5 || "Store Description must be at least 5 characters.",
  ],

  address: [
    (value) =>
      value?.length >= 10 || "Store Address must be at least 5 characters.",
  ],
};

const snackbar = reactive({
  show: false,
  message: null,
});
const submitStoreForm = async () => {
  try {
    const response = await axios.patch(
      `${apiBaseUrl}api/stores/${vendor.storeNameSlug}`,
      vendor,
      {
        headers: {
          Authorization: `Bearer ${authStore.user.token}`,
        },
      }
    );

    const vendorResponse = await response.data;
    snackbar.show = vendorResponse.success;
    snackbar.message = vendorResponse.message;

    console.log("submitStoreForm === ", vendorResponse);
  } catch (error) {
    console.log("submitStoreForm === ", error);
  }
};

const connectToStripe = async () => {
  const response = await axios.post(
    `${apiBaseUrl}api/connect-stripe`,
    {},
    {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    }
  );

  console.log("Connect to stripe ===> ", response.data);
  window.location.href = response.data.url;
};
</script>
<template>
  <v-row v-if="isLoading">
    <v-col>
      <v-progress-linear
        color="red-darken-2"
        model-value="100"
        rounded
        indeterminate
      ></v-progress-linear>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col>
      <v-sheet>
        <v-form @submit.prevent="submitForm">
          <div class="flex items-center justify-between w-full py-4 px-8">
            <h5 class="text-h5">Account Information</h5>
            <v-btn
              variant="outlined"
              class="px-12"
              type="submit"
              @click="isEditing = !isEditing"
              >{{ isEditing ? "edit" : "save" }}</v-btn
            >
          </div>
          <v-divider opacity="0.6"></v-divider>
          <v-container class="pt-10 px-10">
            <v-row>
              <v-col>
                <v-text-field
                  label="First Name"
                  :variant="isEditing ? 'plain' : 'outlined'"
                  v-model="user.firstName"
                  :readonly="isEditing"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Last Name"
                  :variant="isEditing ? 'plain' : 'outlined'"
                  v-model="user.lastName"
                  :readonly="isEditing"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Contact Number"
                  :variant="isEditing ? 'plain' : 'outlined'"
                  v-model="user.contactNumber"
                  :readonly="isEditing"
                ></v-text-field>

                <v-dialog v-if="!isEditing" width="800">
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      v-bind="activatorProps"
                      text="Add mobile number"
                      variant="tonal"
                      class="text-decoration-underline text-subtitle-1"
                    ></v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card>
                      <v-toolbar>
                        <v-toolbar-title>Change Phone Number</v-toolbar-title>
                        <v-btn
                          :icon="RadixIconsCross2"
                          @click="isActive.value = false"
                        >
                        </v-btn>
                      </v-toolbar>

                      <v-card-item>
                        <div class="max-w-[450px] mx-auto p-4 space-y-1">
                          <div class="flex gap-3">
                            <v-text-field
                              label="Mobile Number"
                              variant="outlined"
                              v-model="newPhoneNumber"
                              :disabled="isEditing"
                            ></v-text-field>
                            <v-btn
                              @click="
                                () =>
                                  console.log('newPhoneNumber ', newPhoneNumber)
                              "
                              color="primary"
                              height="55"
                              >send</v-btn
                            >
                          </div>
                          <v-text-field
                            label="OTP"
                            variant="outlined"
                            v-model="OTP"
                            clearable
                            :clear-icon="RadixIconsCross2"
                          ></v-text-field>
                          <v-btn
                            @click="
                              () => {
                                submitOTP();
                                isActive.value = false;
                              }
                            "
                            block
                            color="primary"
                            >send</v-btn
                          >
                        </div>
                      </v-card-item>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
              <v-col>
                <v-select
                  :items="['Male', 'Female']"
                  v-model="user.selectedGender"
                  :readonly="isEditing"
                  :variant="isEditing ? 'plain' : 'outlined'"
                  label="Gender"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-sheet>

      <v-sheet class="mt-6">
        <h5 class="text-h5 py-4 px-8">Account Security</h5>
        <v-divider opacity="0.6"></v-divider>

        <v-container class="pa-10">
          <v-row>
            <v-col>
              <v-text-field
                label="Email"
                variant="outlined"
                v-model="user.email"
              ></v-text-field>
              <v-btn
                variant="tonal"
                @click="changeEmail = true"
                v-if="!changeEmail"
                >Change email address</v-btn
              >
              <div v-if="changeEmail" class="flex gap-4">
                <v-btn variant="tonal" @click="changeEmail = false"
                  >cancel</v-btn
                >
                <v-btn variant="tonal">save</v-btn>
              </div>
            </v-col>

            <v-col>
              <div class="flex flex-col" v-if="!changePassword">
                <v-text-field
                  label="Password"
                  variant="outlined"
                  value="******"
                  type="password"
                  v-model="demoPassword"
                ></v-text-field>

                <v-btn @click="changePassword = true" variant="tonal"
                  >Change password</v-btn
                >
              </div>

              <div v-if="changePassword" class="flex flex-col">
                <v-text-field
                  label="Current password"
                  variant="outlined"
                  v-model="password.currrent"
                ></v-text-field>

                <v-text-field
                  label="New password"
                  variant="outlined"
                  v-model="password.new"
                ></v-text-field>

                <div class="flex gap-4">
                  <v-btn variant="tonal" @click="changePassword = false"
                    >cancel</v-btn
                  >
                  <v-btn
                    variant="tonal"
                    @click="() => console.log('password == ', password)"
                    >save</v-btn
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-col>
    <v-col cols="4">
      <v-sheet v-if="fetchedStore?.role !== 'vendor'" class="text-lg">
        <div class="flex items-center justify-between">
          <h4 class="pa-5">Vendor Details</h4>
        </div>
        <v-divider opacity="0.6"></v-divider>
        <div class="pa-4 space-y-5">
          <v-btn
            block
            variant="flat"
            color="deep-purple-accent-3"
            class="text-none"
            >Become a Vendor
            <v-dialog activator="parent" class="max-w-xl">
              <template v-slot:default="{ isActive }">
                <v-card text="Are you sure you want to become a Vendor?">
                  <v-card-actions class="d-flex justify-end">
                    <v-btn
                      class="text-none"
                      text="Cancel"
                      @click="isActive.value = false"
                    ></v-btn>
                    <v-btn
                      class="text-none"
                      text="Yes"
                      variant="flat"
                      color="deep-purple-accent-4"
                      @click="
                        () => {
                          isActive.value = false;
                          becomeVendor = true;
                        }
                      "
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-btn>
        </div>
      </v-sheet>
      <v-sheet v-else class="text-lg">
        <div class="flex items-center justify-between px-3 py-[18px]">
          <h4>Vendor Details</h4>
          <v-chip
            :color="
              fetchedStore?.vendor?.status === 'approved'
                ? 'success'
                : fetchedStore?.vendor?.status === 'rejected'
                ? 'error'
                : 'warning'
            "
            variant="flat"
          >
            {{ fetchedStore?.vendor?.status }}
          </v-chip>
        </div>
        <v-divider opacity="0.6"></v-divider>
        <div class="pa-4 space-y-5">
          <v-form
            class="space-y-4"
            @submit.prevent="submitStoreForm"
            v-model="storeFormValidation"
          >
            <v-text-field
              label="Store name"
              variant="outlined"
              v-model="vendor.storeName"
              :rules="vendorRules.name"
            ></v-text-field>
            <v-textarea
              label="Store drescription"
              variant="outlined"
              v-model="vendor.storeDescription"
              :rules="vendorRules.description"
            ></v-textarea>
            <v-textarea
              label="Store address"
              variant="outlined"
              v-model="vendor.storeAddress"
              :rules="vendorRules.address"
            ></v-textarea>
            <v-btn
              variant="flat"
              color="deep-purple-accent-2"
              type="submit"
              :disabled="!storeFormValidation"
              >Save</v-btn
            >
          </v-form>

          <p
            v-show="!!vendor.stripeAccountId"
            class="text-sm bg-green-100 py-3 px-1 text-center font-semibold"
          >
            You have successfully connected to Stripe
          </p>
          <v-btn
            block
            variant="flat"
            color="deep-purple-accent-4"
            @click="connectToStripe"
            :disabled="!!vendor.stripeAccountId"
            >Connect to stripe
          </v-btn>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-snackbar v-model="snackbar.show" timeout="1500" color="green-darken-3">
        {{ snackbar.message }}
      </v-snackbar></v-col
    >
  </v-row>
</template>
