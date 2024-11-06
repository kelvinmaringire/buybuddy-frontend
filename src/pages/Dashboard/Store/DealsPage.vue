<template>
  <q-page padding>
    <h4>Deals</h4>
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
import { useDealStore } from '../../../stores/deal-store'

const dealStore = useDealStore()

</script>
