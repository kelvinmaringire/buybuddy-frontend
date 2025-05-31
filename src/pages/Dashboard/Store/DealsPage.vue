<template>
  <q-page padding>
    <!-- Banner Header -->
    <q-banner dense inline-actions class="text-white bg-primary q-mb-md q-pa-sm rounded-borders">
      <div class="text-h6">Nearby Deals</div>
      <template v-slot:action>
        <q-btn dense flat round color="white" icon="search" />
      </template>
    </q-banner>

    <!-- Search Address Form -->
    <q-slide-transition>
      <div v-show="searchAddress" class="q-mb-md">
        <form class="search-form">
          <input
            id="place"
            type="text"
            v-model="placeInput"
            ref="autocompleteInput"
            placeholder="Enter New Area"
            class="styled-input"
          />
          <q-btn
            class="glossy"
            color="primary"
            label="Close"
            push
            no-caps
            icon="close"
            @click="searchAddress = false"
          />
        </form>
      </div>
    </q-slide-transition>

    <!-- Toggle Address Form Button -->
    <q-slide-transition>
      <div v-show="!searchAddress" class="q-mb-md">
        <q-btn
          color="primary"
          label="Change current location"
          icon="place"
          no-caps
          push
          glossy
          @click="searchAddress = true"
          class="full-width"
        />
      </div>
    </q-slide-transition>

    <!-- Deal Cards -->
    <q-list bordered separator dense class="rounded-borders">
      <q-item
        v-for="deal in displayedDeals"
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
              <div class="text-caption text-blue-grey-6 q-mt-xs">
                {{ deal.store_address }} | {{ deal.distanceKm }} km
              </div>
            </div>
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

#place,
.styled-input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

#place:focus,
.styled-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 6px rgba(25, 118, 210, 0.5);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px;
}

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
