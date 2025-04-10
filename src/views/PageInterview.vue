<template>
  <app-progress v-if="isLoading"></app-progress>
  <div class="content-interview" v-else-if="interview?.id && !isLoading">
    <app-card>
      <template #title>Собеседование в компанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Компания</label>
          <app-input-text
            class="input mb-3"
            id="company"
            v-model="interview.company"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии</label>
          <app-input-text
            class="input mb-3"
            id="vacancyLink"
            v-model="interview.vacancyLink"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт</label>
          <app-input-text
            class="input mb-3"
            id="hrName"
            v-model="interview.hrName"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Телеграм</label>
          <app-input-text
            class="input mb-3"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactWhatsapp">WhatsApp</label>
          <app-input-text
            class="input mb-3"
            id="contactWhatsapp"
            v-model="interview.contactWhatsApp"
          ></app-input-text>
        </div>
        <div class="flex flex-column gap-2">
          <label for="contactPhone">Номер телефона</label>
          <app-input-text
            class="input mb-3"
            id="contactPhone"
            v-model="interview.contactPhone"
          ></app-input-text>
        </div>
        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              inputId="salaryFrom"
              placeholder="Зарплатная вилка от"
              v-model="interview.salaryFrom"
            ></app-input-number>
          </div>
          <div class="flex-auto">
            <app-input-number
              inputId="salaryTo"
              placeholder="Зарплатная вилка до"
              v-model="interview.salaryTo"
            ></app-input-number>
          </div>
        </div>

        <app-button
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="addStage"
        />
        <template v-if="interview.stages">
          <div class="interview-stage" v-for="(stage, index) in interview.stages" :key="index">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name" />
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-calendar-${index}`">Дата прохождения этапа</label>
              <app-calendar
                class="input mb-3"
                :id="`stage-calendar-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              ></app-calendar>
            </div>
            <div class="flex flex-column gap-2">
              <label :for="`stage-area-${index}`">Комментарий</label>
              <app-textarea
                :id="`stage-area-${index}`"
                class="input mb-3"
                rows="5"
                v-model="stage.description"
              ></app-textarea>
            </div>
            <app-button severity="danger" label="Удалить этап" @click="removeStage"></app-button>
          </div>
        </template>
        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-item-center">
            <app-radiobutton
              inputId="interviewResult1"
              name="result"
              value="Refusal"
              v-model="interview.result"
            ></app-radiobutton>
            <label for="interviewResult1" class="ml-2">Отказ</label>
          </div>
          <div class="flex align-item-center">
            <app-radiobutton
              inputId="interviewResult2"
              name="result"
              value="Offer"
              v-model="interview.result"
            ></app-radiobutton>
            <label for="interviewResult2" class="ml-2">Offer</label>
          </div>
          <div>
            <app-button label="Сохранить" icon="pi pi-save" @click="saveInterview"></app-button>
          </div>
        </div>
      </template>
    </app-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import useUserStore from '@/stores/user-storage'
import type Interview from '@/types/interview'
import { useRoute } from 'vue-router'
import type Stage from '@/types/stage'

const db = getFirestore()
const userStore = useUserStore()
const interview = ref<Interview>()
const route = useRoute()
const isLoading = ref<boolean>(true)

const docRef = doc(db, `users/${userStore.userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data() as Interview

    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: Stage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return { ...stage, date: stage.date.toDate()}
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}

onMounted(async () => await getData())

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  
  await updateDoc(docRef, { ...interview.value })
  await getData()
  isLoading.value = false
}
</script>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}

.input {
  width: 100%;
}

.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
