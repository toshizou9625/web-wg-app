<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SideNavigation from './components/SideNavigation.vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-md-surface-container-low font-md text-md-on-surface">
    <!-- モバイルメニューボタン -->
    <button
      @click="toggleMobileMenu"
      class="fixed top-4 left-4 z-50 lg:hidden w-12 h-12 rounded-md-full bg-md-primary text-md-on-primary shadow-md-elevation-2 flex items-center justify-center"
      aria-label="メニュー"
    >
      <span v-if="!isMobileMenuOpen" class="text-xl">☰</span>
      <span v-else class="text-xl">✕</span>
    </button>

    <!-- オーバーレイ (モバイルのみ) -->
    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    ></div>

    <!-- サイドナビゲーション -->
    <SideNavigation
      :is-mobile-open="isMobileMenuOpen"
      @close="closeMobileMenu"
    />

    <!-- メインコンテンツ -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
