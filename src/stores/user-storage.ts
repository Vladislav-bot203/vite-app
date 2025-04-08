import { ref } from 'vue'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', () => {
  const userId = ref<string>('')
  return { 
    userId
   }
})

export default useUserStore
