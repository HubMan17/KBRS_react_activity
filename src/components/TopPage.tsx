// TopPage.tsx
import React, { useMemo } from "react";

type Rarity = "common" | "rare" | "epic" | "legendary";
type Achievement = {
  id: string;
  iconUrl?: string;
  rarity?: Rarity;
  unlocked: boolean;
  progress?: number; // 0..100
};

type LeaderEntry = {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  achievements?: Achievement[];
};

export default function TopPage({ entries }: { entries: LeaderEntry[] }) {
  // сортировка: lvl desc, затем xp desc
  const sorted = useMemo(
    () =>
      [...entries].sort((a, b) =>
        b.level !== a.level ? b.level - a.level : b.xp - a.xp
      ),
    [entries]
  );

  return (
    <section className="w-full max-w-4xl mx-auto">
      {/* заголовок */}
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Топ участников
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Сортировка: уровень → опыт
          </p>
        </div>
      </header>

      {/* список */}
      <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-gray-700/60 shadow-md bg-white/70 dark:bg-gray-900/60 backdrop-blur">
        {/* хедер-строка */}
        <div className="grid grid-cols-[60px,72px,1fr,120px] sm:grid-cols-[80px,88px,1fr,160px] items-center px-3 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-gray-800/60">
          <div>Место</div>
          <div>Аватар</div>
          <div>Ник</div>
          <div className="text-right">Уровень / Ачивки</div>
        </div>

        {/* строки */}
        <ul className="divide-y divide-slate-200/70 dark:divide-gray-700/60">
          {sorted.map((u, i) => (
            <LeaderRow key={u.id} rank={i + 1} user={u} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function LeaderRow({ rank, user }: { rank: number; user: LeaderEntry }) {
  const medal =
    rank === 1
      ? "bg-amber-400/20 text-amber-600 ring-amber-300/50"
      : rank === 2
      ? "bg-slate-400/20 text-slate-600 ring-slate-300/50"
      : rank === 3
      ? "bg-orange-400/20 text-orange-600 ring-orange-300/50"
      : "bg-slate-200/50 text-slate-600 ring-slate-300/40 dark:bg-gray-800/40 dark:text-slate-300 dark:ring-gray-700/50";

  return (
    <li className="grid grid-cols-[60px,72px,1fr,120px] sm:grid-cols-[80px,88px,1fr,160px] items-center px-3 sm:px-4 py-3 hover:bg-slate-50/70 dark:hover:bg-gray-800/50 transition-colors">
      {/* место */}
      <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-bold ring-1 ${medal}`}>
          {rank}
        </span>
      </div>

      {/* аватар */}
      <div className="flex items-center">
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover ring-2 ring-white dark:ring-gray-900 shadow"
        />
      </div>

      {/* ник + лента ачивок */}
      <div className="min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
            {user.username}
          </span>
        </div>

        {/* тонкая строка ачивок */}
        <div className="mt-1 flex items-center gap-1">
          <AchievementsStrip items={user.achievements ?? []} max={8} />
        </div>
      </div>

      {/* уровень + xp */}
      <div className="flex flex-col items-end">
        <div className="text-right">
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">
            Lvl {user.level}
          </span>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
            {user.xp.toLocaleString()} XP
          </span>
        </div>

        {/* тонкая прогресс-полоска (кастомная: тут считаем % условно) */}
        <div className="mt-1 h-1.5 w-32 sm:w-40 rounded-full bg-slate-200/80 dark:bg-gray-700/70 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-rose-500 dark:from-violet-500 dark:via-pink-500 dark:to-indigo-500"
            style={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }} // временно: % к следующему 1000
          />
        </div>
      </div>
    </li>
  );
}

/* ==== компактная лента ачивок ==== */
function AchievementsStrip({
  items,
  max = 8,
}: {
  items: Achievement[];
  max?: number;
}) {
  // показываем сначала открытые; до max; затем "+N"
  const open = items.filter((a) => a.unlocked);
  const closed = items.filter((a) => !a.unlocked);
  const visible = [
    ...open.slice(0, max),
    ...closed.slice(0, Math.max(0, max - Math.min(max, open.length))),
  ];
  const overflow = items.length - visible.length;

  return (
    <div className="flex items-center gap-1">
      {visible.map((a) => (
        <MiniIcon key={a.id} a={a} />
      ))}
      {overflow > 0 && (
        <div className="h-6 w-6 rounded-md grid place-items-center text-[11px] font-semibold bg-slate-200/80 dark:bg-gray-700/70 text-slate-700 dark:text-slate-200">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function MiniIcon({ a }: { a: Achievement }) {
  const ring =
    a.rarity === "legendary"
      ? "ring-amber-400/70"
      : a.rarity === "epic"
      ? "ring-fuchsia-400/70"
      : a.rarity === "rare"
      ? "ring-sky-400/70"
      : "ring-slate-300/70 dark:ring-gray-600/70";

  const filter = a.unlocked ? "" : "grayscale-[60%] opacity-80";

  return (
    <div className={`relative h-6 w-6 rounded-md overflow-hidden ring-2 ${ring}`}>
      <img
        src={
          a.iconUrl ||
          "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f539.svg"
        }
        className={`h-full w-full object-cover ${filter}`}
        alt=""
      />
      {/* крошечная полоска прогресса снизу */}
      {!a.unlocked && (a.progress ?? 0) > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300/80 dark:bg-gray-700/80">
          <div
            className="h-full bg-sky-500 dark:bg-violet-500"
            style={{ width: `${Math.min(100, Math.max(0, a.progress ?? 0))}%` }}
          />
        </div>
      )}
    </div>
  );
}
