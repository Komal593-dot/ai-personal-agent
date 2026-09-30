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
} from "lucide-react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // Send request to FastAPI backend
  const runAgent = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("http://127.0.0.1:8000/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply(
        "Could not connect to the AI agent. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Mail,
      title: "Send an email",
      text: "Draft and send an email",
    },
    {
      icon: CalendarDays,
      title: "Schedule a meeting",
      text: "Find a free time slot",
    },
    {
      icon: CheckSquare,
      title: "Create a task",
      text: "Add something to my tasks",
    },
    {
      icon: Zap,
      title: "Create automation",
      text: "Automate a recurring task",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-950 p-5">

        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <Sparkles size={21} />
          </div>

          <div>
            <h1 className="font-bold">Nexus AI</h1>
            <p className="text-xs text-slate-500">
              Personal Agent
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavItem icon={Home} text="Home" active />
          <NavItem icon={Sparkles} text="Agent" />
          <NavItem icon={CheckSquare} text="Tasks" />
          <NavItem icon={CalendarDays} text="Calendar" />
          <NavItem icon={Mail} text="Email" />
          <NavItem icon={Zap} text="Automate" />
          <NavItem icon={Activity} text="Activity" />
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-5 left-5 right-5">

          <NavItem icon={Settings} text="Settings" />

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <p className="text-xs text-slate-500">
              AI Agent Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

              <span className="text-sm">
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>


      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 min-h-screen p-8">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Thursday, September 18
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Good afternoon 👋
            </h2>
          </div>

          <div className="flex items-center gap-3">

            {/* Notification */}
            <button className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition hover:bg-slate-800">
              <Bell size={18} />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
                K
              </div>

              <span className="text-sm">
                Komal
              </span>

            </div>
          </div>
        </header>


        {/* ================= AI AGENT ================= */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">

          <div className="mb-5">

            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-400">
                <Sparkles size={17} />
              </div>

              <span className="font-semibold">
                Ask your AI agent
              </span>

            </div>

            <p className="text-sm text-slate-500">
              Tell me what you want to accomplish. I can plan and
              execute multi-step tasks for you.
            </p>

          </div>


          {/* Input */}
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


          {/* Suggestions */}
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


          {/* Agent Response */}
          {(loading || reply) && (
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
          )}

        </section>


        {/* ================= QUICK ACTIONS ================= */}
        <section className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-lg font-semibold">
              Quick actions
            </h3>

            <button className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300">
              View all
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="grid grid-cols-4 gap-4">

            {quickActions.map((action) => {

              const Icon = action.icon;

              return (
                <div
                  key={action.title}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-violet-500 hover:bg-slate-900/80"
                >

                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <h4 className="font-medium">
                    {action.title}
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    {action.text}
                  </p>

                </div>
              );
            })}

          </div>

        </section>


        {/* ================= DASHBOARD CARDS ================= */}
        <div className="grid grid-cols-2 gap-6">


          {/* TODAY'S TASKS */}
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-semibold">
                Today's tasks
              </h3>

              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
                3 remaining
              </span>

            </div>


            <Task
              text="Complete AI assignment"
              checked={false}
            />

            <Task
              text="Practice C++ DSA"
              checked={false}
            />

            <Task
              text="Review project progress"
              checked={true}
            />

          </section>


          {/* UPCOMING */}
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-semibold">
                Upcoming
              </h3>

              <button className="flex items-center gap-1 text-xs text-violet-400">
                Calendar
                <ArrowRight size={13} />
              </button>

            </div>


            <Event
              time="10:00 AM"
              title="College"
              subtitle="Computer Engineering"
            />

            <Event
              time="5:30 PM"
              title="DSA Practice"
              subtitle="C++ • 90 minutes"
            />

            <Event
              time="8:00 PM"
              title="Project Work"
              subtitle="AI Personal Agent"
            />

          </section>

        </div>


        {/* ================= BOTTOM STATS ================= */}
        <section className="mt-6 grid grid-cols-3 gap-4">

          <Stat
            icon={CheckCircle2}
            value="12"
            label="Tasks completed"
          />

          <Stat
            icon={Zap}
            value="4"
            label="Automations active"
          />

          <Stat
            icon={Activity}
            value="28"
            label="Agent actions"
          />

        </section>

      </main>
    </div>
  );
}


/* ================= NAV ITEM ================= */

function NavItem({ icon: Icon, text, active }) {

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-violet-600/10 text-violet-400"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >

      <Icon
        size={18}
        strokeWidth={1.8}
      />

      <span>
        {text}
      </span>

    </div>
  );
}


/* ================= SUGGESTION ================= */

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


/* ================= TASK ================= */

function Task({ text, checked }) {

  return (
    <div className="flex items-center gap-3 border-b border-slate-800 py-3 last:border-0">

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

    </div>
  );
}


/* ================= EVENT ================= */

function Event({ time, title, subtitle }) {

  return (
    <div className="mb-3 flex gap-4 rounded-lg bg-slate-950 p-3">

      <div className="w-20 text-xs text-slate-500">
        {time}
      </div>

      <div>

        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


/* ================= STAT ================= */

function Stat({ icon: Icon, value, label }) {

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
        <Icon size={20} />
      </div>

      <div>

        <p className="text-xl font-bold">
          {value}
        </p>

        <p className="text-xs text-slate-500">
          {label}
        </p>

      </div>

    </div>
  );
}


export default App;