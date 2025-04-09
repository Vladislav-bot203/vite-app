import { ref, computed } from 'vue'
import type Interview from '@/types/interview'
import { v4 as uuidv4 } from 'uuid'
import { getFirestore, setDoc, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user-storage'

export default function usePostForm() {
  const company = ref<string>('')
  const vacancyLink = ref<string>('')
  const hrName = ref<string>('')
  const contactTelegram = ref<string>('')
  const contactWhatsApp = ref<string>('')
  const contactPhone = ref<string>('')
  const loading = ref<boolean>(false)
  const db = getFirestore()
  const router = useRouter()
  const userStore = useUserStore()

  async function addNewInterview(): Promise<void> {
    loading.value = true
    const payload: Interview = {
      id: uuidv4(),
      company: company.value,
      vacancyLink: vacancyLink.value,
      hrName: hrName.value,
      contactTelegram: contactTelegram.value,
      contactPhone: contactPhone.value,
      contactWhatsApp: contactWhatsApp.value,
      createdAt: new Date()
    }

    const userId = userStore.userId

    if (userId) {
      await setDoc(doc(db, `users/${userId}/interviews`, payload.id), payload).then(() => {
        router.push('/list')
      })
    }
  }

  const disabledSaveButton = computed<boolean>(() => {
    return !(company.value && vacancyLink.value && hrName.value)
  })

  return {
    disabledSaveButton,
    addNewInterview,
    loading,
    contactPhone,
    contactWhatsApp,
    contactTelegram,
    hrName,
    vacancyLink,
    company
  }
}
