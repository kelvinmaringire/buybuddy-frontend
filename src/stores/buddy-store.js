import { defineStore } from 'pinia'
import { api } from '../boot/axios.js'

export const useBuddyStore = defineStore('buddy', {
  state: () => ({
    buddy_requests: [],
    buddies: [],
    review_buddies: [],
    notifications: []

  }),

  getters: {

  },

  actions: {
    async fetchBuddyRequests () {
      const response = await api.get('buddy_requests/')
      this.buddy_requests = response.data
    },
    async fetchBuddies () {
      const response = await api.get('buddy_requests/buddy/')
      this.buddies = response.data
    },
    async fetchReviewBuddies () {
      const response = await api.get('buddy_requests/review/')
      this.review_buddies = response.data
    },
    async fetchNotifications () {
      const response = await api.get('buddy_requests/notification/')
      this.notifications = response.data
    }

  }
})
