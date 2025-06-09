<script setup>
import { ref, watch } from "vue";
import AllAddress from "./AllAddress.vue";
import NewAddress from "./NewAddress.vue";
import EditAddress from "./EditAddress.vue";

const componentName = ref("all-address");
const addressId = ref(null);

const editAciton = (id) => {
  addressId.value = id;
  componentName.value = "edit-address";
};
</script>
<template>
  <v-sheet elevation="1">
    <div class="flex items-center justify-between w-full py-4 px-8">
      <h5 class="text-h5">
        {{
          componentName === "add-new-address"
            ? "Add New Address"
            : componentName === "edit-address"
            ? "Edit Address"
            : "Manage Addresses"
        }}
      </h5>
      <v-btn
        v-if="
          componentName !== 'add-new-address' &&
          componentName !== 'edit-address'
        "
        variant="outlined"
        @click="componentName = 'add-new-address'"
        >Add New Address</v-btn
      >
    </div>
    <v-divider opacity="0.6"></v-divider>
    <v-container class="pa-10">
      <NewAddress
        v-model="componentName"
        v-if="componentName === 'add-new-address'"
      />
      <AllAddress v-if="componentName === 'all-address'" @edit="editAciton" />
      <EditAddress
        v-model="componentName"
        v-if="componentName === 'edit-address'"
        :address-id="addressId"
      />
    </v-container>
  </v-sheet>
</template>
