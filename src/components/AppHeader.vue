<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span class="ml-2">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <span v-if="userStore.userId" @click="userStore.userId = ''" class="flex align-items-center menu-exit">
        <span class="pi pi-sign-out p-p-menuitem-icon"></span>
        <span class="ml-2" @click="signOutMethod">Выход</span>
      </span>
    </template>
  </app-menubar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import useUserStore from '@/stores/user-storage'
import { signOut, getAuth } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

console.log(userStore.userId)

interface MenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}

const items = ref<MenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed(() => !userStore.userId)
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed(() => !!userStore.userId)
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed(() => !!userStore.userId)
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed(() => !!userStore.userId)
  }
])
</script>

<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
