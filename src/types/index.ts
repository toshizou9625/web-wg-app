export interface Section {
  id: string
  title: string
  type: 'content' | 'reflection'
  createdAt: Date
  updatedAt: Date
}

export interface ContentSection {
  id: string
  sectionId: string
  title: string
  assignee: string
  motivation: string
  details: string
  assignments: string[]
  memo: string
  memos: { date: string; content: string }[]
  createdAt: Date
  updatedAt: Date
}

export interface ReflectionSection {
  id: string
  sectionId: string
  keep: string
  problem: string
  try: string
  memo: string
  teamMembers?: TeamMemberReflection[]
  createdAt: Date
  updatedAt: Date
}

export interface CalendarEvent {
  id: string
  date: string
  title: string
  memo: string
  createdAt: Date
  updatedAt: Date
}

export interface TeamMemberReflection {
  memberId: string
  memberName: string
  rating: number
  goodPoints: string
  improvementPoints: string
}