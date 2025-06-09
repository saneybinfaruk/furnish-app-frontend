<script setup>
import BestSellingProducts from "../components/home/BestSellingProducts.vue";
import FeaturedCarousel from "../components/home/FeaturedCarousel.vue";
import FeaturedCategory from "../components/home/FeaturedCategory.vue";
import FeaturedSingleProduct from "../components/home/FeaturedSingleProduct.vue";
import JustArrivedCarousel from "../components/home/JustArrivedCarousel.vue";
import Newsteller from "../components/home/Newsteller.vue";
</script>
<template>
  <div class="space-y-24 bg-white">
    <FeaturedCarousel />
    <JustArrivedCarousel />
    <FeaturedCategory />
    <FeaturedSingleProduct />
    <BestSellingProducts />
    <Newsteller />
  </div>
</template>
