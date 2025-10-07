<script setup lang="ts">
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    const error = err as { code?: string }
    console.error('Login error:', error)

    // エラーメッセージを日本語化
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'メールアドレスの形式が正しくありません'
        break
      case 'auth/user-disabled':
        errorMessage.value = 'このアカウントは無効化されています'
        break
      case 'auth/user-not-found':
        errorMessage.value = 'ユーザーが見つかりません'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'パスワードが正しくありません'
        break
      case 'auth/invalid-credential':
        errorMessage.value = 'メールアドレスまたはパスワードが正しくありません'
        break
      default:
        errorMessage.value = 'ログインに失敗しました。もう一度お試しください'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="logo-container">
      <img src="@/assets/img/web-wg-logo.png" alt="WebWG ロゴ" class="logo" />
    </div>

    <div class="login-card">
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">ログインID（メールアドレス）</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="example@email.com"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">パスワード</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="パスワードを入力"
              :disabled="isLoading"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePasswordVisibility"
              :disabled="isLoading"
              :aria-label="showPassword ? 'パスワードを隠す' : 'パスワードを表示'"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'ログイン中...' : 'はじめる' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f6f2;
  padding: 20px;
  gap: 24px;
}

.logo-container {
  text-align: center;
}

.logo {
  width: 100%;
  max-width: 320px;
  height: auto;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.3),
    0px 8px 12px 6px rgba(0, 0, 0, 0.15);
  padding: 48px;
  width: 100%;
  max-width: 440px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #414943;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  font-weight: 500;
}

.form-group input {
  padding: 14px 16px;
  border: 1px solid #717972;
  border-radius: 12px;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  width: 100%;
  background-color: #f7faf5;
  color: #181d19;
}

.form-group input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 1px #42b883;
  background-color: white;
}

.form-group input:disabled {
  background-color: #e5e8e3;
  cursor: not-allowed;
  opacity: 0.6;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #717972;
  transition: color 0.2s;
  border-radius: 8px;
}

.password-toggle:hover:not(:disabled) {
  color: #42b883;
  background-color: rgba(66, 184, 131, 0.08);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.error-message {
  background-color: #f9dedc;
  color: #410e0b;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.25px;
  text-align: center;
  border: 1px solid #f2b8b5;
}

.login-button {
  background: #42b883;
  color: #003d2b;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.3),
    0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.login-button:hover:not(:disabled) {
  background: #35835b;
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.3),
    0px 2px 6px 2px rgba(0, 0, 0, 0.15);
}

.login-button:active:not(:disabled) {
  background: #1b6b4a;
  box-shadow:
    0px 1px 3px 0px rgba(0, 0, 0, 0.3),
    0px 4px 8px 3px rgba(0, 0, 0, 0.15);
}

.login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #c1c9c1;
  color: #414943;
}
</style>
