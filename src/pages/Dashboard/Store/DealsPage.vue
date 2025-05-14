<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-xs">
      <div class="text-h5">Deals</div>
      <template v-slot:action>
        <q-btn flat color="white" icon="search" />
        <q-btn dense round flat icon="local_offer">
          <q-badge color="negative" floating transparent>
            {{ dealsLength }}
          </q-badge>
        </q-btn>
      </template>
    </q-banner>
    <div v-show="searchAddress">
      <form>
        <input
          id="place"
          type="text"
          v-model="placeInput"
          ref="autocompleteInput"
          placeholder="Enter New Area"
        />
        <q-btn class="glossy" color="primary" label="Close" push no-caps @click="searchAddress = false" />
      </form>
    </div>
    <div v-show="!searchAddress" class="q-mb-md">
      <form >
        <q-btn class="glossy" color="primary" label="Change current location" push @click="searchAddress = true" />
      </form>
    </div>

    <q-list bordered separator dense>
      <q-item clickable v-ripple v-for="deal in displayedDeals" :key="deal.id" :to="{ name: 'deal', params: { id: deal.id } }">
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
                {{deal.store_address}} | {{ deal.distanceKm }}km
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useDealStore } from '../../../stores/deal-store'
import { useAuthStore } from '../../../stores/auth-store'

const dealStore = useDealStore()
const authStore = useAuthStore()

const dealsLength = computed(() => dealStore.geoDeals.length)

// Places API AIzaSyD7NL9oNrApHfBlz1YL52_QoHcJYDvpHGQ

const placeInput = ref('')
const selectedPlace = ref(null)
const autocompleteInput = ref(null)

const searchAddress = ref(false)

onMounted(async () => {
  // eslint-disable-next-line no-undef
  if (!window.google || !google.maps.places.Autocomplete) {
    console.error('Google Maps JavaScript API or Autocomplete is not loaded.')
    return
  }

  const inputElement = autocompleteInput.value

  if (!inputElement) {
    console.error('Input element not found.')
    return
  }

  // eslint-disable-next-line no-undef
  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    componentRestrictions: { country: 'za' },
    fields: ['place_id', 'name', 'formatted_address', 'geometry']
  })

  autocomplete.addListener('place_changed', () => {
    (async () => {
      const place = autocomplete.getPlace()
      if (place && place.geometry && place.geometry.location) {
        selectedPlace.value = place

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        const user = {
          id: authStore.userId,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }

        try {
          await authStore.editPartialUser(user)
          searchAddress.value = false
          // Force update deals calculation
          dealStore.updateDealsForNewLocation()
        } catch (error) {
          console.error('Failed to update user:', error)
        }
      } else {
        console.error('No place geometry available.')
      }
    })()
  })
})

// Add this computed property to force updates when location changes
const locationDependentDeals = computed(() => {
  return {
    deals: dealStore.geoDeals,
    timestamp: dealStore.lastLocationUpdate
  }
})

// Watch for changes in the user's location
watch(
  () => authStore.profile?.location,
  (newLocation) => {
    if (newLocation) {
      dealStore.updateDealsForNewLocation()
    }
  },
  { deep: true }
)

// Update your template to use locationDependentDeals instead of dealStore.geoDeals directly
const displayedDeals = computed(() => locationDependentDeals.value.deals)
</script>

<style scoped>

.q-card__section--vert {
    padding: 5px;
}

.q-list--dense > .q-item, .q-item--dense {
    padding: 0px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

input#place {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input#place:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

</style>
