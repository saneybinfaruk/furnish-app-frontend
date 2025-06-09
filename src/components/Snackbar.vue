<script setup>

</script>

<template>
  <v-snackbar
      :timeout="2000"
  >
    <template v-slot:activator="{ props }">
      <v-btn class="ma-2" v-bind="props">open</v-btn>
    </template>

    Lorem ipsum dolor sit amet consectetur.
  </v-snackbar>
</template>

<style scoped>

</style>