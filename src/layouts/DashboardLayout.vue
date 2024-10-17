<template>
  <q-layout view="hhh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-primary text-white">
      <q-toolbar>
        <q-tabs
        no-caps
        class="text-white flex flex-center q-pb-xs"
      >
        <q-route-tab :to="{ name: 'dashboard'}" icon="local_offer" label="Deals" />
        <q-route-tab :to="{ name: 'cart'}" icon="shopping_cart" label="Cart" />
        <q-tab icon="swap_horiz" label="Requests" />
        <q-tab icon="people" label="Buddy" />
        <q-tab icon="account_circle" label="Profile" />
      </q-tabs>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>

</script>
