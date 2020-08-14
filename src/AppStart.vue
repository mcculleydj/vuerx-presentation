<template>
  <v-app>
    <v-container>
      <!-- list of dogs -->
      <v-card v-for="(src, i) in sources" :key="src" class="my-5">
        <v-row v-if="src" class="mx-1">
          <!-- image -->
          <v-col cols="auto">
            <v-img @load="setLoaded(i)" :src="src" width="200" height="200" />
          </v-col>
          <!-- name and description -->
          <v-col v-if="loaded[i]">
            <h1>{{ names[i] }}</h1>
            <p>{{ mockDescription }}</p>
          </v-col>
          <!-- waiting on image: name and description loader -->
          <v-col v-else>
            <v-skeleton-loader type="heading" class="mb-5" />
            <v-skeleton-loader type="text@3" />
          </v-col>
        </v-row>
        <!-- waiting on sources: loader -->
        <v-row v-else class="mx-1">
          <v-col cols="auto">
            <v-skeleton-loader type="image" width="200" height="200" />
          </v-col>
          <v-col>
            <v-skeleton-loader type="heading" class="mb-5" />
            <v-skeleton-loader type="text@3" />
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { dogNames, mockDescription, url, numDogs } from '@/common/constants'

export default {
  data: () => ({
    sources: new Array(numDogs).fill(null),
    names: new Array(numDogs).fill(null),
    loaded: [],
    nameIndices: new Set(),
    mockDescription,
  }),

  created() {
    fetch(url)
      .then(r => r.json())
      .then(dogs => {
        setTimeout(() => {
          this.sources = dogs.map(d => d.url)
          this.names = this.names.map(this.getName)
        }, 3000)
      })
  },

  methods: {
    getName() {
      // returns a random name, which was not yet chosen using recursion
      const index = Math.floor(Math.random() * dogNames.length)
      if (this.nameIndices.has(index)) {
        return this.getName()
      }
      this.nameIndices.add(index)
      return dogNames[index]
    },

    setLoaded(i) {
      Vue.set(this.loaded, i, true)
    },
  },
}
</script>
