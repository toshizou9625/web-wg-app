<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="star in 5"
      :key="star"
      @click="setRating(star)"
      class="w-8 h-8 rounded-md-full transition-all duration-200 focus:outline-none hover:bg-md-on-surface/8 flex items-center justify-center"
      :class="getStarClass(star)"
    >
      <span class="text-xl">⭐</span>
    </button>
    <span class="ml-2 text-md-body-small text-md-on-surface-variant">{{ rating }}/5</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rating: number
}>()

const emit = defineEmits<{
  'update:rating': [value: number]
}>()

function setRating(value: number) {
  emit('update:rating', value)
}

function getStarClass(star: number) {
  if (props.rating === 0) {
    // 未選択時は全て同じスタイル
    return 'text-md-on-surface-variant hover:text-md-primary-70'
  }
  
  if (star <= props.rating) {
    // 選択範囲内の星はアクティブ
    return 'text-md-primary'
  } else {
    // 選択範囲外の星はグレーアウト
    return 'text-md-neutral-40 opacity-50'
  }
}
</script>