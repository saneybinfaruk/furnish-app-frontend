// src/main.ts
import {createApp} from 'vue'
import './style.css'  // Import your global CSS
import router from './routes.js'  // Import your router setup
import 'vuetify/styles'  // Import Vuetify CSS styles
import {createVuetify} from 'vuetify'  // Import Vuetify's API for creation
import * as components from 'vuetify/components'  // Import Vuetify components
import * as directives from 'vuetify/directives'  // Import Vuetify directives
import {aliases, fa} from 'vuetify/iconsets/fa'
import {mdi} from 'vuetify/iconsets/mdi'
import App from './App.vue'
import {createPinia} from "pinia";  // Import the main app component

// Create Vuetify instance with configuration
const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light',  // Set default theme to light
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },

    components,  // Register all Vuetify components
    directives,  // Register all Vuetify directives
})

// Create Vue app and use Vuetify, Vue Router
createApp(App)
    .use(vuetify)  // Use Vuetify in the app
    .use(router)   // Use Vue Router for routing
    .use(createPinia())
    .mount('#app')  // Mount the app to the DOM element with id 'app'
