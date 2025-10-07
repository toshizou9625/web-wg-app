<template>
  <div class="p-4 sm:p-6 bg-md-surface-bright min-h-screen pt-20 lg:pt-6">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="calendarStore.isInitializing"
      overlay
      fullscreen
      text="カレンダーデータを読み込み中..."
      show-text
    />

    <div class="mb-8">
      <h1 class="text-md-headline-medium sm:text-md-display-small font-normal text-md-on-surface mb-2">カレンダー</h1>
      <p class="text-md-body-medium sm:text-md-body-large text-md-on-surface-variant">スケジュールと予定を管理</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- カレンダー表示 -->
      <div class="lg:col-span-2">
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 border border-md-outline-variant"
        >
          <!-- カレンダーヘッダー -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-md-outline-variant">
            <div class="flex items-center justify-center space-x-2 sm:space-x-4">
              <button
                @click="previousMonth"
                class="w-10 h-10 rounded-md-full hover:bg-md-on-surface/8 transition-all duration-200 flex items-center justify-center text-md-on-surface"
              >
                ◀
              </button>
              <h2 class="text-md-title-medium sm:text-md-title-large font-normal text-md-on-surface">
                {{ currentMonthText }}
              </h2>
              <button
                @click="nextMonth"
                class="w-10 h-10 rounded-md-full hover:bg-md-on-surface/8 transition-all duration-200 flex items-center justify-center text-md-on-surface"
              >
                ▶
              </button>
            </div>
            <button
              @click="goToToday"
              class="w-full sm:w-auto px-4 py-2 bg-md-primary text-md-on-primary rounded-md-full hover:shadow-md-elevation-2 transition-all duration-200 text-md-label-medium font-medium"
            >
              今日
            </button>
          </div>

          <!-- カレンダーグリッド -->
          <div class="p-3 sm:p-6">
            <!-- 曜日ヘッダー -->
            <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
              <div
                v-for="day in dayNames"
                :key="day"
                class="p-1 sm:p-3 text-center text-md-label-small sm:text-md-label-medium font-medium text-md-on-surface-variant"
              >
                {{ day }}
              </div>
            </div>

            <!-- 日付グリッド -->
            <div class="grid grid-cols-7 gap-1 sm:gap-2">
              <div
                v-for="date in calendarDates"
                :key="date.dateString"
                class="min-h-16 sm:min-h-24 p-1 sm:p-2 border-2 rounded-md-xs cursor-pointer transition-all duration-200"
                :class="{
                  'bg-md-surface-container-high': !date.isCurrentMonth,
                  'bg-md-primary-container': date.isToday,
                  'bg-md-tertiary-container/30': getEventsForDate(date.dateString).length > 0,
                  'hover:bg-md-on-surface/8': date.isCurrentMonth && !date.isToday,
                  'border-md-on-surface': date.isSelected,
                  'border-md-outline-variant': !date.isSelected,
                }"
                @click="selectDate(date)"
              >
                <div
                  class="text-xs sm:text-md-body-small font-medium mb-1 sm:mb-2"
                  :class="{
                    'text-md-on-surface-variant': !date.isCurrentMonth,
                    'text-md-on-primary-container': date.isToday,
                    'text-md-on-surface': date.isCurrentMonth && !date.isToday,
                  }"
                >
                  {{ date.day }}
                </div>
                <div class="space-y-1 hidden sm:block">
                  <div
                    v-for="event in getEventsForDate(date.dateString).slice(0, 2)"
                    :key="event.id"
                    class="text-md-label-small bg-md-primary text-md-on-primary rounded-md-xs px-2 py-1 truncate"
                    :title="event.title"
                  >
                    {{ event.title }}
                  </div>
                  <div
                    v-if="getEventsForDate(date.dateString).length > 2"
                    class="text-md-label-small text-md-on-surface-variant"
                  >
                    +{{ getEventsForDate(date.dateString).length - 2 }}件
                  </div>
                </div>
                <!-- モバイル用のドット表示 -->
                <div v-if="getEventsForDate(date.dateString).length > 0" class="flex justify-center sm:hidden">
                  <div class="w-1.5 h-1.5 rounded-full bg-md-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側パネル -->
      <div class="space-y-6">
        <!-- 予定追加フォーム -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <h3 class="text-md-title-medium font-medium text-md-on-surface mb-6">
            {{ editingEvent ? '予定編集' : '新規予定' }}
          </h3>
          <div class="space-y-6">
            <div>
              <label class="block text-md-label-large text-md-on-surface-variant mb-2">
                日付
              </label>
              <input
                v-model="eventForm.date"
                type="date"
                class="w-full p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface text-md-body-large"
              />
            </div>
            <div>
              <label class="block text-md-label-large text-md-on-surface-variant mb-2">
                タイトル
              </label>
              <input
                v-model="eventForm.title"
                type="text"
                class="w-full p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large"
                placeholder="予定のタイトルを入力"
              />
            </div>
            <div>
              <label class="block text-md-label-large text-md-on-surface-variant mb-2">
                メモ
              </label>
              <textarea
                ref="memoTextarea"
                v-model="memoInput"
                rows="3"
                class="w-full p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large resize-none"
                placeholder="詳細やメモを入力（任意）"
              ></textarea>
            </div>
            <div class="flex space-x-3">
              <LoadingButton
                @click="saveEvent"
                :loading="editingEvent ? calendarStore.isSaving : calendarStore.isLoading"
                :text="editingEvent ? '更新' : '追加'"
                :loading-text="editingEvent ? '更新中...' : '追加中...'"
                variant="primary"
                class="flex-1"
              />
              <LoadingButton
                v-if="editingEvent"
                @click="deleteCurrentEvent"
                :loading="calendarStore.isDeleting"
                text="削除"
                loading-text="削除中..."
                variant="error"
              />
              <button
                v-if="editingEvent"
                @click="cancelEdit"
                class="px-6 py-3 border border-md-outline text-md-on-surface rounded-md-full hover:bg-md-on-surface/8 transition-all duration-200 text-md-label-large font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>

        <!-- 選択日の予定一覧 -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <h3 class="text-md-title-medium font-medium text-md-on-surface mb-6">
            {{ selectedDateText }}の予定
          </h3>
          <div v-if="selectedDateEvents.length === 0" class="text-center py-8">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-md-lg bg-md-surface-container-high text-md-on-surface-variant flex items-center justify-center"
            >
              <span class="text-xl">📅</span>
            </div>
            <p class="text-md-body-medium text-md-on-surface-variant">予定がありません</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="event in selectedDateEvents"
              :key="event.id"
              class="p-4 border-2 rounded-md-lg cursor-pointer transition-all duration-200"
              :class="{
                'border-md-primary bg-md-primary-container': editingEvent?.id === event.id,
                'border-md-outline-variant hover:bg-md-on-surface/8': editingEvent?.id !== event.id,
              }"
              @click="editEvent(event)"
            >
              <div class="flex items-center justify-between">
                <h4
                  class="text-md-body-large font-medium"
                  :class="{
                    'text-md-on-primary-container': editingEvent?.id === event.id,
                    'text-md-on-surface': editingEvent?.id !== event.id,
                  }"
                >
                  {{ event.title }}
                </h4>
                <button
                  @click.stop="deleteEvent(event.id)"
                  class="w-8 h-8 rounded-md-full text-md-error hover:bg-md-error-container transition-all duration-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <p
                v-if="event.memo"
                class="text-md-body-medium mt-2"
                :class="{
                  'text-md-on-primary-container': editingEvent?.id === event.id,
                  'text-md-on-surface-variant': editingEvent?.id !== event.id,
                }"
              >
                {{ event.memo }}
              </p>
            </div>
          </div>
        </div>

        <!-- 今日の予定 -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <h3 class="text-md-title-medium font-medium text-md-on-surface mb-6">今日の予定</h3>
          <div v-if="todayEvents.length === 0" class="text-center py-8">
            <div
              class="w-12 h-12 mx-auto mb-4 rounded-md-lg bg-md-surface-container-high text-md-on-surface-variant flex items-center justify-center"
            >
              <span class="text-xl">☀️</span>
            </div>
            <p class="text-md-body-medium text-md-on-surface-variant">今日の予定はありません</p>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="event in todayEvents"
              :key="event.id"
              class="p-4 bg-md-primary-container rounded-md-lg border border-md-primary"
            >
              <h4 class="text-md-body-large font-medium text-md-on-primary-container">
                {{ event.title }}
              </h4>
              <p v-if="event.memo" class="text-md-body-medium text-md-on-primary-container/80 mt-1">
                {{ event.memo }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useCalendarStore } from '@/stores/calendar'
