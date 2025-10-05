import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CalendarEvent } from '@/types'
import { calendarEventService } from '@/services/firestore'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const isInitializing = ref(false)

  const eventsByDate = computed(() => {
    const groupedEvents: Record<string, CalendarEvent[]> = {}
    events.value.forEach(event => {
      if (!groupedEvents[event.date]) groupedEvents[event.date] = []
      groupedEvents[event.date].push(event)
    })
    return groupedEvents
  })

  async function addEvent(date: string, title: string, memo: string = '') {
    isLoading.value = true
    const now = new Date()

    try {
      const event = { date, title, memo, createdAt: now, updatedAt: now }
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
        events.value[index] = { ...events.value[index], ...updatedData }
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
      events.value = events.value.filter(e => e.id !== eventId)
    } catch (error) {
      console.error('Failed to delete event:', error)
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  const getEventsForDate = (date: string) => events.value.filter(event => event.date === date)

  async function initializeFromFirebase() {
    isInitializing.value = true
    try {
      events.value = await calendarEventService.getAll()
      console.log('Calendar events loaded from Firebase:', events.value.length)
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