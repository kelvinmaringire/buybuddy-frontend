<template>
  <q-page padding>

    <q-banner dense inline-actions class="text-white bg-primary q-mb-md">
      <q-btn size="lg" flat dense color="white" icon="keyboard_backspace" :to="{ name: 'dashboard'}" />
      <template v-slot:action>
        <div class="text-h6">{{deal.title}}</div>
      </template>
    </q-banner>

    <q-card class="my-card" flat bordered>
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
        <q-btn icon="add_shopping_cart" flat color="positive" v-if="!isInCart" @click="createAddToCart(deal.id)"  v-show="!cart">
          Add to shopping cart.
        </q-btn>
        <q-btn icon="add_shopping_cart" flat color="positive" v-if="!isInCart" @click="addToCart(cart.id, deal.id)"  v-show="cart">
          Add to shopping cart.
        </q-btn>
        <q-btn icon="remove_shopping_cart" flat color="negative" v-if="isInCart" @click="removeFromCart(cart.id, deal.id)">
          Remove from shopping cart.
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useDealStore } from '../../../stores/deal-store'
import { useAuthStore } from '../../../stores/auth-store'

const stars = ref(4)

const $q = useQuasar()

const dealStore = useDealStore()
const authStore = useAuthStore()

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

const cart = computed(() => {
  if (!route.params.id || !dealStore.shopping_list) {
    return null
  }
  const userId = authStore.userId
  const shoppingList = dealStore.shopping_list
  const shoppingCart = shoppingList.find((cart) => cart.user === userId)

  return shoppingCart || null
})

const isInCart = computed(() => {
  // Return false if cart or deal is null, preventing null property access
  return cart.value && deal.value && cart.value.deals.some((item) => item === deal.value.id)
})

async function createAddToCart (dealId) {
  try {
    await dealStore.createShoppingList({ user: authStore.userId, deals: [dealId] })

    $q.notify({
      type: 'positive',
      message: 'Added to cart',
      position: 'top'
    })

    // router.push({ name: 'predictions' }) // Make sure to import 'router' if you're using Vue Router
  } catch (err) {
    if (err.response.data.detail) {
      $q.notify({
        type: 'negative',
        message: err.response.data.detail,
        position: 'top'
      })
    }
  }
}

async function addToCart (shoppingCartId, dealId) {
  try {
    await dealStore.addToShoppingList(shoppingCartId, dealId)

    $q.notify({
      type: 'positive',
      message: 'Added to cart',
      position: 'top'
    })

    // router.push({ name: 'predictions' }) // Make sure to import 'router' if you're using Vue Router
  } catch (err) {
    if (err.response.data.detail) {
      $q.notify({
        type: 'negative',
        message: err.response.data.detail,
        position: 'top'
      })
    }
  }
}

async function removeFromCart (shoppingCartId, dealId) {
  try {
    await dealStore.removeFromShoppingList(shoppingCartId, dealId)

    $q.notify({
      type: 'warning',
      message: 'Removed from cart',
      position: 'top'
    })

    // router.push({ name: 'predictions' }) // Make sure to import 'router' if you're using Vue Router
  } catch (err) {
    if (err.response.data.detail) {
      $q.notify({
        type: 'negative',
        message: err.response.data.detail,
        position: 'top'
      })
    }
  }
}

</script>
