<template>
  <q-page padding>
    <q-banner dense inline-actions class="text-white bg-primary q-mb-md">
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
    <q-list bordered separator class="q-mt-sm">
      <q-item v-for="deal in dealStore.deals" :key="deal.id" v-ripple>
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

const dealStore = useDealStore()

const dealsLength = computed(() => dealStore.deals.length)

</script>
