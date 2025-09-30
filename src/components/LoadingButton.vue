<template>
  <button
    :disabled="loading"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <LoadingSpinner 
      v-if="loading" 
      size="small" 
      class="mr-2"
    />
    <span :class="{ 'opacity-50': loading }">
      <slot>{{ loading ? loadingText : text }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  loading?: boolean
  text?: string
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  text: 'ボタン',
  loadingText: '処理中...',
  variant: 'primary',
  size: 'medium'
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-md-full transition-all duration-200 font-medium',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  ]
  
  // サイズ
  switch (props.size) {
    case 'small':
      baseClasses.push('px-3 py-1.5 text-md-label-medium')
      break
    case 'large':
      baseClasses.push('px-8 py-4 text-md-label-large')
      break
    default:
      baseClasses.push('px-6 py-3 text-md-label-large')
  }
  
  // バリアント
  switch (props.variant) {
    case 'primary':
      baseClasses.push('bg-md-primary text-md-on-primary hover:shadow-md-elevation-2')
      break
    case 'secondary':
      baseClasses.push('bg-md-secondary text-md-on-secondary hover:shadow-md-elevation-2')
      break
    case 'tertiary':
      baseClasses.push('bg-md-tertiary text-md-on-tertiary hover:shadow-md-elevation-2')
      break
    case 'error':
      baseClasses.push('bg-md-error text-md-on-error hover:shadow-md-elevation-2')
      break
    default:
      baseClasses.push('bg-md-primary text-md-on-primary hover:shadow-md-elevation-2')
  }
  
  return baseClasses.join(' ')
})
</script>