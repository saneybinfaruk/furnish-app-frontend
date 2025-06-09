<script setup>
import RadixIconsArrowTopRight from "~icons/radix-icons/arrow-top-right";
import MynauiArrowLongRight from "~icons/mynaui/arrow-long-right";
import greenSofa from "@/assets/green_sofa.png"; 
import sofaBG from "@/assets/sofa_with_bg.jpg";
import brownSofa from "@/assets/brown_sofa.png";
import pattern from "@/assets/pattern.png";
</script>
<template>
  <section>
    <v-container fluid class="relative bg-white pa-0">
      <div class="absolute -left-40 top-40 rotate-12">
        <v-img
          cover
          :src="pattern"
          width="300"
          height="300"
          class="opacity-10"
        ></v-img>
      </div>
      <v-row class="max-w-6xl mx-auto">
        <v-col class="space-y-3 flex flex-col items-start justify-center">
          <h1 class="text-h3">Wingrove Storage Desk, French Oak</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. A nulla
            exercitationem, corporis officia sunt, perspiciatis architecto
            consequatur tenetur ipsam numquam, necessitatibus laboriosam commodi
            tempore nam? Esse animi officiis placeat possimus!
          </p>
          <v-btn
            :append-icon="RadixIconsArrowTopRight"
            text="Read More"
            class="text-none bg-teal-darken-2 mt-8"
            tile
            variant="flat"
          />
        </v-col>
        <v-col>
          <div class="relative">
            <v-img
              class="bg-[#E6D9CB]"
              height="500"
              cover
              :src="greenSofa"
            ></v-img>
            <div
              class="bg-teal-darken-2 opacity-50 absolute left-1/2 top-0 h-full w-1/2"
            ></div>
          </div>
        </v-col>
      </v-row>

      <v-row class="w-full pa-0 !-mt-16">
        <v-container fluid class="pa-0 ma-0">
          <v-row>
            <v-col cols="7">
              <v-img height="400" cover :src="sofaBG"></v-img>
            </v-col>

            <v-col
              class="d-flex flex-column justify-space-between h-100 space-y-2"
            >
              <v-img
                height="150"
                width="150"
                cover
                :src="brownSofa"
                class="align-self-end mr-10 border-4 border-white border-opacity-100 bg-yellow-600"
              ></v-img>

              <p class="mr-36">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
                omnis facilis doloribus nisi cumque inventore dolorum doloremque
                fuga, deserunt, reiciendis quam, eius eaque voluptatum beatae
                saepe. Nam nemo provident aspernatur.
              </p>

              <v-sheet class="bg-orange-lighten-5 pa-2 mt-5">
                <v-container>
                  <v-row>
                    <v-col class="relative">
                      <v-avatar v-for="i in 3" class="mx-0.5">
                        <v-img
                          alt="John"
                          :src="`https://picsum.photos/id/${i}/300`"
                        ></v-img>
                      </v-avatar>
                    </v-col>

                    <v-col class="d-flex align-center gap-5">
                      <p>More Product</p>
                      <v-btn
                        :icon="MynauiArrowLongRight"
                        variant="outlined"
                        tile
                        color="teal-darken-2"
                      ></v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-row>
    </v-container>
  </section>
</template>
