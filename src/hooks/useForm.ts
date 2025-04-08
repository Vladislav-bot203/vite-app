import { computed, ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

export default function useForm() {
  const isLogin = ref<boolean>(true)
  const isLoading = ref<boolean>(false)
  const router = useRouter()
  const toast = useToast()

  const subtitleText = computed<string>(() => {
    return isLogin.value ? 'Аккаунта еще нет?' : 'Уже есть аккаунт?'
  })

  const linkAccountText = computed<string>(() => {
    return isLogin.value ? 'Создайте сейчас' : 'Войдите в него'
  })

  const submitButtonText = computed<string>(() => {
    return isLogin.value ? 'Вход' : 'Регистрация'
  })

  const toggleAuth = () => {
    isLogin.value = !isLogin.value
  }

  const signUp = async function (): Promise<void> {
    isLoading.value = true
    try {
      await createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      router.push('/')
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 5000 })
      }
    } finally {
      isLoading.value = false
    }
  }

  const signIn = async function (): Promise<void> {
    isLoading.value = true
    try {
      await signInWithEmailAndPassword(getAuth(), email.value, password.value)
      router.push('/')
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 5000 })
      }
    } finally {
      isLoading.value = false
    }
  }
  const submitForm = (): void => {
    if (isLogin.value) {
      signIn()
    } else {
      signUp()
    }
  }

  const email = ref<string>('')
  const password = ref<string>('')

  return {
    isLoading,
    email,
    password,
    submitForm,
    toggleAuth,
    submitButtonText,
    linkAccountText,
    subtitleText
  }
}
