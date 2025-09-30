import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  type UpdateData
} from 'firebase/firestore'
import { db } from '@/firebase'
import type { Section, ContentSection, ReflectionSection, CalendarEvent } from '@/types'

// Collection names
const COLLECTIONS = {
  SECTIONS: 'sections',
  CONTENT_SECTIONS: 'contentSections',
  REFLECTION_SECTIONS: 'reflectionSections',
  CALENDAR_EVENTS: 'calendarEvents'
} as const

// Helper functions to convert between Date and Timestamp
function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}

function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

// Section operations
export const sectionService = {
  async getAll(): Promise<Section[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.SECTIONS), orderBy('createdAt', 'desc'))
    )
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt)
      } as Section
    })
  },

  async create(section: Omit<Section, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.SECTIONS), {
      ...section,
      createdAt: dateToTimestamp(section.createdAt),
      updatedAt: dateToTimestamp(section.updatedAt)
    })
    return docRef.id
  },

  async update(id: string, updates: Partial<Section>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.SECTIONS, id)
    const updateData: UpdateData<Section> = { ...updates }
    
    if (updates.createdAt) {
      updateData.createdAt = dateToTimestamp(updates.createdAt)
    }
    if (updates.updatedAt) {
      updateData.updatedAt = dateToTimestamp(updates.updatedAt)
    }
    
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.SECTIONS, id))
  },

  onSnapshot(callback: (sections: Section[]) => void) {
    return onSnapshot(
      query(collection(db, COLLECTIONS.SECTIONS), orderBy('createdAt', 'desc')),
      (querySnapshot) => {
        const sections = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt)
          } as Section
        })
        callback(sections)
      }
    )
  }
}

// Content Section operations
export const contentSectionService = {
  async getAll(): Promise<ContentSection[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CONTENT_SECTIONS))
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt)
      } as ContentSection
    })
  },

  async getBySectionId(sectionId: string): Promise<ContentSection | null> {
    const q = query(
      collection(db, COLLECTIONS.CONTENT_SECTIONS),
      where('sectionId', '==', sectionId)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt)
    } as ContentSection
  },

  async create(contentSection: Omit<ContentSection, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTENT_SECTIONS), {
      ...contentSection,
      createdAt: dateToTimestamp(contentSection.createdAt),
      updatedAt: dateToTimestamp(contentSection.updatedAt)
    })
    return docRef.id
  },

  async update(id: string, updates: Partial<ContentSection>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT_SECTIONS, id)
    const updateData: UpdateData<ContentSection> = { ...updates }
    
    if (updates.createdAt) {
      updateData.createdAt = dateToTimestamp(updates.createdAt)
    }
    if (updates.updatedAt) {
      updateData.updatedAt = dateToTimestamp(updates.updatedAt)
    }
    
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CONTENT_SECTIONS, id))
  },

  async deleteBySectionId(sectionId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTIONS.CONTENT_SECTIONS),
      where('sectionId', '==', sectionId)
    )
    const querySnapshot = await getDocs(q)
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
  }
}

// Reflection Section operations
export const reflectionSectionService = {
  async getAll(): Promise<ReflectionSection[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.REFLECTION_SECTIONS))
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt)
      } as ReflectionSection
    })
  },

  async getBySectionId(sectionId: string): Promise<ReflectionSection | null> {
    const q = query(
      collection(db, COLLECTIONS.REFLECTION_SECTIONS),
      where('sectionId', '==', sectionId)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) return null
    
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt)
    } as ReflectionSection
  },

  async create(reflectionSection: Omit<ReflectionSection, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.REFLECTION_SECTIONS), {
      ...reflectionSection,
      createdAt: dateToTimestamp(reflectionSection.createdAt),
      updatedAt: dateToTimestamp(reflectionSection.updatedAt)
    })
    return docRef.id
  },

  async update(id: string, updates: Partial<ReflectionSection>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.REFLECTION_SECTIONS, id)
    const updateData: UpdateData<ReflectionSection> = { ...updates }
    
    if (updates.createdAt) {
      updateData.createdAt = dateToTimestamp(updates.createdAt)
    }
    if (updates.updatedAt) {
      updateData.updatedAt = dateToTimestamp(updates.updatedAt)
    }
    
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.REFLECTION_SECTIONS, id))
  },

  async deleteBySectionId(sectionId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTIONS.REFLECTION_SECTIONS),
      where('sectionId', '==', sectionId)
    )
    const querySnapshot = await getDocs(q)
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
  }
}

// Calendar Event operations
export const calendarEventService = {
  async getAll(): Promise<CalendarEvent[]> {
    const querySnapshot = await getDocs(
      query(collection(db, COLLECTIONS.CALENDAR_EVENTS), orderBy('date', 'asc'))
    )
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt)
      } as CalendarEvent
    })
  },

  async create(event: Omit<CalendarEvent, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CALENDAR_EVENTS), {
      ...event,
      createdAt: dateToTimestamp(event.createdAt),
      updatedAt: dateToTimestamp(event.updatedAt)
    })
    return docRef.id
  },

  async update(id: string, updates: Partial<CalendarEvent>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CALENDAR_EVENTS, id)
    const updateData: UpdateData<CalendarEvent> = { ...updates }
    
    if (updates.createdAt) {
      updateData.createdAt = dateToTimestamp(updates.createdAt)
    }
    if (updates.updatedAt) {
      updateData.updatedAt = dateToTimestamp(updates.updatedAt)
    }
    
    await updateDoc(docRef, updateData)
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CALENDAR_EVENTS, id))
  },

  onSnapshot(callback: (events: CalendarEvent[]) => void) {
    return onSnapshot(
      query(collection(db, COLLECTIONS.CALENDAR_EVENTS), orderBy('date', 'asc')),
      (querySnapshot) => {
        const events = querySnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt)
          } as CalendarEvent
        })
        callback(events)
      }
    )
  }
}