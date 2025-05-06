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
    <!--div v-show="searchAddress">
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
    </div-->
    <!--div v-show="!searchAddress" class="q-mb-md">
      <form >
        <q-btn class="glossy" color="primary" label="Change current location" push @click="searchAddress = true" />
      </form>
      <div v-if="selectedPlace" class="q-mt-xs">
        <p><strong>Name:</strong> {{ selectedPlace.name }}</p>
        <p><strong>Address:</strong> {{ selectedPlace.formatted_address }}</p>
        <p><strong>Latitude:</strong> {{ (selectedPlace.geometry.viewport.ii.lo + selectedPlace.geometry.viewport.ii.hi) / 2 }}</p>
        <p><strong>Longitude:</strong> {{ (selectedPlace.geometry.viewport.Gh.lo + selectedPlace.geometry.viewport.Gh.hi) / 2 }}</p>
      </div>
    </div-->

    <q-list bordered separator dense>
      <q-item clickable v-ripple v-for="deal in dealStore.deals" :key="deal.id" :to="{ name: 'front_deal', params: { id: deal.id } }">
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
import { computed, ref, onMounted } from 'vue'
import { useDealStore } from '../stores/deal-store'

const dealStore = useDealStore()

const dealsLength = computed(() => dealStore.deals.length)

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
