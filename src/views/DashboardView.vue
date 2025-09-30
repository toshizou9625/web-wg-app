<template>
  <div class="p-6 bg-md-surface-bright min-h-screen">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="isInitializing" 
      overlay 
      fullscreen 
      text="データを読み込み中..."
      show-text
    />
    
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-md-display-small font-normal text-md-on-surface mb-2">ダッシュボード</h1>
      <p class="text-md-body-large text-md-on-surface-variant">Web WG グループワークの学習内容とスケジュールを管理</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-md-lg bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
            <span class="text-xl">📝</span>
          </div>
          <div class="ml-4">
            <p class="text-md-label-medium text-md-on-surface-variant">学習セクション</p>
            <p class="text-md-display-small font-normal text-md-on-surface">{{ totalSectionCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-md-lg bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center">
            <span class="text-xl">📅</span>
          </div>
          <div class="ml-4">
            <p class="text-md-label-medium text-md-on-surface-variant">カレンダー予定</p>
            <p class="text-md-display-small font-normal text-md-on-surface">{{ calendarEventCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Sections -->
    <div class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 border border-md-outline-variant mb-8">
      <div class="px-6 py-4">
        <h2 class="text-md-title-large font-normal text-md-on-surface">最近のセクション</h2>
      </div>
      <div class="px-6 pb-6">
        <div v-if="recentSections.length === 0" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 rounded-md-lg bg-md-surface-container-high text-md-on-surface-variant flex items-center justify-center">
            <span class="text-2xl">📝</span>
          </div>
          <p class="text-md-body-medium text-md-on-surface-variant mb-2">まだセクションがありません</p>
          <p class="text-md-body-small text-md-on-surface-variant">サイドバーから新しいセクションを作成してください</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="section in recentSections"
            :key="section.id"
            class="flex items-center justify-between p-4 rounded-md-lg hover:bg-md-on-surface/8 transition-all duration-200"
          >
            <div class="flex items-center min-w-0 flex-1">
              <div class="w-10 h-10 mr-4 rounded-md-lg bg-md-primary-container text-md-on-primary-container flex items-center justify-center">
                <span class="text-lg">📝</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-md-title-medium text-md-on-surface font-medium truncate">{{ section.title }}</h3>
                <p class="text-md-body-small text-md-on-surface-variant">
                  学習セクション • {{ formatDate(section.updatedAt) }}
                </p>
              </div>
            </div>
            <router-link
              :to="`/section/${section.id}`"
              class="ml-4 px-6 py-2 bg-md-primary text-md-on-primary rounded-md-full hover:shadow-md-elevation-2 transition-all duration-200 text-md-label-large font-medium"
            >
              開く
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 border border-md-outline-variant">
      <div class="px-6 py-4">
        <h2 class="text-md-title-large font-normal text-md-on-surface">クイックアクション</h2>
      </div>
      <div class="px-6 pb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingButton
            @click="createNewSection"
            :loading="sectionsStore.isLoading"
            text="新しいセクション作成"
            loading-text="作成中..."
            variant="primary"
            class="flex items-center p-6 border-2 border-dashed border-md-outline rounded-md-xl hover:border-md-primary hover:bg-md-primary-container/20 transition-all duration-200 group w-full"
          >
            <div class="w-12 h-12 mr-4 rounded-md-lg bg-md-primary-container text-md-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span class="text-xl">📝</span>
            </div>
            <div class="text-left">
              <p class="text-md-title-medium font-medium text-md-on-surface">新しいセクション作成</p>
              <p class="text-md-body-small text-md-on-surface-variant">学習コンテンツと振り返りを追加</p>
            </div>
          </LoadingButton>

          <router-link
            to="/calendar"
            class="flex items-center p-6 border-2 border-dashed border-md-outline rounded-md-xl hover:border-md-tertiary hover:bg-md-tertiary-container/20 transition-all duration-200 group"
          >
            <div class="w-12 h-12 mr-4 rounded-md-lg bg-md-tertiary-container text-md-on-tertiary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span class="text-xl">📅</span>
            </div>
            <div class="text-left">
              <p class="text-md-title-medium font-medium text-md-on-surface">カレンダーを開く</p>
              <p class="text-md-body-small text-md-on-surface-variant">予定を確認・編集</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSectionsStore } from '@/stores/sections'
import { useCalendarStore } from '@/stores/calendar'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import LoadingButton from '@/components/LoadingButton.vue'

const router = useRouter()
const sectionsStore = useSectionsStore()
const calendarStore = useCalendarStore()

const isInitializing = ref(false)

const totalSectionCount = computed(() => sectionsStore.sections.length)

const calendarEventCount = computed(() => calendarStore.events.length)

const recentSections = computed(() => 
  sectionsStore.sections
    .slice()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)
)

function formatDate(date: Date) {
  return format(date, 'MM月dd日 HH:mm', { locale: ja })
}

async function createNewSection() {
  try {
    const section = await sectionsStore.addSection('新しい学習セクション')
    router.push(`/section/${section.id}`)
  } catch (error) {
    console.error('Failed to create section:', error)
    alert('セクションの作成に失敗しました。もう一度お試しください。')
  }
}

// ページ初期化時にFirebaseからデータを取得
async function initializePage() {
  isInitializing.value = true
  try {
    await Promise.all([
      sectionsStore.initializeFromFirebase(),
      calendarStore.initializeFromFirebase()
    ])
  } catch (error) {
    console.error('Failed to initialize page data:', error)
  } finally {
    isInitializing.value = false
  }
}

// ページマウント時に初期化を実行
onMounted(() => {
  initializePage()
})
</script>