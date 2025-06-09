<script setup>
import { reactive, computed, watch } from "vue";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { apiBaseUrl } from "@/utils/utils";
import { useAuthStore } from "@/store/store";

const authStore = useAuthStore();
const address = reactive({
  firstName: null,
  lastName: null,
  contactNumber: null,
  streetAddress: null,
  city: null,
  state: null,
  zipCode: null,
  country: "United States",
  setAddressAs: { label: null, value: null },
});

const states = State.getAllStates()
  .filter((state) => state.countryCode === "US")
  .map((state) => ({ name: state.name, code: state.isoCode }));

const filteredCities = computed(() => {
  if (!address.state) return [];
  const selectedStateCode = address.state.code;
  return City.getAllCities()
    .filter(
      (city) =>
        city.countryCode === "US" && city.stateCode === selectedStateCode
    )
    .map((city) => city.name);
});

const snackbar = reactive({
  show: false,
  message: "Hello, I'm a snackbar",
  timeout: 2000,
});

const componentName = defineModel();

const submitForm = async (event) => {
  const { valid } = await event;

  console.log("Address === ", address);

  if (!valid) return;
  snackbar.show = true;
  try {
    const response = await axios.post(
      apiBaseUrl + "api/address",
      {
        first_name: address.firstName,
        last_name: address.lastName,
        contact_number: address.contactNumber,
        street_address: address.streetAddress,
        state: address.state,
        city: address.city,
        zip_code: address.zipCode,
        country: address.country,
        set_address_as: address.setAddressAs?.value ?? null,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.user.token}`,
        },
      }
    );

    if (response.data.success) {
      snackbar.message = response.data.message;
      componentName.value = "all-address";
      console.log("response === ", snackbar.message);
    } else {
      snackbar.message = response.data.message;
      console.log("response === ", snackbar.message);
    }
  } catch (error) {
    snackbar.message = error.response?.data.message ?? error;
  }
};

watch(
  () => address.state,
  () => {
    address.city = null;
    address.zipCode = null;
  }
);

const addressInputRules = {
  firstName: [
    (value) => !!value || "First Name is required!",
    (value) =>
      value?.length >= 2 || "First Name must be at least 2 characters.",
  ],
  lastName: [
    (value) => !!value || "Last Name is required!",
    (value) => value?.length >= 2 || "Last Name must be at least 2 characters.",
  ],
  contactNumber: [
    (value) => !!value || "Contact number is required!",
    (value) =>
      /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/.test(value) ||
      "Enter a valid U.S. contact number (e.g., (123) 456-7890)!",
  ],
  address: [
    (value) => !!value || "Address is required!",
    (value) => value?.length >= 5 || "Last Name must be at least 6 characters.",
  ],
  state: [
    (value) => !!value || "State is required!",
    (value) =>
      states.some((state) => state.code === value?.code) ||
      "Please select a valid state from the list.",
  ],
  city: [
    (value) => !!value || "City is required!",
    (value) => value?.length >= 2 || "City must be at least 2 characters.",
  ],
  zipcode: [
    (value) => !!value || "Zipcode is required!",
    (value) => /^[0-9]{5}$/.test(value) || "Zipcode must be a 5-digit number.",
  ],
};
const addressSelect = [
  { label: "Use as default shipping address", value: "shipping" },
  { label: "Use as default billing address", value: "billing" },
  { label: "Use as default shipping & billing address", value: "both" },
];
</script>
<template>
  <v-form @submit.prevent="submitForm">
    <v-row>
      <v-col>
        <v-text-field
          label="First Name"
          variant="outlined"
          v-model="address.firstName"
          :rules="addressInputRules.firstName"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Last Name"
          variant="outlined"
          v-model="address.lastName"
          :rules="addressInputRules.lastName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          label="Contact Number"
          variant="outlined"
          v-model="address.contactNumber"
          :rules="addressInputRules.contactNumber"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          label="Address"
          variant="outlined"
          v-model="address.streetAddress"
          :rules="addressInputRules.address"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          :items="states"
          label="State"
          variant="outlined"
          :item-title="(item) => `${item.name} (${item.code})`"
          :item-value="(item) => item"
          v-model="address.state"
          :rules="addressInputRules.state"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          :items="filteredCities"
          label="City"
          variant="outlined"
          v-model="address.city"
          :rules="addressInputRules.city"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          label="ZIP Code"
          variant="outlined"
          v-model="address.zipCode"
          :rules="addressInputRules.zipcode"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          label="Country"
          variant="outlined"
          v-model="address.country"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
          label="Use Address"
          :items="addressSelect"
          :item-title="(item) => item.label"
          :item-value="(item) => item"
          variant="outlined"
          v-model="address.setAddressAs"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        ><v-btn size="x-large" class="w-full" color="primary" type="submit"
          >save address</v-btn
        ></v-col
      >
      <v-col
        ><v-btn
          size="x-large"
          class="w-full"
          @click="componentName = 'all-address'"
          variant="tonal"
          >cancel</v-btn
        ></v-col
      >
    </v-row>

    <v-row>
      <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        color="primary"
      >
        {{ snackbar.message }}

        <template v-slot:actions>
          <v-btn color="pink" variant="text" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-form>
</template>
