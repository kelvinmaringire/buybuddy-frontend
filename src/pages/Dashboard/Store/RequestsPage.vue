<template>
  <q-page padding>
    <h4>Requests</h4>
    <q-list bordered separator class="q-mt-sm">
      <q-item class="q-my-sm" v-for="dealData in sharedInterestDeals" :key="dealData.deal.id" v-ripple>
        <q-item-section>
          <q-img
          :src="dealData.deal.image_url"
        />
        <q-item-label class="q-my-md">{{ dealData.deal.description }}</q-item-label>

        <q-item-label v-for="user in dealData.users" :key="user.id">
          <div class="row justify-between q-mb-sm">
            <div class="text-h6 text-secondary">@{{ user.username }}</div>

            <div>

              <q-btn
                v-if="buttonState(dealData.deal.id, user.id) === 'noRequest'"
                push color="white" text-color="primary"
                label="Request"
                @click="request(dealData.deal.id, user.id)"
              />

              <q-btn
                v-if="buttonState(dealData.deal.id, user.id) === 'pendingRequester'"
                push color="warning" text-color="white"
                label="Pending..."
              />

              <q-btn-dropdown
                v-if="buttonState(dealData.deal.id, user.id) === 'pendingRecipient'"
                color="primary" label="Requested">
                <q-list>
                  <q-item clickable v-close-popup @click="acceptRequest(dealData.deal.id, user.id)">
                    <q-item-section>
                      <q-item-label>Accept</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="declineRequest(dealData.deal.id, user.id)">
                    <q-item-section>
                      <q-item-label>Decline</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn
                v-if="buttonState(dealData.deal.id, user.id) === 'accepted'"
                push color="positive" text-color="white"
                label="Accepted"
              />

              <q-btn
                v-if="buttonState(dealData.deal.id, user.id) === 'declined'"
                push color="negative" text-color="white"
                label="Declined"
              />

            </div>
          </div>
        </q-item-label>
        <q-separator />
        <q-item-label align="center">
          <q-btn :to="{ name: 'deal', params: { id: dealData.deal.id } }" icon="visibility" flat color="primary" >
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
import { useQuasar } from 'quasar'
import { useBuddyStore } from '../../../stores/buddy-store'
import { useDealStore } from '../../../stores/deal-store'
import { useAuthStore } from '../../../stores/auth-store'

const buddyStore = useBuddyStore()
const dealStore = useDealStore()
const authStore = useAuthStore()
const $q = useQuasar()

const sharedInterestDeals = computed(() => {
  const userId = authStore.userId
  const allDeals = dealStore.deals
  const shoppingList = dealStore.shopping_list // List of all users' deals

  // Find the user's shopping cart
  const shoppingCart = shoppingList.find((cart) => cart.user === userId)
  if (!shoppingCart || !shoppingCart.deals) return [] // Return empty if no shopping cart found

  const userDeals = shoppingCart.deals // Deals for the current user
  const sharedDeals = [] // Will store shared interest deals

  // Loop through user's deals
  userDeals.forEach(dealId => {
    // Find other users who are also interested in the same deal
    const interestedUsers = shoppingList
      .filter(cart => cart.deals.includes(dealId) && cart.user !== userId)
      .map(cart => cart.user) // Extract the users

    if (interestedUsers.length > 0) {
      // Add to sharedDeals if there are other users interested
      sharedDeals.push({
        deal: dealId,
        users: interestedUsers
      })
    }
  })

  const mappedSharedDeals = sharedDeals.map(sharedDeal => {
  // Find the deal object by ID from allDeals
    const deal = allDeals.find(d => d.id === sharedDeal.deal)

    // Map user IDs to actual user objects from authStore.users
    const users = sharedDeal.users.map(userId => authStore.users.find(u => u.id === userId))

    // Return the deal and its associated user objects
    return {
      deal,
      users
    }
  })

  return mappedSharedDeals
})

const buttonState = computed(() => (dealId, userId) => {
  const request = currentRequest(dealId, userId)

  if (!request) {
    return 'noRequest'
  }

  const isRequester = request.requester === authStore.userId
  const isRecipient = request.recipient === authStore.userId

  if (request.status === 'Request' && isRequester) {
    return 'pendingRequester'
  }

  if (request.status === 'Request' && isRecipient) {
    return 'pendingRecipient'
  }

  if (request.status === 'Accepted') {
    return 'accepted'
  }

  if (request.status === 'Declined') {
    return 'declined'
  }
})

function currentRequest (dealId, recipientId) {
  const requesterId = authStore.userId

  const currentRequest = buddyStore.buddy_requests.find(
    (request) => request.deal === dealId &&
                (
                  (request.requester === requesterId && request.recipient === recipientId) ||
                  (request.requester === recipientId && request.recipient === requesterId)
                )
  )

  return currentRequest
}

async function request (dealId, recipientId) {
  const requesterId = authStore.userId
  const buddyRequest = { requester: requesterId, recipient: recipientId, deal: dealId, status: 'Request' }

  try {
    await buddyStore.buddyRequest(buddyRequest)

    $q.notify({
      type: 'primary',
      message: 'Buddy Requested',
      position: 'top'
    })
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
async function acceptRequest (dealId, userId) {
  try {
    const request = currentRequest(dealId, userId)
    request.status = 'Accepted'
    await buddyStore.acceptRequest(request)
    $q.notify({ type: 'positive', message: 'Request Accepted', position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to accept request', position: 'top' })
  }
}

async function declineRequest (dealId, userId) {
  try {
    const request = currentRequest(dealId, userId)
    request.status = 'Declined'
    await buddyStore.declineRequest(request)
    $q.notify({ type: 'negative', message: 'Request Declined', position: 'top' })
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to decline request', position: 'top' })
  }
}

</script>
