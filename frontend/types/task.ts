export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  tag: string
  tagColor: string
  progress: {
    current: number
    total: number
  }
  assignees: string[]
  comments: number
  attachments: number
  views: number
}

