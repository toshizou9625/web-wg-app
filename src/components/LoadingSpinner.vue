<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- メインスピナー -->
      <div 
        class="animate-spin rounded-full border-4 border-md-outline-variant"
        :class="[
          size === 'small' ? 'w-4 h-4 border-2' : 
          size === 'medium' ? 'w-8 h-8 border-3' : 
          'w-12 h-12 border-4'
        ]"
        :style="{ borderTopColor: primaryColor }"
      ></div>
      
      <!-- 中央のVue.jsロゴ風アクセント -->
      <div 
        class="absolute inset-0 flex items-center justify-center"
        v-if="size !== 'small'"
      >
        <div 
          class="rounded-full bg-md-primary"
          :class="size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'"
        ></div>
      </div>
    </div>
    
    <!-- ローディングテキスト -->
    <span 
      v-if="showText" 
      class="ml-3 text-md-on-surface-variant"
      :class="textSize"
    >
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  text?: string
  showText?: boolean
  overlay?: boolean
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  text: '読み込み中...',
  showText: false,
  overlay: false,
  fullscreen: false
})

const primaryColor = '#42b883' // Vue.js緑色

const containerClass = computed(() => {
  const classes = []
  
  if (props.overlay) {
    classes.push('fixed inset-0 bg-md-surface/80 backdrop-blur-sm z-50')
  }
  
  if (props.fullscreen) {
    classes.push('min-h-screen')
  }
  
  if (props.overlay || props.fullscreen) {
    classes.push('flex-col')
  }
  
  return classes.join(' ')
})

const textSize = computed(() => {
  switch (props.size) {
    case 'small':
      return 'text-md-body-small'
    case 'medium':
      return 'text-md-body-medium'
    case 'large':
      return 'text-md-body-large'
    default:
      return 'text-md-body-medium'
  }
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>