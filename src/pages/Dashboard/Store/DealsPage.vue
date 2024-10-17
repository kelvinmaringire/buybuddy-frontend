<template>
  <q-page padding>
    <h4>Deals</h4>
    <q-list bordered separator class="q-mt-sm">
      <q-item v-for="deal in dealStore.deals" :key="deal.id"
      :to="{ name: 'deal', params: { id: deal.id } }" clickable v-ripple>
        <q-item-section>
          <q-img
          :src="deal.image_url"
        />
        <q-item-label class="q-mt-sm">{{ deal.description }}</q-item-label>
        <q-item-label caption>Caption</q-item-label>
        <q-item-label overline>Caption</q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-page>
</template>

<script setup>
import { useDealStore } from '../../../stores/deal-store'

const dealStore = useDealStore()

</script>
