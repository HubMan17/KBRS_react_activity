// AchievementsPage.tsx
import React, { useMemo, useState } from "react";
import type { Achievement } from "./DiscordProfileCard";

export function AchievementsPage({ items }: { items: Achievement[] }) {
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [sortBy, setSortBy] = useState<"rarity" | "date" | "title">("rarity");

  const filtered = useMemo(
    () => items.filter(a => (showOnlyUnlocked ? a.unlocked : true)),
    [items, showOnlyUnlocked]
  );

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortBy === "date") {
      copy.sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""));
    } else if (sortBy === "title") {
      copy.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // rarity order
      const order = { legendary: 3, epic: 2, rare: 1, common: 0 } as const;
      copy.sort((a, b) => (order[(b.rarity ?? "common")] - order[(a.rarity ?? "common")]));
    }
    return copy;
  }, [filtered, sortBy]);

  const have = items.filter(i => i.unlocked).length;
  const percent = Math.round((have / Math.max(1, items.length)) * 100);

  return (
    <section className="w-full max-w-5xl mx-auto">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Достижения</h1>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Открыто {have} из {items.length} ({percent}%)
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Сортировать:
          </label>
          <select
            className="px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-800/60 border border-slate-200/70 dark:border-gray-700/60"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
          >
            <option value="rarity">по редкости</option>
            <option value="date">по дате</option>
            <option value="title">по названию</option>
          </select>

          <label className="ml-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showOnlyUnlocked}
              onChange={e => setShowOnlyUnlocked(e.target.checked)}
            />
            только открытые
          </label>
        </div>
      </div>

      {/* grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(a => (
          <BigAchievementCard key={a.id} a={a} />
        ))}
      </div>
    </section>
  );
}

function BigAchievementCard({ a }: { a: Achievement }) {
  const unlocked = a.unlocked;
  const p = Math.min(100, Math.max(0, a.progress ?? (unlocked ? 100 : 0)));
  const ring =
    a.rarity === "legendary"
      ? "ring-amber-400/60"
      : a.rarity === "epic"
      ? "ring-fuchsia-400/60"
      : a.rarity === "rare"
      ? "ring-sky-400/60"
      : "ring-slate-300/70 dark:ring-gray-600/70";

  return (
    <article className="relative rounded-2xl overflow-hidden bg-white/70 dark:bg-gray-800/50 border border-slate-200/70 dark:border-gray-700/60 shadow-md p-4">
      <div className="flex items-start gap-4">
        <div className={`h-16 w-16 rounded-xl overflow-hidden ring-2 ${ring} shrink-0`}>
          <img
            src={a.iconUrl || defaultIconForRarity(a.rarity)}
            className={unlocked ? "h-full w-full object-cover" : "h-full w-full object-cover grayscale-[55%] opacity-85"}
            alt=""
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {a.title}
            </h3>
            <RarityTag r={a.rarity ?? "common"} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {a.description}
          </p>
          {/* progress bar */}
          <div className="mt-3">
            <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-gray-700/70 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-fuchsia-500 to-rose-500 dark:from-violet-500 dark:via-pink-500 dark:to-indigo-500"
                style={{ width: `${p}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {unlocked ? "Открыто" : `${p}%`}
              {a.unlockedAt && unlocked ? ` • ${new Date(a.unlockedAt).toLocaleDateString()}` : ""}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function RarityTag({ r }: { r: "common" | "rare" | "epic" | "legendary" }) {
  const cls =
    r === "legendary"
      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-400/40"
      : r === "epic"
      ? "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 ring-fuchsia-400/40"
      : r === "rare"
      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-400/40"
      : "bg-slate-500/15 text-slate-700 dark:text-slate-300 ring-slate-400/40";
  return <span className={`px-2 py-0.5 text-[11px] rounded-md ring-1 uppercase ${cls}`}>{r}</span>;
}

function defaultIconForRarity(r?: "common" | "rare" | "epic" | "legendary") {
  return r === "legendary"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg"
    : r === "epic"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31f.svg"
    : r === "rare"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f539.svg"
    : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f538.svg";
}
