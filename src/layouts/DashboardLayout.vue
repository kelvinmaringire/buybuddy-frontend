<template>
  <q-layout view="hhh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-primary text-white">
      <q-toolbar class="justify-center">
        <q-tabs
        no-caps
        justify="center"
        class="text-white q-pb-xs"
      >
        <q-route-tab :to="{ name: 'dashboard'}" icon="local_offer" label="Deals" />
        <q-route-tab :to="{ name: 'cart'}" icon="shopping_cart" label="Cart" />
        <q-route-tab :to="{ name: 'requests'}" icon="swap_horiz" label="Requests" />
        <q-route-tab :to="{ name: 'buddy'}" icon="people" label="Buddy" />
        <q-route-tab :to="{ name: 'account'}" icon="account_circle" label="Account" />
      </q-tabs>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>

</script>
