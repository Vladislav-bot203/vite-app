<template>
  <app-confirm></app-confirm>
  <app-progress v-if="isLoading"></app-progress>
  <app-message v-else-if="!isLoading && !interviews.length" severity="info">Нет добавленных собеседований</app-message>
  <div v-else>
    <h2>Список собеседований</h2>
    <app-data-table :value="interviews">
      <app-column-table field="company" header="Компания"></app-column-table>
      <app-column-table field="hrName" header="Имя HR"></app-column-table>
      <app-column-table field="vacancyLink" header="Ссылка на вакансию">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{ slotProps.data.vacancyLink }}</a>
        </template>
      </app-column-table>
      <app-column-table header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
            >
              <span class="contacts__icon pi pi-telegram"></span>
            </a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
            >
              <span class="contacts__icon pi pi-whatsapp"></span>
            </a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
            >
              <span class="contacts__icon pi pi-phone"></span>
            </a>
          </div>
        </template>
      </app-column-table>
      <app-column-table>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info"></app-button>
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            ></app-button>
          </div>
        </template>
      </app-column-table>
    </app-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'
import useUserStore from '@/stores/user-storage'
import type Interview from '@/types/interview'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<Interview[]>([])
const isLoading = ref<boolean>(true)

const getAllInteviews = async <T extends Interview>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc')
  )

  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы хотите удалить собеседование?',
    header: 'Удаление собеседования',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button- p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
      interviews.value = [...await getAllInteviews()]
      isLoading.value = false
    }
  })
}

onMounted(async (): Promise<void> => {
  const listInterviews: Array<Interview> = await getAllInteviews()
  console.log(listInterviews)
  interviews.value = [...listInterviews]
  isLoading.value = false
})
</script>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