import type { CalendarEvent } from '@/types'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { useTextareaAutosize } from '@vueuse/core'

const calendarStore = useCalendarStore()

const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const editingEvent = ref<CalendarEvent | null>(null)

// Autosizeのtextareaリファレンス
const { textarea: memoTextarea, input: memoInput } = useTextareaAutosize()

const eventForm = reactive({
  date: '',
  title: '',
})

const dayNames = ['日', '月', '火', '水', '木', '金', '土']

const currentMonthText = computed(() => format(currentDate.value, 'yyyy年MM月', { locale: ja }))
const selectedDateText = computed(() => format(selectedDate.value, 'MM月dd日', { locale: ja }))

const calendarDates = computed(() => {
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const selectedDateString = format(selectedDate.value, 'yyyy-MM-dd')

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map((date) => ({
    date,
    day: format(date, 'd'),
    dateString: format(date, 'yyyy-MM-dd'),
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    isSelected: format(date, 'yyyy-MM-dd') === selectedDateString,
  }))
})

const selectedDateEvents = computed(() =>
  calendarStore.getEventsForDate(format(selectedDate.value, 'yyyy-MM-dd'))
)
const todayEvents = computed(() =>
  calendarStore.getEventsForDate(format(new Date(), 'yyyy-MM-dd'))
)

