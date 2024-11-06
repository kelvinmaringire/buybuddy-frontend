import { defineStore } from 'pinia'
import { api } from '../boot/axios.js'

export const useDealStore = defineStore('deal', {
  state: () => ({
    stores: [],
    deals: [],
    shopping_list: []

  }),

  getters: {

  },

  actions: {
    async fetchStores () {
      const response = await api.get('stores/')
      this.stores = response.data
    },
    async fetchDeals () {
      const response = await api.get('stores/deal/')
      this.deals = response.data
    },
    async fetchShoppingList () {
      const response = await api.get('stores/shopping_list/')
      this.shopping_list = response.data
    },
    async addToShoppingList (shoppingCartId, dealId) {
      const list = this.shopping_list.find((li) => li.id === shoppingCartId)
      list.deals.push(dealId)
      const response = await api.put(`stores/shopping_list/${shoppingCartId}/`, list)
      console.log(response.data)
    },
    async removeFromShoppingList (shoppingCartId, dealId) {
      const list = this.shopping_list.find((li) => li.id === shoppingCartId)
      const index = list.deals.indexOf(dealId)
      list.deals.splice(index, 1)
      const response = await api.put(`stores/shopping_list/${shoppingCartId}/`, list)
      console.log(response.data)
    }

  }
})
