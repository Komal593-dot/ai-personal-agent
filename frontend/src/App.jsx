
import { useState } from "react";
import {
  Home,
  Sparkles,
  CheckSquare,
  CalendarDays,
  Mail,
  Zap,
  Activity,
  Settings,
  Bell,
  ArrowRight,
  CheckCircle2,
  Plus,
  Search,
  Clock,
  Send,
  X,
} from "lucide-react";

const navItems = [
  { id: "home", icon: Home, text: "Home" },
  { id: "agent", icon: Sparkles, text: "Agent" },
  { id: "tasks", icon: CheckSquare, text: "Tasks" },
  { id: "calendar", icon: CalendarDays, text: "Calendar" },
  { id: "email", icon: Mail, text: "Email" },
  { id: "automate", icon: Zap, text: "Automate" },
  { id: "activity", icon: Activity, text: "Activity" },
];

function App() {
  const [page, setPage] = useState("home");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete AI assignment", completed: false },
    { id: 2, text: "Practice C++ DSA", completed: false },
    { id: 3, text: "Review project progress", completed: true },
  ]);

  const [activities, setActivities] = useState([
    "Nexus AI dashboard opened",
    "Project connected to FastAPI",
  ]);

  const [events] = useState([
    {
      id: 1,
      time: "10:00 AM",
      title: "College",
      subtitle: "Computer Engineering",
    },
    {
      id: 2,
      time: "5:30 PM",
      title: "DSA Practice",
      subtitle: "C++ • 90 minutes",
    },
    {
      id: 3,
      time: "8:00 PM",
      title: "Project Work",
      subtitle: "AI Personal Agent",
    },
  ]);

  const addActivity = (text) => {
    setActivities((prev) => [text, ...prev].slice(0, 10));
  };

  const runAgent = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    addActivity(`Agent request: ${message}`);

    try {
      const response = await fetch("http://127.0.0.1:8000/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setReply(data.reply);
      addActivity("Agent completed a request");
    } catch (error) {
      console.error(error);
      setReply(
        "Could not connect to the AI agent. Make sure the FastAPI backend is running."
      );
      addActivity("Agent request failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    const task = tasks.find((item) => item.id === id);

    if (task) {
      addActivity(
        `${task.completed ? "Reopened" : "Completed"} task: ${task.text}`
      );
    }
  };

  const createTask = () => {
    const title = window.prompt("Enter your new task:");

    if (!title?.trim()) return;

    const newTask = {
      id: Date.now(),
      text: title.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    addActivity(`Created task: ${title.trim()}`);
  };

  const handleQuickAction = (action) => {
    if (action === "email") {
      setPage("email");
      addActivity("Opened email workspace");
    }

    if (action === "meeting") {
      setPage("calendar");
      addActivity("Opened calendar workspace");
    }

    if (action === "task") {
      setPage("tasks");
      createTask();
    }

    if (action === "automation") {
      setPage("automate");
      addActivity("Opened automation workspace");
    }
  };

  const openPage = (id) => {
    setPage(id);
    setShowNotifications(false);
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = tasks.length - completedTasks;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-20 h-screen w-64 border-r border-slate-800 bg-slate-950 p-5">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <Sparkles size={21} />
          </div>

          <div>
            <h1 className="font-bold">Nexus AI</h1>
            <p className="text-xs text-slate-500">Personal Agent</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              active={page === item.id}
              onClick={() => openPage(item.id)}
            />
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <NavItem
            icon={Settings}
            text="Settings"
            active={page === "settings"}
            onClick={() => openPage("settings")}
          />

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <p className="text-xs text-slate-500">AI Agent Status</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm">Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-64 min-h-screen p-8">
        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {page === "home"
                ? "Good afternoon 👋"
                : getPageTitle(page)}
            </h2>
          </div>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition hover:bg-slate-800"
            >
              <Bell size={18} />
            </button>

            {showNotifications && (
              <div className="absolute right-16 top-14 z-30 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <p className="text-sm text-slate-400">
                  Nexus AI is online and ready.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                K
              </div>

              <span className="text-sm">Komal</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {page === "home" && (
          <HomePage
            message={message}
            setMessage={setMessage}
            loading={loading}
            reply={reply}
            runAgent={runAgent}
            handleQuickAction={handleQuickAction}
            tasks={tasks}
            remainingTasks={remainingTasks}
            completedTasks={completedTasks}
            events={events}
            openPage={openPage}
            toggleTask={toggleTask}
            activities={activities}
          />
        )}

        {page === "agent" && (
          <AgentPage
            message={message}
            setMessage={setMessage}
            loading={loading}
            reply={reply}
            runAgent={runAgent}
            activities={activities}
          />
        )}

        {page === "tasks" && (
          <TasksPage
            tasks={tasks}
            toggleTask={toggleTask}
            createTask={createTask}
          />
        )}

        {page === "calendar" && <CalendarPage events={events} />}

        {page === "email" && <EmailPage />}

        {page === "automate" && <AutomationPage />}

        {page === "activity" && (
          <ActivityPage activities={activities} />
        )}

        {page === "settings" && <SettingsPage />}
      </main>
    </div>
  );
}

/* ================= HOME ================= */

function HomePage({
  message,
  setMessage,
  loading,
  reply,
  runAgent,
  handleQuickAction,
  tasks,
  remainingTasks,
  completedTasks,
  events,
  openPage,
  toggleTask,
  activities,
}) {
  const quickActions = [
    {
      icon: Mail,
      title: "Send an email",
      text: "Draft and send an email",
      action: "email",
    },
    {
      icon: CalendarDays,
      title: "Schedule a meeting",
      text: "Find a free time slot",
      action: "meeting",
    },
    {
      icon: CheckSquare,
      title: "Create a task",
      text: "Add something to my tasks",
      action: "task",
    },
    {
      icon: Zap,
      title: "Create automation",
      text: "Automate a recurring task",
      action: "automation",
    },
  ];

  return (
    <>
      {/* AI BOX */}
      <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
              <Sparkles size={17} />
            </div>

            <span className="font-semibold">Ask your AI agent</span>
          </div>

          <p className="text-sm text-slate-500">
            Tell me what you want to accomplish. Nexus will plan and
            execute tasks for you.
          </p>
        </div>

        <AgentInput
          message={message}
          setMessage={setMessage}
          loading={loading}
          runAgent={runAgent}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Suggestion
            text="Check my schedule"
            onClick={() => setMessage("Check my schedule")}
          />

          <Suggestion
            text="Plan my day"
            onClick={() => setMessage("Plan my day")}
          />

          <Suggestion
            text="Summarize my emails"
            onClick={() => setMessage("Summarize my emails")}
          />

          <Suggestion
            text="Create a reminder"
            onClick={() => setMessage("Create a reminder")}
          />
        </div>

        {(loading || reply) && (
          <AgentResponse loading={loading} reply={reply} />
        )}
      </section>

      {/* QUICK ACTIONS */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quick actions</h3>

          <button
            onClick={() => openPage("agent")}
            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
          >
            View agent
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                onClick={() => handleQuickAction(action.action)}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-1 hover:border-violet-500"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Icon size={21} />
                </div>

                <h4 className="font-medium">{action.title}</h4>

                <p className="mt-1 text-xs text-slate-500">
                  {action.text}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* TASKS + CALENDAR */}
      <div className="grid grid-cols-2 gap-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold">Today's tasks</h3>

            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
              {remainingTasks} remaining
            </span>
          </div>

          {tasks.map((task) => (
            <Task
              key={task.id}
              text={task.text}
              checked={task.completed}
              onClick={() => toggleTask(task.id)}
            />
          ))}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold">Upcoming</h3>

            <button
              onClick={() => openPage("calendar")}
              className="flex items-center gap-1 text-xs text-violet-400"
            >
              Calendar
              <ArrowRight size={13} />
            </button>
          </div>

          {events.map((event) => (
            <Event
              key={event.id}
              time={event.time}
              title={event.title}
              subtitle={event.subtitle}
            />
          ))}
        </section>
      </div>

      {/* STATS */}
      <section className="mt-6 grid grid-cols-3 gap-4">
        <Stat
          icon={CheckCircle2}
          value={completedTasks}
          label="Tasks completed"
        />

        <Stat
          icon={Zap}
          value="0"
          label="Automations active"
        />

        <Stat
          icon={Activity}
          value={activities.length}
          label="Agent activities"
        />
      </section>
    </>
  );
}

/* ================= AGENT ================= */

function AgentPage({
  message,
  setMessage,
  loading,
  reply,
  runAgent,
}) {
  return (
    <section className="max-w-4xl">
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
              <Sparkles />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Nexus AI Agent
              </h3>

              <p className="text-sm text-slate-500">
                Your intelligent task assistant
              </p>
            </div>
          </div>
        </div>

        <AgentInput
          message={message}
          setMessage={setMessage}
          loading={loading}
          runAgent={runAgent}
        />

        {(loading || reply) && (
          <AgentResponse loading={loading} reply={reply} />
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-4 font-semibold">How the agent will work</h3>

        <div className="grid grid-cols-4 gap-3">
          <PlanStep number="1" title="Understand" />
          <PlanStep number="2" title="Plan" />
          <PlanStep number="3" title="Execute" />
          <PlanStep number="4" title="Verify" />
        </div>
      </div>
    </section>
  );
}

/* ================= TASKS ================= */

function TasksPage({ tasks, toggleTask, createTask }) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Manage your personal tasks
          </p>
        </div>

        <button
          onClick={createTask}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm hover:bg-violet-500"
        >
          <Plus size={16} />
          New task
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900">
        {tasks.map((task) => (
          <Task
            key={task.id}
            text={task.text}
            checked={task.completed}
            onClick={() => toggleTask(task.id)}
          />
        ))}
      </div>
    </section>
  );
}

/* ================= CALENDAR ================= */

function CalendarPage({ events }) {
  return (
    <section>
      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="text-violet-400" />
          <div>
            <h3 className="font-semibold">Calendar</h3>
            <p className="text-sm text-slate-500">
              Upcoming events
            </p>
          </div>
        </div>

        {events.map((event) => (
          <div
            key={event.id}
            className="mb-3 flex items-center gap-4 rounded-lg bg-slate-950 p-4"
          >
            <Clock size={18} className="text-violet-400" />

            <div className="w-24 text-sm text-slate-500">
              {event.time}
            </div>

            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-xs text-slate-500">
                {event.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= EMAIL ================= */

function EmailPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const sendDraft = () => {
    if (!email.trim()) return;

    setSent(true);
    setEmail("");
  };

  return (
    <section className="max-w-3xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Mail className="text-violet-400" />

          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-slate-500">
              Email workspace
            </p>
          </div>
        </div>

        <textarea
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSent(false);
          }}
          placeholder="Write an email or ask Nexus AI to draft one..."
          className="min-h-40 w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm outline-none focus:border-violet-500"
        />

        <button
          onClick={sendDraft}
          className="mt-4 flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm hover:bg-violet-500"
        >
          <Send size={16} />
          Prepare email
        </button>

        {sent && (
          <p className="mt-4 text-sm text-emerald-400">
            Email draft prepared successfully.
          </p>
        )}
      </div>
    </section>
  );
}

/* ================= AUTOMATION ================= */

function AutomationPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <section className="max-w-3xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Zap className="text-violet-400" />

          <div>
            <h3 className="font-semibold">Automations</h3>
            <p className="text-sm text-slate-500">
              Automate recurring actions
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-950 p-4">
          <div>
            <p className="font-medium">Daily planning</p>
            <p className="text-xs text-slate-500">
              Generate a daily plan every morning
            </p>
          </div>

          <button
            onClick={() => setEnabled(!enabled)}
            className={`rounded-full px-4 py-2 text-xs ${
              enabled
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {enabled ? "Active" : "Enable"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= ACTIVITY ================= */

function ActivityPage({ activities }) {
  return (
    <section className="max-w-3xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Activity className="text-violet-400" />

          <div>
            <h3 className="font-semibold">Activity</h3>
            <p className="text-sm text-slate-500">
              Recent Nexus activity
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={`${activity}-${index}`}
              className="rounded-lg bg-slate-950 p-4 text-sm text-slate-300"
            >
              {activity}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= SETTINGS ================= */

function SettingsPage() {
  return (
    <section className="max-w-3xl">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Settings className="text-violet-400" />

          <div>
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-slate-500">
              Nexus AI configuration
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            title="Agent status"
            value="Online"
          />

          <SettingRow
            title="Backend"
            value="FastAPI"
          />

          <SettingRow
            title="Frontend"
            value="React + Vite"
          />

          <SettingRow
            title="AI model"
            value="Not connected yet"
          />
        </div>
      </div>
    </section>
  );
}

/* ================= COMPONENTS ================= */

function NavItem({ icon: Icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
        active
          ? "bg-violet-600/10 text-violet-400"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{text}</span>
    </button>
  );
}

function AgentInput({
  message,
  setMessage,
  loading,
  runAgent,
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            runAgent();
          }
        }}
        placeholder="What would you like me to do?"
        className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-600"
      />

      <button
        onClick={runAgent}
        disabled={loading || !message.trim()}
        className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Running..." : "Run Agent"}

        {!loading && <ArrowRight size={16} />}
      </button>
    </div>
  );
}

function AgentResponse({ loading, reply }) {
  return (
    <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
          <Sparkles size={15} />
        </div>

        <span className="text-sm font-medium text-violet-300">
          Nexus AI
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-300">
        {loading ? "Thinking..." : reply}
      </p>
    </div>
  );
}

function Suggestion({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-600 hover:text-white"
    >
      {text}
    </button>
  );
}

function Task({ text, checked, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-slate-800 py-3 text-left last:border-0"
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          checked
            ? "border-emerald-500 bg-emerald-500 text-xs text-white"
            : "border-slate-600"
        }`}
      >
        {checked && "✓"}
      </div>

      <span
        className={`text-sm ${
          checked
            ? "text-slate-600 line-through"
            : "text-slate-300"
        }`}
      >
        {text}
      </span>
    </button>
  );
}

function Event({ time, title, subtitle }) {
  return (
    <div className="mb-3 flex gap-4 rounded-lg bg-slate-950 p-3">
      <div className="w-20 text-xs text-slate-500">
        {time}
      </div>

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-slate-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function PlanStep({ number, title }) {
  return (
    <div className="rounded-lg bg-slate-950 p-4">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/20 text-xs text-violet-400">
        {number}
      </div>

      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}

function SettingRow({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-950 p-4">
      <span className="text-sm text-slate-300">{title}</span>
      <span className="text-sm text-slate-500">{value}</span>
    </div>
  );
}

function getPageTitle(page) {
  const titles = {
    agent: "AI Agent",
    tasks: "Tasks",
    calendar: "Calendar",
    email: "Email",
    automate: "Automations",
    activity: "Activity",
    settings: "Settings",
  };

  return titles[page] || "Nexus AI";
}

export default App;

