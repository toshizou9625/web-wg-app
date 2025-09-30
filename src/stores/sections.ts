import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Section, ContentSection, ReflectionSection } from '@/types'
import { 
  sectionService, 
  contentSectionService, 
  reflectionSectionService 
} from '@/services/firestore'

export const useSectionsStore = defineStore('sections', () => {
  const sections = ref<Section[]>([])
  const contentSections = ref<ContentSection[]>([])
  const reflectionSections = ref<ReflectionSection[]>([])
  const currentSectionId = ref<string | null>(null)
  
  // ローディング状態
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const isInitializing = ref(false)

  const currentSection = computed(() => 
    sections.value.find(s => s.id === currentSectionId.value)
  )

  const currentContentSection = computed(() =>
    contentSections.value.find(cs => cs.sectionId === currentSectionId.value)
  )

  const currentReflectionSection = computed(() =>
    reflectionSections.value.find(rs => rs.sectionId === currentSectionId.value)
  )

  async function addSection(title: string, _type: 'content' | 'reflection' = 'content') {
    isLoading.value = true
    const now = new Date()
    const section = {
      title,
      type: 'content' as const, // すべてのセクションをcontentタイプとして作成
      createdAt: now,
      updatedAt: now
    }
    
    try {
      const sectionId = await sectionService.create(section)
      const sectionWithId = { ...section, id: sectionId }
      sections.value.push(sectionWithId)
      
      // コンテンツセクションを作成
      const contentSection = {
        sectionId,
        title: '',
        assignee: '',
        motivation: '',
        details: '',
        assignments: [],
        memo: '',
        createdAt: now,
        updatedAt: now
      }
      const contentId = await contentSectionService.create(contentSection)
      contentSections.value.push({ ...contentSection, id: contentId })
      
      // 振り返りセクションも作成
      const reflectionSection = {
        sectionId,
        rating: 0,
        goodPoints: '',
        improvementPoints: '',
        memo: '',
        teamMembers: [],
        createdAt: now,
        updatedAt: now
      }
      const reflectionId = await reflectionSectionService.create(reflectionSection)
      reflectionSections.value.push({ ...reflectionSection, id: reflectionId })
      
      return sectionWithId
    } catch (error) {
      console.error('Failed to create section:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateSectionTitle(sectionId: string, title: string) {
    isSaving.value = true
    try {
      const updatedData = { title, updatedAt: new Date() }
      await sectionService.update(sectionId, updatedData)
      
      const index = sections.value.findIndex(s => s.id === sectionId)
      if (index !== -1) {
        sections.value[index] = {
          ...sections.value[index],
          ...updatedData
        }
      }
    } catch (error) {
      console.error('Failed to update section title:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function updateContentSection(sectionId: string, updates: Partial<ContentSection>) {
    isSaving.value = true
    try {
      const index = contentSections.value.findIndex(cs => cs.sectionId === sectionId)
      if (index !== -1) {
        const contentId = contentSections.value[index].id
        const updatedData = { ...updates, updatedAt: new Date() }
        
        await contentSectionService.update(contentId, updatedData)
        
        contentSections.value[index] = {
          ...contentSections.value[index],
          ...updatedData
        }
      }
    } catch (error) {
      console.error('Failed to update content section:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function updateReflectionSection(sectionId: string, updates: Partial<ReflectionSection>) {
    isSaving.value = true
    try {
      const index = reflectionSections.value.findIndex(rs => rs.sectionId === sectionId)
      if (index !== -1) {
        const reflectionId = reflectionSections.value[index].id
        const updatedData = { ...updates, updatedAt: new Date() }
        
        await reflectionSectionService.update(reflectionId, updatedData)
        
        reflectionSections.value[index] = {
          ...reflectionSections.value[index],
          ...updatedData
        }
      }
    } catch (error) {
      console.error('Failed to update reflection section:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  async function deleteSection(sectionId: string) {
    isDeleting.value = true
    try {
      // Firebaseから削除
      await sectionService.delete(sectionId)
      
      // 関連するコンテンツセクションも削除
      const contentSection = contentSections.value.find(cs => cs.sectionId === sectionId)
      if (contentSection) {
        await contentSectionService.delete(contentSection.id)
      }
      
      // 関連する振り返りセクションも削除
      const reflectionSection = reflectionSections.value.find(rs => rs.sectionId === sectionId)
      if (reflectionSection) {
        await reflectionSectionService.delete(reflectionSection.id)
      }
      
      // ローカル状態から削除
      const sectionIndex = sections.value.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        sections.value.splice(sectionIndex, 1)
      }
      
      const contentIndex = contentSections.value.findIndex(cs => cs.sectionId === sectionId)
      if (contentIndex !== -1) {
        contentSections.value.splice(contentIndex, 1)
      }
      
      const reflectionIndex = reflectionSections.value.findIndex(rs => rs.sectionId === sectionId)
      if (reflectionIndex !== -1) {
        reflectionSections.value.splice(reflectionIndex, 1)
      }
      
      if (currentSectionId.value === sectionId) {
        currentSectionId.value = null
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  function setCurrentSection(sectionId: string) {
    currentSectionId.value = sectionId
  }

  // Firebase からすべてのデータを取得する初期化関数
  async function initializeFromFirebase() {
    isInitializing.value = true
    try {
      // セクション一覧を取得
      const sectionsList = await sectionService.getAll()
      sections.value = sectionsList

      // コンテンツセクション一覧を取得
      const contentsList = await contentSectionService.getAll()
      contentSections.value = contentsList

      // 振り返りセクション一覧を取得
      const reflectionsList = await reflectionSectionService.getAll()
      reflectionSections.value = reflectionsList

      console.log('Firebase data loaded:', {
        sections: sectionsList.length,
        contents: contentsList.length,
        reflections: reflectionsList.length
      })
    } catch (error) {
      console.error('Failed to load data from Firebase:', error)
      throw error
    } finally {
      isInitializing.value = false
    }
  }

  return {
    sections,
    contentSections,
    reflectionSections,
    currentSectionId,
    currentSection,
    currentContentSection,
    currentReflectionSection,
    // ローディング状態
    isLoading,
    isSaving,
    isDeleting,
    isInitializing,
    // アクション
    addSection,
    updateSectionTitle,
    updateContentSection,
    updateReflectionSection,
    deleteSection,
    setCurrentSection,
    initializeFromFirebase
  }
})