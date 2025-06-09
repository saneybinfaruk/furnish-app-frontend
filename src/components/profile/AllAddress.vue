<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "../../store/store";
import axios from "axios";
import { apiBaseUrl } from "../../utils/utils";

const emits = defineEmits(["edit"]);
const authStore = useAuthStore();

const allAddresses = ref([]);

const fetchAddresses = async () => {
  try {
    const response = await axios.get(apiBaseUrl + "api/address", {
      headers: {
        Authorization: `Bearer ${authStore.user.token}`,
      },
    });

    allAddresses.value = await response.data;

    console.log("address === ", response.data);
  } catch (error) {}
};

fetchAddresses();

const deleteAddress = async (id, index) => {
  console.log("Delete Address === ", id);

  const response = await axios.delete(apiBaseUrl + `api/address/${id}`, {
    headers: {
      Authorization: `Bearer ${authStore.user.token}`,
    },
  });

  if (response.data.success) {
    allAddresses.value.splice(index, 1);
  }
};
</script>

<template>
  <v-row>
    <v-col v-for="(address, index) in allAddresses">
      <v-sheet
        class="bg-grey-lighten-5"
        min-width="280"
        max-width="340"
        border
        rounded
      >
        <div class="pa-8 space-y-2">
          <h5
            class="text-subtitle-1 font-weight-black pb-2"
            v-if="address.is_default_shipping && address.is_default_billing"
          >
            Default Shipping & Billing Address
          </h5>
          <h5
            class="text-subtitle-1 font-weight-black pb-2"
            v-if="address.is_default_shipping && !address.is_default_billing"
          >
            Default Shipping Address
          </h5>
          <h5
            class="text-subtitle-1 font-weight-black pb-2"
            v-if="!address.is_default_shipping && address.is_default_billing"
          >
            Default Billing Address
          </h5>

          <p>{{ address.first_name }} {{ address.last_name }}</p>
          <p>{{ address.contact_number }}</p>
          <p>{{ address.street_address }}</p>
          <p>
            {{ address.city }}, {{ address.state_name }}, {{ address.zip_code }}
          </p>
          <p>{{ address.country }}</p>
        </div>
        <v-divider opacity="0.6"></v-divider>
        <v-row no-gutters>
          <v-col>
            <v-btn
              block
              variant="tonal"
              tile
              color="primary"
              @click="emits('edit', address.id)"
              height="50"
            >
              Edit Address
            </v-btn>
          </v-col>
          <v-col
            v-if="!address.is_default_shipping && !address.is_default_billing"
          >
            <v-btn block variant="tonal" tile color="error" height="50">
              Delete Address

              <v-dialog activator="parent" max-width="500">
                <template v-slot:default="{ isActive }">
                  <v-card
                    max-width="400"
                    text="Are you sure you want to delete this address?"
                  >
                    <template v-slot:actions>
                      <v-btn
                        text="ok"
                        color="error"
                        variant="plain"
                        @click="
                          () => {
                            deleteAddress(address.id, index);
                            isActive.value = false;
                          }
                        "
                      ></v-btn>
                      <v-btn
                        text="cancel"
                        variant="plain"
                        @click="isActive.value = false"
                      ></v-btn>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>
</template>
