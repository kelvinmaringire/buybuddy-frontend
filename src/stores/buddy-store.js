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
    },
    async buddyRequest (buddyRequest) {
      const response = await api.post('buddy_requests/', buddyRequest)
      this.buddy_requests.push(response.data)
    },
    async acceptRequest (buddyRequest) {
      console.log(buddyRequest)
      const response = await api.put(`buddy_requests/${buddyRequest.id}/`, buddyRequest)
      const index = this.buddy_requests.indexOf(buddyRequest)
      this.buddy_requests[index] = response.data
      delete buddyRequest.id
      delete buddyRequest.status
      delete buddyRequest.created_at
      this.createBuddy(buddyRequest)
    },
    async declineRequest (buddyRequest) {
      const response = await api.put(`buddy_requests/${buddyRequest.id}/`, buddyRequest)
      const index = this.buddy_requests.indexOf(buddyRequest)
      this.buddy_requests[index] = response.data
    },
    async createBuddy (buddies) {
      const response = await api.post('buddy_requests/buddy/', buddies)
      this.buddies.push(response.data)
    }

  }
})
