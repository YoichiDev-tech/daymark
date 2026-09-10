export type Task = { id: number; title: string; project: string; priority: 'High' | 'Medium' | 'Low'; done: boolean }
export type Habit = { id: number; title: string; streak: number; color: string; checked: boolean }
export type ScheduleItem = { id: number; title: string; detail: string; time: string; kind: 'meeting' | 'shipping' | 'call' }
export type Client = { id: number; name: string; details: string }
export type Settings = { workspaceName: string; focusMinutes: number; emailUpdates: boolean }
export type ModalType = 'task' | 'habit' | 'meeting' | 'client' | 'shipping' | 'settings'
