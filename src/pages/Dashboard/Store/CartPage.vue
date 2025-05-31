<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-sm">
      <div class="text-h6">Wish List</div>
      <template v-slot:action>
        <q-btn dense disable round flat icon="shopping_cart">
          <q-badge color="negative" floating transparent>
            {{ dealsLength }}
          </q-badge>
        </q-btn>
      </template>
    </q-banner>

    <q-list bordered separator dense class="rounded-borders">
      <q-item
        v-for="deal in deals"
        :key="deal.id"
        clickable
        v-ripple
        :to="{ name: 'deal', params: { id: deal.id } }"
      >
        <q-card flat class="q-pa-xs full-width">
          <q-card-section horizontal class="q-gutter-sm items-start no-wrap">
            <q-img
              :src="deal.image_url"
              alt="Deal Image"
              style="width: 100px; height: 100px;"
              class="rounded-borders"
              spinner-color="grey-5"
            />
            <div class="col">
              <div class="text-subtitle1 text-dark">{{ deal.title }}</div>
              <div class="text-caption text-grey-8 ellipsis-2-lines">
                {{ deal.description }}
              </div>
            </div>
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

.ellipsis-2-lines {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.q-list--dense > .q-item,
.q-item--dense {
  padding: 0;
}

.q-card__section--vert {
  padding: 5px;
}

</style>
