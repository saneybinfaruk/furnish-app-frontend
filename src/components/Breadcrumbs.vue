<script setup>
import { useRoute } from "vue-router";

const props = defineProps({
  productName: {
    type: String,
    required: false,
  },
});

const route = useRoute();

const breadcrums = () => {
  const paths = route.path.split("/").filter((p) => p);

  const crumslist = paths.map((segment, index) => {
    const path = `/${paths.slice(0, index + 1).join("/")}`;
    let cleanTitle = segment.replace(/-/g, " ");

    if (paths[0] === "products" && index === 1) {
      cleanTitle = props.productName || "Product";
    }

    return {
      title: cleanTitle.substring(0, 1).toUpperCase() + cleanTitle.substring(1),
      to: path,
      disabled: index === paths.length - 1,
    };
  });

  // console.log("breadcrums list === ", crumslist);

  return [{ title: "Home", to: "/", disabled: false }, ...crumslist];
};
</script>
<template>
  <v-breadcrumbs :items="breadcrums()" class="px-0">
    <template v-slot:divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
</template>
