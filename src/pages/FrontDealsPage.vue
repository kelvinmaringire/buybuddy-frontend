<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-xs">
      <div class="text-h6">Deals</div>
      <template v-slot:action>
        <q-btn flat color="white" icon="search" />
      </template>
    </q-banner>

    <q-list bordered separator dense class="rounded-borders">
      <q-item
        v-for="deal in dealStore.deals"
        :key="deal.id"
        clickable
        v-ripple
        :to="{ name: 'front_deal', params: { id: deal.id } }"
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
import { ref, onMounted } from 'vue'
import { useDealStore } from '../stores/deal-store'

const dealStore = useDealStore()

// Places API AIzaSyD7NL9oNrApHfBlz1YL52_QoHcJYDvpHGQ

// const placeInput = ref('')
const selectedPlace = ref(null)
const autocompleteInput = ref(null)

const searchAddress = ref(false)

onMounted(() => {
  if (!window.google) {
    console.error('Google Maps JavaScript API is not loaded.')
    return
  }

  // eslint-disable-next-line no-undef
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
    types: ['establishment'], // Specify the type of place (optional)
    // fields: ['ALL']
    fields: ['place_id', 'name', 'formatted_address', 'geometry'] // Specify the data you want
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place) {
      selectedPlace.value = place
      // Calculate the center of the viewport
      const lat = (place.geometry.viewport.ii.lo + place.geometry.viewport.ii.hi) / 2
      const lng = (place.geometry.viewport.Gh.lo + place.geometry.viewport.Gh.hi) / 2
      console.log(lat, lng)
      searchAddress.value = false
    } else {
      console.error('No place details available.')
    }
  })
})

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
