<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/store/store";
import { apiBaseUrl } from "../utils/utils";
import { useRouter } from "vue-router";
const store = useAuthStore();
const router = useRouter();
const user = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const userRegisterRules = {
  firstNameRules: [
    (value) => !!value || "First Name is required!",
    (value) =>
      value?.length >= 2 || "First Name must be at least 3 characters.",
  ],
  email: [
    (value) => !!value || "Email is required!",
    (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      "Enter a valid email address.",
  ],
  password: [
    (value) => !!value || "Password is required!",
    (value) => value.length >= 6 || "Password must be at least 6 characters.",
    (value) =>
      /[A-Z]/.test(value) ||
      "Password must include at least one uppercase letter.",
    (value) =>
      /[a-z]/.test(value) ||
      "Password must include at least one lowercase letter.",
    (value) => /\d/.test(value) || "Password must include at least one number.",
    (value) =>
      /[!@#$%^&*]/.test(value) ||
      "Password must include at least one special character.",
  ],
  passwordConfirm: [
    (value) => !!value || "Password confirmation is required!",
    (value) => value === user.password || "Passwords do not match.",
  ],
};

const show = reactive({
  password: false,
  passwordConfirm: false,
});

const errorInfo = reactive({
  show: false,
  message: "",
});
let timeoutId;
const showError = (message) => {
  errorInfo.message = message; // Set the error message
  errorInfo.show = true; // Show the error message

  // Clear any existing timeout
  clearTimeout(timeoutId);

  // Hide the error after 3 seconds
  timeoutId = setTimeout(() => {
    errorInfo.show = false;
  }, 3000);
};
const onSubmit = async (event) => {
  const { valid } = await event;

  if (valid) {
    try {
      const response = await axios.post(apiBaseUrl + "api/register", user, {
        headers: {
          Accept: "application/json",
        },
      });
      console.log("response ", response.data);

      if (response.data.success) {
        if (response.data.user) {
          const user = response.data.user;
          store.login(
            user.first_name,
            user.last_name,
            user.email,
            response.data.token
          );
        }
        const redirectPath = "/";

        router.replace(redirectPath);
      } else {
        showError(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      showError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  }
};
</script>
<template>
  <v-container max-width="600">
    <v-form @submit.prevent="onSubmit">
      <v-row>
        <h5 class="font-weight-bold text-h5 text-center w-full py-5">
          Register
        </h5>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model="user.first_name"
            label="First name"
            variant="outlined"
            required
            :rules="userRegisterRules.firstNameRules"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="user.last_name"
            label="Last name (optional)"
            variant="outlined"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.email"
            label="Email"
            variant="outlined"
            required
            :rules="userRegisterRules.email"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.password"
            label="Password"
            variant="outlined"
            :type="show.password ? 'text' : 'password'"
            :append-icon="show.password ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show.password = !show.password"
            :rules="userRegisterRules.password"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="user.password_confirmation"
            label="Password confirm"
            variant="outlined"
            :type="show.passwordConfirm ? 'text' : 'password'"
            :append-icon="show.passwordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show.passwordConfirm = !show.passwordConfirm"
            :rules="userRegisterRules.passwordConfirm"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="errorInfo.show">
        <v-col>
          <v-alert color="red" variant="outlined">
            {{ errorInfo.message }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block size="large" type="submit" color="primary"
            >register</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
