<template>
  <h2>Статистика</h2>
  <div class="card flex justify-center">
    <app-chart
      type="doughnut"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import useUserStore from '@/stores/user-storage'
import type Interview from '@/types/interview'

const userStore = useUserStore()
const db = getFirestore()
const interviews = ref<Interview[]>([])
const chartData = ref()
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
      }
    }
  },
  cutout: '60%'
})

const colors = {
  offer: '#06b6d4', 
  refusal: '#f97316',
  pending: '#6b7280' 
}

const hoverColors = {
  offer: '#22d3ee', 
  refusal: '#fb923c', 
  pending: '#9ca3af'   
}

const getAllInteviews = async <T extends Interview>(): Promise<T[]> => {
  let getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc')
  )

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

onMounted(async () => {
  interviews.value = await getAllInteviews()
  chartData.value = setChartData()
})

const setChartData = () => {

  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: Interview) => {
    if (interview.result === 'Offer') {
      data[0] += 1
    } else if (interview.result === 'Refusal') {
      data[1] += 1
    } else {
      data[2] += 1
    }
  })

  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data: data,
        backgroundColor: [colors.offer, colors.refusal, colors.pending],
        hoverBackgroundColor: [hoverColors.offer, hoverColors.refusal, hoverColors.pending],
        borderWidth: 0
      }
    ]
  }
}
</script>
