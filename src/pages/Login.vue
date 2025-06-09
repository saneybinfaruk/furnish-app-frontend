<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { apiBaseUrl } from "../utils/utils";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/store";

const authStore = useAuthStore();

const user = reactive({
  email: "",
  password: "",
});

const errorMessage = ref("");
const showErrorMessage = ref(false);
const router = useRouter();
const route = useRoute();
let timeoutId; // To manage the timeout for error visibility

const showError = (message) => {
  errorMessage.value = message; // Set the error message
  showErrorMessage.value = true; // Show the error message

  // Clear any existing timeout
  clearTimeout(timeoutId);

  // Hide the error after 3 seconds
  timeoutId = setTimeout(() => {
    showErrorMessage.value = false;
  }, 3000);
};

const userLoginRules = {
  email: [
    (value) => !!value || "Email is required!",
    (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      "Enter a valid email address.",
  ],
  password: [(value) => !!value || "Password is required!"],
};

const showPassword = ref(false);
const formValid = ref(false);

const onSubmit = async (event) => {
  const { valid } = await event;
  if (!valid) return;

  try {
    const response = await axios.post(apiBaseUrl + "api/login", user, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.data.success) {
      console.log(response.data.message);

      if (response.data.user) {
        const user = response.data.user; 
        authStore.login(user.first_name, user.last_name, user.email,user.role, response.data.token);
      }
      const redirectPath = route.query.redirect || "/";
      console.log("redirectPath == ", route.query);

      router.replace(redirectPath);

      console.log("Token == ", response.data.token);
    } else {
      showError(response.data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.message || "An unexpected error occurred.";
    showError(errorMsg);
    console.error(errorMsg);
  }
};
</script>

<template>
  <v-container max-width="600">
    <v-form @submit.prevent="onSubmit" v-model="formValid">
      <v-row>
        <h5 class="font-weight-bold text-h5 text-center w-full py-5">Login</h5>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="user.email"
            label="Email"
            variant="outlined"
            required
            :rules="userLoginRules.email"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.password"
            label="Password"
            variant="outlined"
            required
            :rules="userLoginRules.password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row v-if="showErrorMessage">
        <v-col>
          <v-alert color="red" variant="outlined">
            {{ errorMessage }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn
            block
            size="large"
            type="submit"
            color="primary"
            :disabled="!formValid"
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
