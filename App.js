import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Home, Calendar as CalIcon, Smile, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

/*
  App.js - Wellness Wizard (mobile-style layout)
  - Dashboard with meme and habits
  - Calendar with streak dots
  - Mood analytics with simple chart
  - Private journal with AI safety pop-up
  - Meme feed screen
  - Bottom navigation
*/

const sampleMeme1 = "https://i.imgflip.com/7y5j9a.jpg";
const sampleMeme2 = "https://i.imgflip.com/4/4t0m5.jpg";

function buildRecentDays(n = 30) {
  const arr = [];
  for (let i = n-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d);
  }
  return arr;
}

export default function App() {
  const [screen, setScreen] = useState("home"); // home, calendar, mood, journal, memes
  const [habits, setHabits] = useState([
    { id: "h1", title: "Meditation", done: false },
    { id: "h2", title: "Water (8 cups)", done: false },
    { id: "h3", title: "Read 10 min", done: false }
  ]);
  const [journal, setJournal] = useState("");
  const [aiResponse, setAIResponse] = useState(null);
  const [liked, setLiked] = useState({}); // meme likes
  const [mood, setMood] = useState("Calm");
  const [moodHistory, setMoodHistory] = useState([
    { day: "Mon", value: 6 },
    { day: "Tue", value: 7 },
    { day: "Wed", value: 6 },
    { day: "Thu", value: 7 },
    { day: "Fri", value: 8 },
    { day: "Sat", value: 7 },
    { day: "Sun", value: 7 }
  ]);
  // simple completed-days map (for calendar)
  const recentDays = useMemo(() => buildRecentDays(35), []);
  const [completedMap, setCompletedMap] = useState(() => {
    const m = {};
    // seed some completed days for demo
    recentDays.slice(5, 25).forEach((d, i) => {
      if (i % 3 !== 0) {
        m[d.toDateString()] = true;
      }
    });
    return m;
  });

  const toggleHabit = (id) => {
    setHabits((h) => h.map(x => x.id === id ? {...x, done: !x.done} : x));
  };

  const saveJournal = () => {
    // simple local AI keyword detector
    const txt = journal.toLowerCase();
    const critical = ["kill myself", "i want to die", "suicide"];
    const high = ["hurt myself", "self harm", "cut myself"];
    const medium = ["hopeless", "worthless", "no point"];
    const low = ["sad", "depressed", "anxious", "stressed"];
    let level = null;
    if (critical.some(w => txt.includes(w))) level = "critical";
    else if (high.some(w => txt.includes(w))) level = "high";
    else if (medium.some(w => txt.includes(w))) level = "medium";
    else if (low.some(w => txt.includes(w))) level = "low";

    if (level) {
      setAIResponse({
        level,
        message: level === "critical" ? "This sounds urgent. Please contact emergency services or a crisis line now." : "I can tell you're feeling down. Would you like a grounding exercise or calming playlist?",
        options: level === "critical" ? ["Call crisis line", "Show resources"] : ["Grounding activity", "Calming playlist"]
      });
    } else {
      setAIResponse(null);
      // clear journal after save for demo
      setJournal("");
      alert("Saved to your private vault (demo).");
    }
  };

  const toggleLike = (key) => {
    setLiked(l => ({...l, [key]: (l[key]||0)+1 }));
  };

  const currentStreak = () => {
    // count consecutive trues from the latest day backward
    const keys = recentDays.map(d => d.toDateString());
    let streak = 0;
    for (let i = keys.length - 1; i >= 0; i--) {
      if (completedMap[keys[i]]) streak++;
      else break;
    }
    return streak;
  };

  // small UI components to match screenshot style
  const Card = ({children, className=""}) => <div className={"bg-white rounded-3xl shadow-sm p-4 " + className}>{children}</div>

  return (
    <div className="min-h-screen flex flex-col items-center pt-6 pb-20 px-4 bg-gradient-to-b from-[#f6f1fa] to-[#fbf5fb]">
      {/* content container (mobile width) */}
      <div className="w-full max-w-xs space-y-5">

        {/* Home / Dashboard */}
        {screen === "home" && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-[#101025]">Good morning, Jamie!</h1>
                <p className="text-sm text-gray-500">Your daily wellness at a glance</p>
              </div>
              <div className="text-sm text-gray-500">●</div>
            </div>

            <Card>
              <img src={sampleMeme1} alt="meme" className="rounded-2xl w-full h-36 object-cover mb-3" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-800">
                    <span className="bg-[#eef2ff] p-2 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L12 22" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
                    <div> Meditation</div>
                  </div>
                  <div>›</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-800">
                    <span className="bg-[#eef7ff] p-2 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L12 22" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
                    <div> Water</div>
                  </div>
                  <div>›</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-800">
                    <span className="bg-[#f0f0ff] p-2 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L12 22" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"/></svg></span>
                    <div> Read 10 min</div>
                  </div>
                  <div>›</div>
                </div>

                <button onClick={() => setScreen("calendar")} className="w-full mt-3 text-purple-600 font-semibold">View Calendar</button>
              </div>
            </Card>
          </div>
        )}

        {/* Calendar */}
        {screen === "calendar" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#101025] text-center">Calendar</h2>
            <p className="text-center text-gray-500">April 2024</p>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {recentDays.map((d, idx) => {
                const key = d.toDateString();
                const done = !!completedMap[key];
                return (
                  <div key={idx} className="h-10 flex items-center justify-center">
                    <div className={`h-8 w-8 rounded-full ${done ? 'bg-purple-300 text-white' : 'text-gray-600' } flex items-center justify-center`}>
                      {d.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setScreen("mood")} className="text-purple-600 font-semibold mt-4">Today's mood...</button>
          </div>
        )}

        {/* Mood / Analytics */}
        {screen === "mood" && (
          <div className="space-y-4">
            <div className="flex items-center">
              <button onClick={() => setScreen("calendar")} className="mr-2">←</button>
              <h2 className="text-xl font-semibold">Your private space</h2>
            </div>

            <Card>
              <div style={{height: 90}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodHistory}>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={[4,9]} hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-3">
              <Card>
                <div className="text-sm text-gray-500">Trends</div>
                <div className="mt-2 text-2xl font-semibold">83%</div>
                <div className="text-sm text-gray-500 mt-1">Mood is generally <span className="font-semibold">Calm</span></div>
              </Card>

              <Card>
                <div className="text-sm text-gray-500">History</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {habits.map(h => <li key={h.id} className="flex justify-between"><div>{h.title}</div><div className="text-gray-400">{h.done ? '✓' : ''}</div></li>)}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {/* Journal with AI pop-up */}
        {screen === "journal" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your private space</h2>
            <Card>
              <textarea value={journal} onChange={e => setJournal(e.target.value)} placeholder="Journal your thoughts..." className="w-full rounded-2xl p-3 min-h-[120px] border border-gray-100" />
              <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">AI</div>
                AI safety watcher scanning for distress signals...
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={saveJournal} className="bg-purple-600 text-white px-4 py-2 rounded-full">Save to Vault</button>
                <button onClick={() => { setJournal(''); setAIResponse(null); }} className="px-4 py-2 rounded-full border">Discard</button>
              </div>
            </Card>
          </div>
        )}

        {/* Meme Feed */}
        {screen === "memes" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Meme Feed</h2>
            <Card className="p-0">
              <img src={sampleMeme2} alt="meme" className="w-full h-64 object-cover rounded-2xl" />
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-6-4.35-9-7a6 6 0 0 1 9-9 6 6 0 0 1 9 9c-3 2.65-9 7-9 7z" stroke="#111827" strokeWidth="1.2"/></svg> <span>{(liked['m2']||24)}</span></div>
                <button onClick={() => toggleLike('m2')} className="text-sm text-gray-600">Like</button>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* bottom nav */}
      <div className="fixed bottom-3 left-0 w-full flex justify-center pointer-events-none">
        <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg py-2 px-3 flex justify-between items-center pointer-events-auto">
          <button onClick={() => setScreen("home")} className={`flex-1 text-center py-2 ${screen==='home'?'text-purple-600':''}`}><Home size={18} className="mx-auto"/></button>
          <button onClick={() => setScreen("calendar")} className={`flex-1 text-center py-2 ${screen==='calendar'?'text-purple-600':''}`}><CalIcon size={18} className="mx-auto" /></button>
          <button onClick={() => setScreen("mood")} className={`flex-1 text-center py-2 ${screen==='mood'?'text-purple-600':''}`}><Smile size={18} className="mx-auto" /></button>
          <button onClick={() => setScreen("journal")} className={`flex-1 text-center py-2 ${screen==='journal'?'text-purple-600':''}`}><BookOpen size={18} className="mx-auto" /></button>
          <button onClick={() => setScreen("memes")} className={`flex-1 text-center py-2 ${screen==='memes'?'text-purple-600':''}`}><span className="text-xl">😂</span></button>
        </div>
      </div>

      {/* AI response pop-up */}
      {aiResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-[#1A1B2E] text-white rounded-3xl p-6 w-80 shadow-lg space-y-4 animate-fadeIn">
            <p className="text-sm leading-relaxed">{aiResponse.message}</p>
            <div className="flex flex-col gap-2">
              {aiResponse.options.map(opt => (
                <button key={opt} className="bg-[#2C2D45] rounded-full px-4 py-2">{opt}</button>
              ))}
            </div>
            <button onClick={() => setAIResponse(null)} className="text-gray-400 text-xs mt-2">✕ Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
