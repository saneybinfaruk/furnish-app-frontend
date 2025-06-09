<script setup>
defineProps({
  message: String,
  success: Boolean,
});
</script>

<template>
  <p :class="`font-weight-bold text-sm ${ success ? 'text-green' : 'text-red'}`">
    {{ message }}
  </p>
</template>
