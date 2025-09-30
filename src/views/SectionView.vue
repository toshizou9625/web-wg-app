<template>
  <div class="p-6 bg-md-surface-bright min-h-screen">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="sectionsStore.isInitializing"
      overlay
      fullscreen
      text="セクションデータを読み込み中..."
      show-text
    />

    <div v-if="!currentSection" class="text-center py-12">
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-md-lg bg-md-surface-container-high text-md-on-surface-variant flex items-center justify-center"
      >
        <span class="text-3xl">📝</span>
      </div>
      <h2 class="text-md-headline-small font-normal text-md-on-surface mb-2">セクションを選択</h2>
      <p class="text-md-body-medium text-md-on-surface-variant">
        サイドバーからセクションを選択するか、新しく作成してください。
      </p>
    </div>

    <div v-else class="space-y-8">
      <!-- ヘッダー -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-md-display-small font-normal text-md-on-surface">
            {{ currentSection.title }}
          </h1>
          <div class="flex space-x-2">
            <LoadingButton
              @click="saveSection"
              :loading="sectionsStore.isSaving"
              text="💾 保存"
              loading-text="保存中..."
              variant="primary"
            />
          </div>
        </div>
        <p class="text-md-body-large text-md-on-surface-variant">
          学習セクション • 作成日: {{ formatDate(currentSection.createdAt) }}
        </p>
      </div>

      <!-- コンテンツセクション（常に表示） -->
      <div class="space-y-6">
        <h2
          class="text-md-title-large font-normal text-md-on-surface border-b border-md-outline-variant pb-4 mb-6"
        >
          📝 学習コンテンツ
        </h2>

        <!-- タイトル -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3">
            タイトル
          </label>
          <input
            v-model="contentData.title"
            type="text"
            class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large"
            placeholder="学習内容のタイトルを入力"
            @input="updateSectionTitle"
          />
        </div>

        <!-- 担当者 -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3"> 担当者 </label>
          <input
            v-model="contentData.assignee"
            type="text"
            class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large"
            placeholder="担当者名を入力"
          />
        </div>

        <!-- モチベーション -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3">
            モチベーション
          </label>
          <textarea
            ref="motivationTextarea"
            v-model="motivationInput"
            class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large resize-none min-h-[80px]"
            placeholder="この学習に取り組む理由や目標を入力"
          ></textarea>
        </div>

        <!-- やること詳細 -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3">
            やること詳細
          </label>
          <textarea
            ref="detailsTextarea"
            v-model="detailsInput"
            class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large resize-none min-h-[120px]"
            placeholder="具体的な学習内容や手順を入力"
          ></textarea>
        </div>

        <!-- 担当割 -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3"> 担当割 </label>
          <div class="space-y-3">
            <div
              v-for="(assignment, index) in contentData.assignments"
              :key="index"
              class="flex items-center space-x-3"
            >
              <input
                v-model="contentData.assignments[index]"
                type="text"
                class="flex-1 p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-medium"
                placeholder="担当者: 作業内容"
              />
              <button
                @click="removeAssignment(index)"
                class="w-10 h-10 rounded-md-full text-md-error hover:bg-md-error-container transition-all duration-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <button
              @click="addAssignment"
              class="w-full p-4 border-2 border-dashed border-md-outline-variant rounded-md-lg text-md-on-surface-variant hover:border-md-primary hover:text-md-primary hover:bg-md-primary-container/20 transition-all duration-200 text-md-body-medium"
            >
              ➕ 担当追加
            </button>
          </div>
        </div>

        <!-- コンテンツメモ -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3">
            メモ (マークダウン形式)
          </label>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-md-label-medium text-md-on-surface-variant mb-3">編集</h3>
              <textarea
                ref="contentMemoTextarea"
                v-model="contentMemoInput"
                class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant font-mono text-md-body-small resize-none min-h-[200px]"
                placeholder="マークダウン形式でメモを入力..."
              ></textarea>
            </div>
            <div>
              <h3 class="text-md-label-medium text-md-on-surface-variant mb-3">プレビュー</h3>
              <div
                class="w-full h-80 p-4 border border-md-outline-variant rounded-md-xs bg-md-surface-container-high overflow-y-auto prose prose-sm max-w-none text-md-on-surface"
                v-html="contentMarkdownPreview"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 振り返りセクション（常に表示） -->
      <div class="space-y-6">
        <h2
          class="text-md-title-large font-normal text-md-on-surface border-b border-md-outline-variant pb-4 mb-6"
        >
          🔄 学習振り返り
        </h2>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- 左側: 入力フォーム -->
          <div class="space-y-6">
            <!-- 星5段階評価 -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <label class="block text-md-label-large text-md-on-surface-variant mb-4">
                総合評価
              </label>
              <StarRating
                :rating="reflectionData.rating"
                @update:rating="reflectionData.rating = $event"
              />
            </div>

            <!-- よかった点 -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <label class="block text-md-label-large text-md-on-surface-variant mb-3">
                よかった点
              </label>
              <textarea
                ref="goodPointsTextarea"
                v-model="goodPointsInput"
                class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large resize-none min-h-[100px]"
                placeholder="うまくいったことや学んだことを記録..."
              ></textarea>
            </div>

            <!-- 改善点 -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <label class="block text-md-label-large text-md-on-surface-variant mb-3">
                改善点
              </label>
              <textarea
                ref="improvementPointsTextarea"
                v-model="improvementPointsInput"
                class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-large resize-none min-h-[100px]"
                placeholder="次回改善したいことや課題を記録..."
              ></textarea>
            </div>

            <!-- チームメンバーの評価入力 -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <div class="flex items-center justify-between mb-6">
                <label class="block text-md-label-large text-md-on-surface-variant">
                  チームメンバーの評価
                </label>
                <button
                  @click="addTeamMember"
                  class="px-4 py-2 bg-md-tertiary text-md-on-tertiary rounded-md-full hover:shadow-md-elevation-2 transition-all duration-200 text-md-label-medium font-medium"
                >
                  ➕ メンバー追加
                </button>
              </div>
              <div class="space-y-4">
                <div
                  v-for="(member, index) in teamMembers"
                  :key="index"
                  class="border border-md-outline-variant rounded-md-lg p-4 bg-md-surface-container-high"
                >
                  <div class="flex items-center justify-between mb-3">
                    <input
                      v-model="member.memberName"
                      type="text"
                      placeholder="メンバー名"
                      class="flex-1 p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-medium"
                    />
                    <button
                      @click="removeTeamMember(index)"
                      class="ml-3 w-8 h-8 rounded-md-full text-md-error hover:bg-md-error-container transition-all duration-200 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                  <div class="mb-3">
                    <StarRating :rating="member.rating" @update:rating="member.rating = $event" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      v-model="member.goodPoints"
                      type="text"
                      placeholder="よかった点"
                      class="p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-small"
                    />
                    <input
                      v-model="member.improvementPoints"
                      type="text"
                      placeholder="改善点"
                      class="p-3 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant text-md-body-small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右側: 図表とプレビュー -->
          <div class="space-y-6">
            <!-- 評価チャート -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <h3 class="text-md-title-medium font-medium text-md-on-surface mb-4">評価サマリー</h3>
              <div v-if="teamMembers.length > 0">
                <div class="relative w-full" style="height: 300px">
                  <canvas ref="chartCanvas" class="absolute inset-0 w-full h-full"></canvas>
                  <!-- チャート中央のテキスト -->
                  <div
                    class="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div class="text-center">
                      <div class="text-md-display-medium font-medium text-md-primary">
                        {{ averageRating.toFixed(1) }}
                      </div>
                      <div class="text-md-body-small text-md-on-surface-variant">/ 5.0</div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <p class="text-md-body-medium text-md-on-surface-variant">平均評価</p>
                    <p class="text-md-display-small font-normal text-md-primary">
                      {{ averageRating.toFixed(1) }}
                    </p>
                  </div>
                  <div class="text-center">
                    <p class="text-md-body-medium text-md-on-surface-variant">評価者数</p>
                    <p class="text-md-display-small font-normal text-md-tertiary">
                      {{ teamMembers.length }}
                    </p>
                  </div>
                </div>

                <!-- チーム全体のフィードバック -->
                <div
                  v-if="allGoodPoints.length > 0 || allImprovementPoints.length > 0"
                  class="mt-6 space-y-4"
                >
                  <div v-if="allGoodPoints.length > 0">
                    <h4 class="text-md-title-small font-medium text-md-on-surface mb-3">
                      チーム全体の良かった点
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(point, index) in allGoodPoints"
                        :key="index"
                        class="flex items-start space-x-2 text-md-body-medium text-md-on-surface"
                      >
                        <span class="text-md-primary mt-1">•</span>
                        <span>{{ point }}</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="allImprovementPoints.length > 0">
                    <h4 class="text-md-title-small font-medium text-md-on-surface mb-3">
                      チーム全体の改善点
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="(point, index) in allImprovementPoints"
                        :key="index"
                        class="flex items-start space-x-2 text-md-body-medium text-md-on-surface"
                      >
                        <span class="text-md-error mt-1">•</span>
                        <span>{{ point }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <div
                  class="w-12 h-12 mx-auto mb-4 rounded-md-lg bg-md-surface-container-high text-md-on-surface-variant flex items-center justify-center"
                >
                  <span class="text-xl">📊</span>
                </div>
                <p class="text-md-body-medium text-md-on-surface-variant">
                  チームメンバーの評価を追加してグラフを表示
                </p>
              </div>
            </div>

            <!-- 評価詳細 -->
            <div
              class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
            >
              <h3 class="text-md-title-medium font-medium text-md-on-surface mb-4">評価詳細</h3>
              <div class="space-y-3">
                <div
                  v-for="member in teamMembers"
                  :key="member.memberId"
                  class="flex items-center justify-between p-4 bg-md-surface-container-high rounded-md-lg"
                >
                  <div class="flex-1">
                    <p class="text-md-body-medium font-medium text-md-on-surface">
                      {{ member.memberName || '名前未設定' }}
                    </p>
                    <p class="text-md-body-small text-md-on-surface-variant">
                      評価: {{ member.rating }}/5
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-md-body-small text-md-tertiary">
                      👍 {{ member.goodPoints || 'なし' }}
                    </p>
                    <p class="text-md-body-small text-md-secondary">
                      📝 {{ member.improvementPoints || 'なし' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 振り返りメモ -->
        <div
          class="bg-md-surface-container rounded-md-xl shadow-md-elevation-1 p-6 border border-md-outline-variant"
        >
          <label class="block text-md-label-large text-md-on-surface-variant mb-3">
            振り返りメモ (マークダウン形式)
          </label>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 class="text-md-label-medium text-md-on-surface-variant mb-3">編集</h3>
              <textarea
                ref="reflectionMemoTextarea"
                v-model="reflectionMemoInput"
                class="w-full p-4 border border-md-outline rounded-md-xs focus:border-md-primary focus:outline-none bg-md-surface text-md-on-surface placeholder:text-md-on-surface-variant font-mono text-md-body-small resize-none min-h-[150px]"
                placeholder="詳細な振り返りをマークダウン形式で入力..."
              ></textarea>
            </div>
            <div>
              <h3 class="text-md-label-medium text-md-on-surface-variant mb-3">プレビュー</h3>
              <div
                class="w-full h-64 p-4 border border-md-outline-variant rounded-md-xs bg-md-surface-container-high overflow-y-auto prose prose-sm max-w-none text-md-on-surface"
                v-html="reflectionMarkdownPreview"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 画面下部の保存ボタン -->
      <div class="mt-12 pb-8">
        <div class="flex justify-center">
          <LoadingButton
            @click="saveSection"
            :loading="sectionsStore.isSaving"
            text="💾 保存"
            loading-text="保存中..."
            variant="primary"
            size="large"
            class="min-w-[200px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, reactive, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionsStore } from '@/stores/sections'
import type { TeamMemberReflection } from '@/types'
import StarRating from '@/components/StarRating.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { marked } from 'marked'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Chart, registerables } from 'chart.js'
import { useTextareaAutosize } from '@vueuse/core'

Chart.register(...registerables)

const route = useRoute()
const sectionsStore = useSectionsStore()
const chartCanvas = ref<HTMLCanvasElement>()

// TextArea refs with VueUse autosize
const { textarea: motivationTextarea, input: motivationInput } = useTextareaAutosize()
const { textarea: detailsTextarea, input: detailsInput } = useTextareaAutosize()
const { textarea: contentMemoTextarea, input: contentMemoInput } = useTextareaAutosize()
const { textarea: goodPointsTextarea, input: goodPointsInput } = useTextareaAutosize()
const { textarea: improvementPointsTextarea, input: improvementPointsInput } = useTextareaAutosize()
const { textarea: reflectionMemoTextarea, input: reflectionMemoInput } = useTextareaAutosize()

const currentSection = computed(() => sectionsStore.currentSection)
const currentContentSection = computed(() => sectionsStore.currentContentSection)
const currentReflectionSection = computed(() => sectionsStore.currentReflectionSection)

// コンテンツデータ
const contentData = reactive({
  title: '',
  assignee: '',
  motivation: '',
  details: '',
  assignments: [''],
  memo: '',
})

// 振り返りデータ
const reflectionData = reactive({
  rating: 0,
  goodPoints: '',
  improvementPoints: '',
  memo: '',
})

const teamMembers = ref<TeamMemberReflection[]>([])

const averageRating = computed(() => {
  if (teamMembers.value.length === 0) return 0
  const sum = teamMembers.value.reduce((acc, member) => acc + member.rating, 0)
  return sum / teamMembers.value.length
})

const allGoodPoints = computed(() => {
  return teamMembers.value.map((member) => member.goodPoints).filter((point) => point.trim() !== '')
})

const allImprovementPoints = computed(() => {
  return teamMembers.value
    .map((member) => member.improvementPoints)
    .filter((point) => point.trim() !== '')
})

const contentMarkdownPreview = computed(() => {
  try {
    return marked(contentMemoInput.value || '')
  } catch {
    return '<p class="text-red-500">マークダウンの解析エラー</p>'
  }
})

const reflectionMarkdownPreview = computed(() => {
  try {
    return marked(reflectionMemoInput.value || '')
  } catch {
    return '<p class="text-red-500">マークダウンの解析エラー</p>'
  }
})

// VueUse inputとcontentData/reflectionDataの同期
watch(motivationInput, (newValue) => {
  contentData.motivation = newValue
})

watch(detailsInput, (newValue) => {
  contentData.details = newValue
})

watch(contentMemoInput, (newValue) => {
  contentData.memo = newValue
})

watch(goodPointsInput, (newValue) => {
  reflectionData.goodPoints = newValue
})

watch(improvementPointsInput, (newValue) => {
  reflectionData.improvementPoints = newValue
})

watch(reflectionMemoInput, (newValue) => {
  reflectionData.memo = newValue
})

// 逆方向の同期（データ読み込み時）
watch(() => contentData.motivation, (newValue) => {
  if (motivationInput.value !== newValue) {
    motivationInput.value = newValue
  }
})

watch(() => contentData.details, (newValue) => {
  if (detailsInput.value !== newValue) {
    detailsInput.value = newValue
  }
})

watch(() => contentData.memo, (newValue) => {
  if (contentMemoInput.value !== newValue) {
    contentMemoInput.value = newValue
  }
})

watch(() => reflectionData.goodPoints, (newValue) => {
  if (goodPointsInput.value !== newValue) {
    goodPointsInput.value = newValue
  }
})

watch(() => reflectionData.improvementPoints, (newValue) => {
  if (improvementPointsInput.value !== newValue) {
    improvementPointsInput.value = newValue
  }
})

watch(() => reflectionData.memo, (newValue) => {
  if (reflectionMemoInput.value !== newValue) {
    reflectionMemoInput.value = newValue
  }
})

function formatDate(date: Date) {
  return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja })
}

// コンテンツ関連の関数
function addAssignment() {
  contentData.assignments.push('')
}

function removeAssignment(index: number) {
  contentData.assignments.splice(index, 1)
}

// 振り返り関連の関数
function addTeamMember() {
  teamMembers.value.push({
    memberId: crypto.randomUUID(),
    memberName: '',
    rating: 0,
    goodPoints: '',
    improvementPoints: '',
  })
}

function removeTeamMember(index: number) {
  teamMembers.value.splice(index, 1)
  updateChart()
}

async function updateSectionTitle() {
  if (currentSection.value && contentData.title.trim()) {
    try {
      // セクションのタイトルを更新
      await sectionsStore.updateSectionTitle(currentSection.value.id, contentData.title.trim())
    } catch (error) {
      console.error('Failed to update section title:', error)
    }
  }
}

async function saveSection() {
  if (!currentSection.value) return

  try {
    // コンテンツデータを保存
    await sectionsStore.updateContentSection(currentSection.value.id, {
      title: contentData.title,
      assignee: contentData.assignee,
      motivation: contentData.motivation,
      details: contentData.details,
      assignments: contentData.assignments.filter((a) => a.trim() !== ''),
      memo: contentData.memo,
    })

    // 振り返りデータを保存（チームメンバーデータも含む）
    await sectionsStore.updateReflectionSection(currentSection.value.id, {
      rating: reflectionData.rating,
      goodPoints: reflectionData.goodPoints,
      improvementPoints: reflectionData.improvementPoints,
      memo: reflectionData.memo,
      teamMembers: teamMembers.value,
    })

    alert('保存しました！')
  } catch (error) {
    console.error('Failed to save section:', error)
    alert('保存に失敗しました。もう一度お試しください。')
  }
}

// データ読み込み関数
function loadContentData() {
  if (currentContentSection.value) {
    // タイトルはセクションタイトルまたはコンテンツタイトルを使用
    contentData.title = currentSection.value?.title || currentContentSection.value.title
    contentData.assignee = currentContentSection.value.assignee
    contentData.motivation = currentContentSection.value.motivation
    contentData.details = currentContentSection.value.details
    contentData.assignments =
      currentContentSection.value.assignments.length > 0
        ? [...currentContentSection.value.assignments]
        : ['']
    contentData.memo = currentContentSection.value.memo
  } else if (currentSection.value) {
    // セクションのみ存在する場合はセクションタイトルを使用
    contentData.title = currentSection.value.title
  }

  // VueUse autosizeが自動的に処理
}

function loadReflectionData() {
  if (currentReflectionSection.value) {
    reflectionData.rating = currentReflectionSection.value.rating
    reflectionData.goodPoints = currentReflectionSection.value.goodPoints
    reflectionData.improvementPoints = currentReflectionSection.value.improvementPoints
    reflectionData.memo = currentReflectionSection.value.memo

    // チームメンバーデータも読み込み
    if (currentReflectionSection.value.teamMembers) {
      teamMembers.value = [...currentReflectionSection.value.teamMembers]
    } else {
      teamMembers.value = []
    }
  }

  // VueUse autosizeが自動的に処理
}

// チャート更新
let chart: Chart | null = null

function updateChart() {
  nextTick(() => {
    if (!chartCanvas.value || teamMembers.value.length === 0) {
      if (chart) {
        chart.destroy()
        chart = null
      }
      return
    }

    if (chart) {
      chart.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    // キャンバスのサイズを明示的に設定
    chartCanvas.value.width = chartCanvas.value.offsetWidth
    chartCanvas.value.height = chartCanvas.value.offsetHeight

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['平均評価', '未達成'],
        datasets: [
          {
            label: '評価',
            data: [averageRating.value, 5 - averageRating.value],
            backgroundColor: ['#42b883', '#e5e8e3'],
            borderColor: ['#42b883', '#e5e8e3'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(24, 29, 25, 0.9)',
            titleColor: '#f7faf5',
            bodyColor: '#f7faf5',
            callbacks: {
              label: (context) => {
                if (context.dataIndex === 0) {
                  return `平均評価: ${averageRating.value.toFixed(1)}/5`
                }
                return ''
              },
            },
          },
        },
        cutout: '60%',
      },
    })
  })
}

watch(teamMembers, updateChart, { deep: true })

// ルートパラメータの変更を監視
watch(
  () => route.params.sectionId,
  (newSectionId) => {
    if (newSectionId && typeof newSectionId === 'string') {
      sectionsStore.setCurrentSection(newSectionId)
    }
  },
  { immediate: true },
)

// セクションデータの変更を監視
watch(currentContentSection, loadContentData)
watch(currentReflectionSection, loadReflectionData)

onMounted(async () => {
  // 最初にFirebaseからデータを取得
  try {
    await sectionsStore.initializeFromFirebase()
  } catch (error) {
    console.error('Failed to load data from Firebase:', error)
  }

  if (route.params.sectionId && typeof route.params.sectionId === 'string') {
    sectionsStore.setCurrentSection(route.params.sectionId)
  }

  // 両方のデータを読み込み
  loadContentData()
  loadReflectionData()

  // チャート初期化を遅延実行
  nextTick(() => {
    setTimeout(() => {
      updateChart()
    }, 100)
  })
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>