const getEventsForDate = (dateString: string) => calendarStore.getEventsForDate(dateString)

const selectDate = (dateInfo: { date: Date; dateString: string }) => {
  selectedDate.value = dateInfo.date
  eventForm.date = dateInfo.dateString
}

const previousMonth = () => currentDate.value = subMonths(currentDate.value, 1)
const nextMonth = () => currentDate.value = addMonths(currentDate.value, 1)

const goToToday = () => {
  const today = new Date()
  currentDate.value = today
  selectedDate.value = today
  eventForm.date = format(today, 'yyyy-MM-dd')
}

const resetForm = () => {
  eventForm.title = ''
  memoInput.value = ''
  eventForm.date = format(selectedDate.value, 'yyyy-MM-dd')
}

const saveEvent = () => {
  if (!eventForm.title.trim() || !eventForm.date) return

  if (editingEvent.value) {
    calendarStore.updateEvent(editingEvent.value.id, {
      date: eventForm.date,
      title: eventForm.title.trim(),
      memo: memoInput.value.trim(),
    })
    editingEvent.value = null
  } else {
    calendarStore.addEvent(eventForm.date, eventForm.title.trim(), memoInput.value.trim())
  }
  resetForm()
}

const editEvent = (event: CalendarEvent) => {
  editingEvent.value = event
  eventForm.date = event.date
  eventForm.title = event.title
  memoInput.value = event.memo
}

const deleteCurrentEvent = () => {
  if (editingEvent.value && confirm('この予定を削除しますか？')) {
    calendarStore.deleteEvent(editingEvent.value.id)
    editingEvent.value = null
    resetForm()
  }
}

const deleteEvent = (eventId: string) => {
  if (confirm('この予定を削除しますか？')) {
    calendarStore.deleteEvent(eventId)
  }
}

const cancelEdit = () => {
  editingEvent.value = null
  resetForm()
}

onMounted(async () => {
  try {
    await calendarStore.initializeFromFirebase()
  } catch (error) {
    console.error('Failed to load calendar data from Firebase:', error)
  }
  eventForm.date = format(selectedDate.value, 'yyyy-MM-dd')
})
</script>
