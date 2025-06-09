<script setup>
import { ref } from "vue";

const selectedDate = ref(null);
const menuRef = ref(false);
</script>

<template>
  <div class="flex items-center">
    <!-- Trigger Button -->
    <v-btn
      variant="outlined"
      color="primary"
      @click="menuRef = !menuRef"
      class="mr-4"
    >
      Pick a Date
    </v-btn>

    <!-- Display Selected Date -->
    <span>{{ selectedDate ? selectedDate.toLocaleDateString() : "No date selected" }}</span>

    <!-- Menu with Date Picker -->
    <v-menu
      v-model="menuRef"
      close-on-content-click
      transition="scale-transition"
      offset-y
    >
      <template v-slot:activator="{ props }">
        <!-- Activator (Hidden Button) -->
        <span v-bind="props" />
      </template>

      <!-- Date Picker -->
      <v-date-picker
        v-model="selectedDate"
        locale="en"
        scrollable
        @click:save="menuRef = false"
      />
    </v-menu>
  </div>
</template>
