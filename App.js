import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Home, Calendar as CalIcon, Smile, BookOpen } from "lucide-react";
import "./styles.css";

// 🌿 Habit Tracker
const HabitTracker = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Drink Water 💧", completed: false },
          { id: 2, name: "Walk 5k Steps 🚶‍♀️", completed: false },
          { id: 3, name: "Read 10 Pages 📖", completed: false },
        ];
  });

  const [newHabit, setNewHabit] = useState("");

  const toggleHabit = (id) => {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, completed: !h.completed } : h
    );
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const newH = { id: Date.now(), name: newHabit, completed: false };
    const updated = [...habits, newH];
    setHabits(updated);
    setNewHabit("");
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">Today's Habits 🌿</h2>
      {habits.map((habit) => (
        <button
          key={habit.id}
          onClick={() => toggleHabit(habit.id)}
          className={`w-full p-3 rounded-xl text-left transition ${
            habit.completed
              ? "bg-green-200 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {habit.name}
        </button>
      ))}

      <div className="flex space-x-2 pt-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          className="flex-1 border p-2 rounded-xl"
        />
        <button
          onClick={addHabit}
          className="bg-purple-500 text-white px-4 rounded-xl"
        >
          ➕
        </button>
      </div>
    </div>
  );
};

// 😊 Mood Tracker + Analysis
const MoodTracker = () => {
  const [mood, setMood] = useState("");
  const [moodData, setMoodData] = useState(() => {
    const saved = localStorage.getItem("moodData");
    return saved ? JSON.parse(saved) : [];
  });

  const moods = ["😊", "😐", "😢", "😡", "😴"];

  useEffect(() => {
    localStorage.setItem("moodData", JSON.stringify(moodData));
  }, [moodData]);

  const recordMood = (m) => {
    setMood(m);
    const newData = [
      ...moodData,
      { date: new Date().toLocaleDateString(), mood: m },
    ];
    setMoodData(newData);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">What’s your mood today?</h2>
      <div className="flex justify-around">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => recordMood(m)}
            className={`text-3xl transition ${
              mood === m ? "scale-125" : "opacity-60"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      {mood && (
        <p className="text-center mt-3 text-gray-600">
          You’re feeling {mood} today
        </p>
      )}

      {moodData.length > 1 && (
        <div className="mt-5">
          <h3 className="text-md font-semibold mb-2">Mood & Habit Trends 📈</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={moodData.map((m, i) => ({
                day: i + 1,
                moodScore: (i * 2) % 5,
              }))}
            >
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="moodScore"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// 📅 Calendar with Streaks
const CalendarView = () => {
  const [streak, setStreak] = useState(5);
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    completed: Math.random() > 0.3,
  }));

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Your Streak 🔥</h2>
      <p className="text-sm text-gray-500 mb-2">
        Current streak: {streak} days
      </p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => (
          <div
            key={d.day}
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${
              d.completed ? "bg-green-400" : "bg-gray-200"
            }`}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
};

// 🔐 Journal
const Journal = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [journal, setJournal] = useState(
    () => localStorage.getItem("journal") || ""
  );

  const handleUnlock = () => {
    if (pin === "1234") setUnlocked(true);
    else alert("Wrong PIN! Try 1234 for demo.");
  };

  const saveJournal = () => {
    localStorage.setItem("journal", journal);
    alert("Saved securely 📝");
  };

  if (!unlocked)
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">
          Enter PIN to Unlock Journal 🔒
        </h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter PIN"
          className="border p-2 rounded-xl w-40"
        />
        <button
          onClick={handleUnlock}
          className="block mx-auto mt-3 bg-purple-500 text-white px-4 py-2 rounded-xl"
        >
          Unlock
        </button>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Private Journal 🪶</h2>
      <textarea
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        placeholder="Write your thoughts here..."
        className="w-full h-40 border p-3 rounded-xl"
      />
      <button
        onClick={saveJournal}
        className="mt-3 bg-green-500 text-white px-4 py-2 rounded-xl"
      >
        Save
      </button>
    </div>
  );
};

// 💬 Chatbot
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey 👋 How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    let reply = "I hear you ❤️ Want to talk more about it?";
    if (input.toLowerCase().includes("sad"))
      reply =
        "I'm sorry you're sad 😔. Maybe try journaling or go for a walk?";
    if (input.toLowerCase().includes("happy"))
      reply = "That's awesome! 🎉 Keep the good vibes going!";
    setMessages([...newMessages, { sender: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="p-4 flex flex-col h-[80vh]">
      <h2 className="text-lg font-semibold mb-2">
        Chat with your Wellness Buddy 🤖
      </h2>
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded-xl space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[75%] ${
              m.sender === "bot"
                ? "bg-purple-100 self-start"
                : "bg-green-100 self-end ml-auto"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex mt-3 space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          className="flex-1 border p-2 rounded-xl"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// 🏠 Main App
const App = () => {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(
    () => localStorage.getItem("username") || ""
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden h-[90vh] relative">
      {!user ? (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-3">Welcome 🌞</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="border p-2 rounded-xl w-2/3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                localStorage.setItem("username", e.target.value);
                setUser(e.target.value);
              }
            }}
          />
          <p className="text-sm text-gray-500 mt-2">Press Enter to continue</p>
        </div>
      ) : (
        <>
          {screen === "home" && (
            <div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {greeting}, {user}! 🌻
                </h2>
                <p className="text-gray-500 text-sm">
                  Let’s make today awesome.
                </p>
              </div>
              <HabitTracker />
              <div className="p-4">
                <h3 className="text-md font-semibold mb-2">Daily Motivation</h3>
                <img
                  src="https://i.imgur.com/dYcYQ7B.jpeg"
                  alt="Daily Meme"
                  className="rounded-xl w-full h-40 object-cover"
                />
              </div>
            </div>
          )}
          {screen === "calendar" && <CalendarView />}
          {screen === "mood" && <MoodTracker />}
          {screen === "journal" && <Journal />}
          {screen === "chatbot" && <Chatbot />}

          {/* 🌈 Bottom Nav */}
          <div className="fixed bottom-3 left-0 w-full flex justify-center pointer-events-none">
            <div className="w-full max-w-xs bg-white rounded-3xl shadow-lg py-2 px-3 flex justify-between items-center pointer-events-auto">
              <button
                onClick={() => setScreen("home")}
                className={`flex-1 text-center py-2 ${
                  screen === "home" ? "text-purple-600" : ""
                }`}
              >
                <Home size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => setScreen("calendar")}
                className={`flex-1 text-center py-2 ${
                  screen === "calendar" ? "text-purple-600" : ""
                }`}
              >
                <CalIcon size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => setScreen("mood")}
                className={`flex-1 text-center py-2 ${
                  screen === "mood" ? "text-purple-600" : ""
                }`}
              >
                <Smile size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => setScreen("journal")}
                className={`flex-1 text-center py-2 ${
                  screen === "journal" ? "text-purple-600" : ""
                }`}
              >
                <BookOpen size={18} className="mx-auto" />
              </button>
              <button
                onClick={() => setScreen("chatbot")}
                className={`flex-1 text-center py-2 ${
                  screen === "chatbot" ? "text-purple-600" : ""
                }`}
              >
                💬
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
