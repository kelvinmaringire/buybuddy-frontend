<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-md">
      <div class="text-h5">Buy Buddies</div>
      <template v-slot:action>
        <q-btn dense round flat icon="people">
          <q-badge color="negative" floating transparent>
            2
          </q-badge>
        </q-btn>
      </template>
    </q-banner>
    <q-list bordered separator class="q-mt-sm">
      <q-item class="q-my-sm" v-for="dealData in sharedAcceptedDeals" :key="dealData.deal.id" v-ripple>
        <q-item-section>
          <q-img :src="dealData.deal.image_url" />
          <q-item-label class="q-my-md">{{ dealData.deal.description }}</q-item-label>

          <q-item-label v-for="user in dealData.users" :key="user.id">
            <div class="row justify-between q-mb-sm">
              <div class="text-h6 text-secondary">@{{ user.username }}</div>
              <div>
                <q-btn
                  v-if="buttonState(dealData.deal.id, user.id) === 'accepted'"
                  push icon="chat" color="positive" text-color="white"
                  label="Chat" :to="{ name: 'chat', params: { id: getBuddyId(dealData.deal.id, user.id) } }"
                />
              </div>
            </div>
          </q-item-label>
          <q-separator />
          <q-item-label align="center">
            <q-btn :to="{ name: 'deal', params: { id: dealData.deal.id } }" icon="visibility" flat color="primary">
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
// import { useQuasar } from 'quasar'
import { useBuddyStore } from '../../../stores/buddy-store'
import { useDealStore } from '../../../stores/deal-store'
import { useAuthStore } from '../../../stores/auth-store'

const buddyStore = useBuddyStore()
const dealStore = useDealStore()
const authStore = useAuthStore()

// Only show deals with an accepted status
const sharedAcceptedDeals = computed(() => {
  const userId = authStore.userId
  const allDeals = dealStore.deals
  const shoppingList = dealStore.shopping_list

  const userCart = shoppingList.find(cart => cart.user === userId)
  if (!userCart || !userCart.deals) return []

  const userDeals = userCart.deals
  const sharedDeals = []

  userDeals.forEach(dealId => {
    const interestedUsers = shoppingList
      .filter(cart => cart.deals.includes(dealId) && cart.user !== userId)
      .map(cart => cart.user)

    if (interestedUsers.length > 0) {
      sharedDeals.push({
        deal: dealId,
        users: interestedUsers
      })
    }
  })

  return sharedDeals
    .map(sharedDeal => {
      const deal = allDeals.find(d => d.id === sharedDeal.deal)
      const users = sharedDeal.users
        .map(userId => authStore.users.find(u => u.id === userId))
        .filter(user => {
          const request = currentRequest(sharedDeal.deal, user.id)
          return request && request.status === 'Accepted'
        })
      return { deal, users }
    })
    .filter(dealData => dealData.users.length > 0)
})

const buttonState = computed(() => (dealId, userId) => {
  const request = currentRequest(dealId, userId)
  if (!request) return 'noRequest'
  return request.status === 'Accepted' ? 'accepted' : 'declined'
})

function currentRequest (dealId, recipientId) {
  const requesterId = authStore.userId
  return buddyStore.buddy_requests.find(
    request =>
      request.deal === dealId &&
      ((request.requester === requesterId && request.recipient === recipientId) ||
        (request.requester === recipientId && request.recipient === requesterId))
  )
}
function getBuddyId (dealId, userId) {
  const buddies = buddyStore.buddies // Assuming this is your list of buddies
  const request = currentRequest(dealId, userId) // Get the request for the given deal and user

  if (!request) {
    return null // No request found
  }

  // Find the buddy relationship that matches the request's requester and recipient
  const buddy = buddies.find(
    b =>
      b.deal === dealId &&
      ((b.requester === request.requester && b.recipient === request.recipient) ||
        (b.requester === request.recipient && b.recipient === request.requester))
  )

  // Return the buddyId if a matching relationship is found
  return buddy ? buddy.id : null
}
</script>
