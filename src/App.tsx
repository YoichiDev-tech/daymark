import { useState } from 'react'
import { CalendarDays, CheckCircle2, ChevronRight, ClipboardList, Command, Menu, Moon, Plus, Search, Settings2, Sparkles, Sun, Target } from 'lucide-react'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { TodayDashboard } from './components/TodayDashboard'
import { WorkspaceModal } from './components/WorkspaceModal'
import { useStoredState } from './lib/storage'
import type { Client, Habit, ModalType, ScheduleItem, Settings, Task } from './types'

const initialTasks: Task[] = [
  { id: 1, title: 'Send revised proposal to Acme Studio', project: 'Acme Studio', priority: 'High', done: false },
  { id: 2, title: 'Review Q3 campaign performance', project: 'Marketing', priority: 'Medium', done: false },
  { id: 3, title: 'Update onboarding checklist', project: 'Operations', priority: 'Low', done: true },
]
const initialHabits: Habit[] = [
  { id: 1, title: 'Morning planning', streak: 12, color: 'coral', checked: true },
  { id: 2, title: 'Read 20 pages', streak: 8, color: 'blue', checked: false },
  { id: 3, title: 'Evening reflection', streak: 21, color: 'lime', checked: false },
]
const initialSchedule: ScheduleItem[] = [
  { id: 1, title: 'Discovery call', detail: 'Acme Studio', time: '10:30 AM', kind: 'meeting' },
  { id: 2, title: 'Ship sample kits', detail: 'FedEx pickup, 3 packages', time: '1:00 PM', kind: 'shipping' },
  { id: 3, title: 'Follow up with Olivia', detail: 'Phone call, 15 min', time: '3:30 PM', kind: 'call' },
]

type FormValues = { title: string; date: string; details: string; workspaceName: string; focusMinutes: string; emailUpdates: boolean }

function App() {
  const [dark, setDark] = useStoredState('daymark-dark', false)
  const [activeNav, setActiveNav] = useState('Today')
  const [tasks, setTasks] = useStoredState<Task[]>('daymark-tasks', initialTasks)
  const [habits, setHabits] = useStoredState<Habit[]>('daymark-habits', initialHabits)
  const [schedule, setSchedule] = useStoredState<ScheduleItem[]>('daymark-schedule', initialSchedule)
  const [clients, setClients] = useStoredState<Client[]>('daymark-clients', [])
  const [settings, setSettings] = useStoredState<Settings>('daymark-settings', { workspaceName: "Kekko's space", focusMinutes: 90, emailUpdates: true })
  const [modal, setModal] = useState<ModalType | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const openModal = (type: ModalType, taskId?: number) => { setModal(type); setEditingTaskId(taskId ?? null) }
  const closeModal = () => { setModal(null); setEditingTaskId(null) }
  const saveModal = (values: FormValues) => {
    if (modal === 'task') setTasks(editingTaskId ? tasks.map((task) => task.id === editingTaskId ? { ...task, title: values.title } : task) : [{ id: Date.now(), title: values.title, project: 'Personal', priority: 'Medium', done: false }, ...tasks])
    if (modal === 'habit') setHabits([...habits, { id: Date.now(), title: values.title, streak: 0, color: 'blue', checked: false }])
    if (modal === 'client') setClients([...clients, { id: Date.now(), name: values.title, details: values.details }])
    if (modal === 'meeting' || modal === 'shipping') setSchedule([...schedule, { id: Date.now(), title: values.title, detail: values.details || 'Details to add', time: values.date || 'All day', kind: modal }])
    if (modal === 'settings') setSettings({ workspaceName: values.workspaceName, focusMinutes: Number(values.focusMinutes) || 0, emailUpdates: values.emailUpdates })
    closeModal()
  }
  return <div className={dark ? 'app dark' : 'app'}><Sidebar activeNav={activeNav} setActiveNav={setActiveNav} openSettings={() => openModal('settings')} workspaceName={settings.workspaceName} taskCount={tasks.filter((task) => !task.done).length} /><main className="main"><header className="topbar"><button className="mobile-menu" aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><div className="search"><Search size={16} /><span>Search</span><kbd><Command size={12} /> K</kbd></div><button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle color mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><div className="top-avatar">KK</div></div></header>{activeNav === 'Today' ? <TodayDashboard tasks={tasks} habits={habits} schedule={schedule} focusMinutes={settings.focusMinutes} setTasks={setTasks} setHabits={setHabits} openModal={openModal} /> : <WorkspacePage activeNav={activeNav} tasks={tasks} habits={habits} clients={clients} schedule={schedule} openModal={openModal} />}</main><nav className="mobile-bottom-nav" aria-label="Mobile navigation">{[['Today', Target], ['Tasks', ClipboardList], ['Habits', CheckCircle2], ['Schedule', CalendarDays]].map(([label, Icon]) => <button key={label as string} className={activeNav === label ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveNav(label as string)}><Icon size={18} /><span>{label as string}</span></button>)}<button className="mobile-nav-item" onClick={() => openModal('settings')}><Settings2 size={18} /><span>More</span></button></nav>{modal && <WorkspaceModal modal={modal} editingTask={editingTaskId ? tasks.find((task) => task.id === editingTaskId) : undefined} settings={settings} close={closeModal} save={saveModal} />}</div>
}

function WorkspacePage({ activeNav, tasks, habits, clients, schedule, openModal }: { activeNav: string; tasks: Task[]; habits: Habit[]; clients: Client[]; schedule: ScheduleItem[]; openModal: (type: ModalType) => void }) {
  const entries = activeNav === 'Tasks' ? tasks.map((task) => ({ title: task.title, detail: `${task.project} - ${task.priority}${task.done ? ' - Completed' : ''}` })) : activeNav === 'Habits' ? habits.map((habit) => ({ title: habit.title, detail: `${habit.streak} day streak - ${habit.checked ? 'Completed today' : 'Not started'}` })) : activeNav === 'Clients' ? clients.map((client) => ({ title: client.name, detail: client.details })) : schedule.map((item) => ({ title: item.title, detail: `${item.time} - ${item.detail}` }))
  const modalType: ModalType = activeNav === 'Schedule' ? 'meeting' : activeNav === 'Clients' ? 'client' : activeNav === 'Habits' ? 'habit' : 'task'
  return <div className="content page-view"><section className="page-view-panel"><div className="page-view-icon"><Sparkles size={22} /></div><div><span className="eyebrow">Workspace page</span><h1>{activeNav}</h1><p>{activeNav === 'Tasks' ? 'Organize and complete everything on your list.' : activeNav === 'Habits' ? 'Build consistency one daily check-in at a time.' : activeNav === 'Schedule' ? 'Meetings, calls, and shipments in one place.' : activeNav === 'Clients' ? 'Keep client details close and easy to find.' : 'Tune your workspace to fit your day.'}</p></div><button className="primary-btn" onClick={() => openModal(modalType)}><Plus size={17} /> Add new</button></section>{entries.length > 0 && <section className="panel page-entries">{entries.map((entry) => <div className="schedule-row" key={entry.title}><div><strong>{entry.title}</strong><span>{entry.detail}</span></div></div>)}</section>}</div>
}

export default App
