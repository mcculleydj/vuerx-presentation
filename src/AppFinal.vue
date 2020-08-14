<template>
  <v-app>
    <v-container>
      <!-- list of dogs -->
      <v-card v-for="(src, i) in source$" :key="src" class="my-5">
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
    <DragLoader @refresh="fetchDogs()" />
  </v-app>
</template>

<script>
import Vue from 'vue'
import DragLoader from '@/components/DragLoader'
import { dogNames, mockDescription, url, numDogs } from '@/common/constants'
import { EMPTY, BehaviorSubject, concat, of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, map, delay, share, exhaustMap, tap } from 'rxjs/operators'

export const dogAPI$ = ajax(url).pipe(
  map(r => r.response.map(dog => dog.url)),
  catchError(err => {
    console.error(err)
    return EMPTY
  }),
  delay(3000),
  share(),
)

export const refresh$ = new BehaviorSubject(null)

export default {
  components: {
    DragLoader,
  },

  data: () => ({
    names: new Array(numDogs).fill(null),
    loaded: [],
    nameIndices: new Set(),
    mockDescription,
  }),

  subscriptions() {
    const source$ = refresh$.pipe(
      exhaustMap(() => concat(of(new Array(numDogs).fill(null)), dogAPI$)),
      tap(() => {
        this.names = this.names.map(this.getName)
      }),
    )

    return {
      source$,
    }
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

    fetchDogs() {
      this.nameIndices = new Set()
      this.loaded = []
      refresh$.next()
    },
  },
}
</script>
