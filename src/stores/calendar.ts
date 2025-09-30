import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CalendarEvent } from '@/types'
import { calendarEventService } from '@/services/firestore'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  
  // ローディング状態
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const isInitializing = ref(false)

  const eventsByDate = computed(() => {
    const groupedEvents: Record<string, CalendarEvent[]> = {}
    events.value.forEach(event => {
      if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = []
      }
      groupedEvents[event.date].push(event)
    })
    return groupedEvents
  })

  async function addEvent(date: string, title: string, memo: string = '') {
    isLoading.value = true
    const now = new Date()
    const event = {
      date,
      title,
      memo,
      createdAt: now,
      updatedAt: now
    }
    
    try {
      const eventId = await calendarEventService.create(event)
      const eventWithId = { ...event, id: eventId }
      events.value.push(eventWithId)
      return eventWithId
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateEvent(eventId: string, updates: Partial<CalendarEvent>) {
    isSaving.value = true
    try {
      const updatedData = { ...updates, updatedAt: new Date() }
      await calendarEventService.update(eventId, updatedData)
      
      const index = events.value.findIndex(e => e.id === eventId)
      if (index !== -1) {
        events.value[index] = {
          ...events.value[index],
          ...updatedData
        }
      }
    } catch (error) {
      console.error('Failed to update event:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function deleteEvent(eventId: string) {
    isDeleting.value = true
    try {
      await calendarEventService.delete(eventId)
      const index = events.value.findIndex(e => e.id === eventId)
      if (index !== -1) {
        events.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  function getEventsForDate(date: string) {
    return events.value.filter(event => event.date === date)
  }

  // Firebase からすべてのカレンダーイベントを取得する初期化関数
  async function initializeFromFirebase() {
    isInitializing.value = true
    try {
      const eventsList = await calendarEventService.getAll()
      events.value = eventsList
      console.log('Calendar events loaded from Firebase:', eventsList.length)
    } catch (error) {
      console.error('Failed to load calendar events from Firebase:', error)
      throw error
    } finally {
      isInitializing.value = false
    }
  }

  return {
    events,
    eventsByDate,
    // ローディング状態
    isLoading,
    isSaving,
    isDeleting,
    isInitializing,
    // アクション
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    initializeFromFirebase
  }
})