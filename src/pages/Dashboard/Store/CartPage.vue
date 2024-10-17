<template>
  <q-page padding>
    <h4>Cart</h4>
    <q-list bordered separator class="q-mt-sm">
      <q-item v-for="deal in deals" :key="deal.id"
      :to="{ name: 'deal', params: { id: deal.id } }" clickable v-ripple>
        <q-item-section>
          <q-img
          :src="deal.image_url"
        />
        <q-item-label class="q-mt-sm">{{ deal.description }}</q-item-label>
        <q-item-label caption>Caption</q-item-label>
        <q-item-label overline>Caption</q-item-label>
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
  const shoppingCart = shoppingList.find((cart) => cart.user === userId)
  const allDeals = dealStore.deals
  const dealsIds = shoppingCart.deals
  const deals = dealsIds.map((id) => allDeals.find((d) => d.id === id))
  return deals
})

</script>
