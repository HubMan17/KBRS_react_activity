// App.tsx — Baduk (Go) с простым ботом (React 18, без внешних зависимостей)
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { WelcomeCard } from "./components/WelcomeCard";
import DiscordProfileCard from "./components/DiscordProfileCard";
import TopPage from "./components/TopPage";

/* ===== Основной компонент ===== */
export default function App() {
  const demo: LeaderEntry[] = [
  {
    id: "1",
    username: "ONE",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    level: 21,
    xp: 15320,
    achievements: [
      { id: "a1", unlocked: true, rarity: "legendary" },
      { id: "a2", unlocked: true, rarity: "epic" },
      { id: "a3", unlocked: false, progress: 60, rarity: "rare" },
      { id: "a4", unlocked: false, progress: 20 },
    ],
  },
  {
    id: "2",
    username: "krONEkr",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    level: 21,
    xp: 15110,
    achievements: [
      { id: "b1", unlocked: true, rarity: "epic" },
      { id: "b2", unlocked: false, rarity: "legendary", progress: 15 },
    ],
  },
  {
    id: "3",
    username: "Artem",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    level: 19,
    xp: 9900,
    achievements: [{ id: "c1", unlocked: true }],
  },
];

  return (
    <div className="max-w-[720px] h-full flex">
      <div className="w-full items-center justify-center">
        
        {/* <WelcomeCard theme="light" name="krONEkr" avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROzG0j6kZm1khmS5Em7ZhBuZ4ttZM7JNAaOQ&s" /> */}
        {/* <WelcomeCard theme="dark"  name="krONEkr" avatarUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROzG0j6kZm1khmS5Em7ZhBuZ4ttZM7JNAaOQ&s" /> */}
      
        {/* Навигация */}
        <nav className="w-[90%] max-w-3xl flex justify-center items-center gap-0 overflow-hidden rounded-2xl shadow-md backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-slate-300/60 dark:border-gray-700/50 mb-10 transition-all duration-500">
        {[
          { label: "Профиль", id: "profile" },
          { label: "Топ", id: "top" },
          { label: "Статистика", id: "stats" },
        ].map((item, i, arr) => (
          <button
            key={i}
            className={[
              "flex-1 py-4 text-lg font-semibold tracking-wide transition-colors duration-300",
              "text-slate-700 dark:text-gray-200 hover:bg-slate-200/70 dark:hover:bg-gray-700/40",
              // границы между элементами, кроме последнего
              i < arr.length - 1
                ? "border-r border-slate-300/50 dark:border-gray-700/40"
                : "",
              // аккуратные скругления только по краям
              i === 0 ? "rounded-l-2xl" : "",
              i === arr.length - 1 ? "rounded-r-2xl" : "",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* <div>
        <DiscordProfileCard
          loading={false}
          user={{
            id: "123456789012345678",
            username: "krONEkr",
            globalName: "ONE",
            discriminator: null,
            avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROzG0j6kZm1khmS5Em7ZhBuZ4ttZM7JNAaOQ&s",
            bannerUrl: null,
            accentColor: "5865F2",
          }}
          member={{
            nick: "ONE",
            presence: "online",
            activityName: "Baduk",
            joinedAt: "2024-04-05T12:34:56.000Z",
            roles: [
              { id: "1", name: "Admin", color: "#E11D48" },
              { id: "2", name: "Korean", color: "#2563EB" },
            ],
          }}
          stats={{
            level: 7,
            xp: 420,
            xpToNext: 1000,
            messages: 1532,
            reactions: 284,
            rankPlace: 3,
          }}
          achievements={[
            {
              id: "a1",
              title: "100 сообщений",
              description: "Написать 100 сообщений в чате",
              rarity: "common",
              iconUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ac.svg",
              unlocked: true,
              progress: 100,
              unlockedAt: "2025-10-20T12:00:00Z",
            },
            {
              id: "a2",
              title: "Эмодзи-мастер",
              description: "Отправить 1000 эмодзи",
              rarity: "rare",
              unlocked: false,
              progress: 40,
            },
            {
              id: "a3",
              title: "Реакционер",
              description: "Поставить 500 реакций",
              rarity: "epic",
              unlocked: false,
              progress: 10,
            },
            {
              id: "a4",
              title: "Легенда сервера",
              description: "Достичь 50 уровня",
              rarity: "legendary",
              unlocked: false,
              progress: 0,
            },
          ]}
        />
      </div> */}

        <TopPage entries={demo} />
      </div>
    </div>
  );
}
