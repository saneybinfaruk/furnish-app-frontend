<script setup>
import { reactive, computed, watch } from "vue";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { apiBaseUrl } from "@/utils/utils";
import { useAuthStore } from "@/store/store";

const props = defineProps({
  addressId: Number,
});

const authStore = useAuthStore();

const address = reactive({
  firstName: null,
  lastName: null,
  contactNumber: null,
  streetAddress: null,
  city: null,
  state: { name: null, code: null },
  zipCode: null,
  country: "United States",
  setAddressAs: { label: null, value: null },
});

const addressSelect = [
  { label: "Use as default shipping address", value: "shipping" },
  { label: "Use as default billing address", value: "billing" },
  { label: "Use as default shipping & billing address", value: "both" },
];

const fetchAddress = async () => {
  const response = await axios.get(
    apiBaseUrl + `api/address/${props.addressId}`,
    {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    }
  );
  const fetchedAddress = await response.data;
  console.log("fetchedAddress ", fetchedAddress);

  address.firstName = fetchedAddress.first_name;
  address.lastName = fetchedAddress.last_name;
  address.contactNumber = fetchedAddress.contact_number;
  address.streetAddress = fetchedAddress.street_address;
  address.state.name = fetchedAddress.state_name;
  address.state.code = fetchedAddress.state_code;
  address.city = fetchedAddress.city;
  address.zipCode = fetchedAddress.zip_code;

  if (fetchedAddress.is_default_billing && fetchedAddress.is_default_shipping) {
    address.setAddressAs = addressSelect[2];
  } else if (
    fetchedAddress.is_default_billing &&
    !fetchedAddress.is_default_shipping
  ) {
    address.setAddressAs = addressSelect[1];
  } else if (
    !fetchedAddress.is_default_billing &&
    fetchedAddress.is_default_shipping
  ) {
    address.setAddressAs = addressSelect[0];
  } else {
    address.setAddressAs.label = null;
    address.setAddressAs.value = null;
  }
};

fetchAddress();

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

watch(
  () => address.state,
  () => {
    address.city = null;
    address.zipCode = null;
  }
);

const submitForm = async (event) => {
  const { valid } = await event;

  if (!valid) return;
  console.log("address update === ", address);

  snackbar.show = true;
  try {
    const response = await axios.patch(
      apiBaseUrl + `api/address/${props.addressId}`,
      {
        first_name: address.firstName,
        last_name: address.lastName,
        contact_number: address.contactNumber,
        street_address: address.streetAddress,
        state_name: address.state.name,
        state_code: address.state.code,
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

    snackbar.message = response.data.message;
    componentName.value = "all-address";
    console.log("response === ", snackbar.message);
  } catch (error) {
    snackbar.message = error.response.data.message;
  }
};

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

console.log("Inside edit address === ", props.addressId);
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
