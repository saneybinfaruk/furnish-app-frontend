// src/main.ts
import { createApp } from "vue";
import "./style.css";
import router from "./routes.js";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, fa } from "vuetify/iconsets/fa";
import { mdi } from "vuetify/iconsets/mdi";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// Create Vuetify instance with configuration
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light", // Set default theme to light
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },

  components, // Register all Vuetify components
  directives, // Register all Vuetify directives
});

// Create Vue app and use Vuetify, Vue Router
createApp(App)
  .use(vuetify) // Use Vuetify in the app
  .use(router) // Use Vue Router for routing
  .use(pinia)
  .mount("#app"); // Mount the app to the DOM element with id 'app'
