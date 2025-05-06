<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-md">
      <q-btn size="lg" flat dense color="white" icon="keyboard_backspace" :to="{ name: 'deals'}" />
      <template v-slot:action>
        <div class="text-h6" v-if="deal">{{ deal.title }}</div>
      </template>
    </q-banner>

    <q-card class="my-card" flat bordered v-if="deal">
      <q-img :src="deal.image_url" />

      <q-card-section>
        <q-btn
          fab
          color="primary"
          icon="place"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%);"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ deal.title }}
          </div>
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
        </div>

        <q-rating v-model="stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">
          {{ store.name }}
        </div>
        <div class="text-caption text-grey">
          {{ deal.description }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn icon="add_shopping_cart" flat color="positive" :to="{ name: 'login'}">
          Add to shopping cart.
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDealStore } from '../stores/deal-store'

const stars = ref(4)

const dealStore = useDealStore()

const route = useRoute()

const store = computed(() => {
  if (!route.params.id || !dealStore.stores) {
    return null
  }

  const dealId = JSON.parse(route.params.id)
  const deals = dealStore.deals
  const deal = deals.find((deal) => deal.id === dealId)
  const stores = dealStore.stores
  const store = stores.find((store) => store.id === deal.store)

  return store || null
})

const deal = computed(() => {
  if (!route.params.id || !dealStore.deals) {
    return null
  }

  const dealId = JSON.parse(route.params.id)
  const deals = dealStore.deals
  const deal = deals.find((deal) => deal.id === dealId)

  return deal || null
})

// Fetch deals on component mount
onMounted(async () => {
  await dealStore.fetchDeals()
})
</script>
