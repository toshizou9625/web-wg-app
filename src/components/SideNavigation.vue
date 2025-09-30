<template>
  <nav class="w-80 bg-md-surface-container h-screen overflow-y-auto border-r border-md-outline-variant shadow-md-elevation-1">
    <div class="p-6">
      <!-- App Title -->
      <div class="mb-8">
        <h1 class="text-md-headline-small font-medium text-md-on-surface">WebWG Vue</h1>
        <p class="text-md-body-small text-md-on-surface-variant mt-1">Vue.js 学習管理アプリ</p>
      </div>
      
      <!-- Primary Navigation -->
      <div class="mb-8">
        <div class="space-y-2">
          <router-link
            to="/"
            class="flex items-center px-4 py-3 rounded-md-lg transition-all duration-200 text-md-label-large"
            :class="$route.name === 'dashboard' ? 
              'bg-md-secondary-container text-md-on-secondary-container' : 
              'text-md-on-surface hover:bg-md-on-surface/8 active:bg-md-on-surface/12'"
          >
            <span class="w-6 h-6 mr-3 flex items-center justify-center text-lg">📊</span>
            <span>ダッシュボード</span>
          </router-link>

          <router-link
            to="/calendar"
            class="flex items-center px-4 py-3 rounded-md-lg transition-all duration-200 text-md-label-large"
            :class="$route.name === 'calendar' ? 
              'bg-md-secondary-container text-md-on-secondary-container' : 
              'text-md-on-surface hover:bg-md-on-surface/8 active:bg-md-on-surface/12'"
          >
            <span class="w-6 h-6 mr-3 flex items-center justify-center text-lg">📅</span>
            <span>カレンダー</span>
          </router-link>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-md-outline-variant mb-6"></div>

      <!-- Sections -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-md-title-small font-medium text-md-on-surface-variant">
            学習セクション
          </h2>
          <button
            @click="addNewSection"
            class="w-10 h-10 rounded-md-full bg-md-primary-container text-md-on-primary-container hover:shadow-md-elevation-2 transition-all duration-200 flex items-center justify-center"
            title="セクション追加"
          >
            <span class="text-lg">＋</span>
          </button>
        </div>

        <div class="space-y-1 max-h-96 overflow-y-auto">
          <div
            v-for="section in sections"
            :key="section.id"
            class="group relative"
          >
            <router-link
              :to="`/section/${section.id}`"
              class="flex items-center justify-between px-4 py-3 rounded-md-lg transition-all duration-200 text-md-body-medium"
              :class="currentSectionId === section.id ? 
                'bg-md-secondary-container text-md-on-secondary-container' : 
                'text-md-on-surface hover:bg-md-on-surface/8 active:bg-md-on-surface/12'"
            >
              <div class="flex items-center min-w-0 flex-1">
                <span class="w-6 h-6 mr-3 flex items-center justify-center text-sm rounded-md-xs bg-md-primary-container text-md-on-primary-container">
                  📝
                </span>
                <span class="truncate">{{ section.title || '無題のセクション' }}</span>
              </div>
              <button
                @click.prevent="deleteSection(section.id)"
                class="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-md-full hover:bg-md-error-container text-md-error hover:text-md-on-error-container transition-all duration-200 flex items-center justify-center ml-2"
                title="削除"
              >
                <span class="text-sm">✕</span>
              </button>
            </router-link>
          </div>
          
          <div v-if="sections.length === 0" class="px-4 py-8 text-center">
            <p class="text-md-body-small text-md-on-surface-variant">
              まだセクションがありません
            </p>
            <p class="text-md-body-small text-md-on-surface-variant mt-1">
              ➕ ボタンで追加してください
            </p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSectionsStore } from '@/stores/sections'

const router = useRouter()
const sectionsStore = useSectionsStore()

const sections = computed(() => sectionsStore.sections)
const currentSectionId = computed(() => sectionsStore.currentSectionId)

async function addNewSection() {
  try {
    const section = await sectionsStore.addSection('新しい学習セクション')
    router.push(`/section/${section.id}`)
  } catch (error) {
    console.error('Failed to create section:', error)
  }
}

async function deleteSection(sectionId: string) {
  if (confirm('このセクションを削除しますか？')) {
    try {
      await sectionsStore.deleteSection(sectionId)
    } catch (error) {
      console.error('Failed to delete section:', error)
      alert('削除に失敗しました。もう一度お試しください。')
    }
  }
}

// ナビゲーション初期化時にFirebaseからセクションデータを取得
onMounted(async () => {
  try {
    await sectionsStore.initializeFromFirebase()
  } catch (error) {
    console.error('Failed to load sections in navigation:', error)
  }
})
</script>