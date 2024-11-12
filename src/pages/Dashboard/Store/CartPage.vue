<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-md">
      <div class="text-h5">My Cart</div>
      <template v-slot:action>
        <q-btn flat color="white" icon="search" />
        <q-btn dense round flat icon="shopping_cart">
          <q-badge color="negative" floating transparent>
            {{ dealsLength }}
          </q-badge>
        </q-btn>
      </template>
    </q-banner>

    <q-list bordered separator class="q-mt-sm">
      <q-item v-for="deal in deals" :key="deal.id" v-ripple>
        <q-item-section>
          <q-img
          :src="deal.image_url"
        />
        <q-item-label class="q-my-md">{{ deal.description }}</q-item-label>
        <q-separator />
        <q-item-label align="center">
          <q-btn :to="{ name: 'deal', params: { id: deal.id } }" icon="visibility" flat color="primary" >
            View Deal
          </q-btn>
        </q-item-label>
        <q-separator />
        </q-item-section>

      </q-item>

    </q-list>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useDealStore } from '../../../stores/deal-store'
import { useAuthStore } from '../../../stores/auth-store'

const dealStore = useDealStore()
const authStore = useAuthStore()

const deals = computed(() => {
  const userId = authStore.userId
  const shoppingList = dealStore.shopping_list

  // Find the user's shopping cart
  const shoppingCart = shoppingList.find((cart) => cart.user === userId)

  // Return an empty array if shoppingCart or deals is not available
  if (!shoppingCart || !shoppingCart.deals) {
    return []
  }

  const allDeals = dealStore.deals
  const dealsIds = shoppingCart.deals

  // Map dealsIds to the corresponding deals and return an empty array if a deal is not found
  const deals = dealsIds.map((id) => allDeals.find((d) => d.id === id)).filter(d => d)

  return deals
})

const dealsLength = computed(() => deals.value.length)

</script>
