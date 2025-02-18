<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-sm">
      <div class="text-h5">Wish List</div>
      <template v-slot:action>
        <q-btn flat color="white" icon="search" />
        <q-btn dense round flat icon="shopping_cart">
          <q-badge color="negative" floating transparent>
            {{ dealsLength }}
          </q-badge>
        </q-btn>
      </template>
    </q-banner>

    <q-list bordered separator dense class="q-mt-sm">
      <q-item clickable v-ripple v-for="deal in deals" :key="deal.id" :to="{ name: 'deal', params: { id: deal.id } }">
        <q-card class="my-card" flat>
          <q-card-section horizontal>
            <q-card-section>
              <img :src="deal.image_url" alt="pic" style="height: 100px; width: auto;" />
            </q-card-section>

            <q-card-section>
              <div class="text-h6 q-mt-sm q-mb-xs text-dark">{{ deal.title }}</div>
              <div class="text-caption text-blue-grey-10">
                {{ deal.description }}
              </div>
              <div class="text-caption text-grey">
                Hermanus | 1.53km
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
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

<style scoped>

.q-card__section--vert {
    padding: 5px;
}

.q-list--dense > .q-item, .q-item--dense {
    padding: 0px;
}
</style>
