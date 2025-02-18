<template>
  <q-page class="chat-page">
    <!-- Chat Header -->
    <q-banner dense inline-actions class="text-white bg-positive q-mb-md chat-header">
      <div class="text-h5">Chat</div>
      <template v-slot:action>
        <q-btn dense round flat icon="close" :to="{ name: 'buddy'}"></q-btn>
      </template>
    </q-banner>

    <!-- Chat Messages Container -->
    <div class="chat-content" ref="chatContainer">
      <div class="chat-messages">
        <q-chat-message
          v-for="text in chatLog"
          :key="text.id"
          :label="text.label"
          :name="text.name"
          :sent="text.sent"
          :stamp="text.stamp"
        >
          <div v-if="text.message">{{ text.message }}</div>
        </q-chat-message>

        <!-- Loading Indicator -->
        <q-chat-message name="Jane" v-if="isLoading">
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input-container">
      <q-input filled dense v-model="message" color="positive" placeholder="Message" class="chat-input">
        <template v-slot:after>
          <q-btn round dense flat color="positive" icon="send" @click="sendMessage" />
        </template>
      </q-input>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth-store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const roomName = ref(route.params.id)
const message = ref('')
const isLoading = ref(false)
let chatSocket

// Sample Chat Log
const chatLog = ref([
  { label: 'Sunday, 19th', id: 1 },
  { id: 2, name: 'Me', message: 'Hey, how are you?', sent: true, stamp: '10:00' },
  { id: 3, name: 'Jane', message: 'Doing fine, how r you?', stamp: '10:05' }
])

const chatContainer = ref(null)

// WebSocket Setup
onMounted(() => {
  chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName.value}/`)

  chatSocket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    console.log(data)
    chatLog.value.push({
      id: chatLog.value.length + 1,
      name: 'Jane',
      message: data.message,
      stamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: false
    })
  }

  chatSocket.onclose = () => {
    console.error('Chat socket closed unexpectedly')
    router.push({ name: 'buddy' })
  }
})

onBeforeUnmount(() => {
  if (chatSocket) {
    chatSocket.close()
  }
})

const sendMessage = () => {
  if (message.value.trim() && chatSocket.readyState === WebSocket.OPEN) {
    chatSocket.send(JSON.stringify({ message: message.value, roomName: roomName.value, sender: authStore.userId }))

    // Add the message immediately
    chatLog.value.push({
      id: chatLog.value.length + 1,
      name: 'Me',
      message: message.value,
      stamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true
    })

    message.value = ''
  }
}
</script>

<style scoped>
/* Chat Page Layout */
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

/* Chat Header (Stays at the Top) */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Chat Content (Scrollable Area) */
.chat-content {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 120px); /* Adjust based on header & input height */
  padding: 10px;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

/* Messages Wrapper */
.chat-messages {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* Chat Input (Stays at the Bottom) */
.chat-input-container {
  position: sticky;
  bottom: 65px;
  background: white;
  padding: 10px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
