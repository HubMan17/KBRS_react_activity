// AchievementShowcase.tsx
import React from "react";
import type { Achievement } from "./DiscordProfileCard"; // или откуда у тебя тип

export function AchievementShowcase({
  items,
  max = 10,
  className = "",
  title = "Витрина ачивок",
}: {
  items: Achievement[];
  max?: number;            // сколько иконок показать в ряд
  className?: string;
  title?: string;
}) {
  const unlocked = items.filter(a => a.unlocked);
  const locked = items.filter(a => !a.unlocked);
  const total = items.length;
  const have = unlocked.length;
  const percent = Math.round((have / Math.max(1, total)) * 100);

  const visible = [
    ...unlocked.slice(0, max),               // приоритет — открытые
    ...locked.slice(0, Math.max(0, max - Math.min(max, unlocked.length))),
  ];
  const overflow = total - visible.length;

  return (
    <div className={["rounded-2xl p-4 bg-white/60 dark:bg-gray-800/40 border border-slate-200/70 dark:border-gray-700/50 shadow-sm", className].join(" ")}>
      {/* шапка + прогресс */}
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </div>
        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Вы получили <b>{have}</b> из <b>{total}</b> ({percent}%)
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-slate-200/80 dark:bg-gray-700/70 overflow-hidden">
          <div
            className="h-full bg-sky-500 dark:bg-violet-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* ряд маленьких иконок */}
      <div className="flex items-center gap-2">
        {visible.map(a => (
          <MiniAchIcon key={a.id} a={a} />
        ))}
        {overflow > 0 && (
          <div
            title={`Ещё ${overflow}`}
            className="h-10 w-10 rounded-lg grid place-items-center bg-slate-200/70 dark:bg-gray-700/60 text-[13px] font-semibold text-slate-700 dark:text-slate-200"
          >
            +{overflow}
          </div>
        )}
      </div>

      {/* ссылка на полную страницу */}
      <div className="mt-3">
        <a
          href="#/achievements" /* замени на свой роут */
          className="text-sm font-medium text-sky-700 dark:text-violet-300 hover:underline"
        >
          Мои достижения →
        </a>
      </div>
    </div>
  );
}

function MiniAchIcon({ a }: { a: Achievement }) {
  // рамка по редкости (тонкие акценты)
  const ring =
    a.rarity === "legendary" ? "ring-amber-400/70"
    : a.rarity === "epic"    ? "ring-fuchsia-400/70"
    : a.rarity === "rare"    ? "ring-sky-400/70"
    : "ring-slate-300/70 dark:ring-gray-600/70";

  // серый фильтр для закрытых
  const lockFilter = a.unlocked ? "" : "grayscale-[65%] brightness-90 opacity-80";

  return (
    <div
      className={`relative h-10 w-10 rounded-lg overflow-hidden ring-2 ${ring} bg-white/80 dark:bg-gray-800/70`}
      title={`${a.title}\n${a.description ?? ""}`}
    >
      <img
        src={a.iconUrl || defaultIconForRarity(a.rarity)}
        alt=""
        className={`h-full w-full object-cover ${lockFilter}`}
      />
      {/* мини-индикатор прогресса снизу, если не открыта, но есть прогресс */}
      {!a.unlocked && (a.progress ?? 0) > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300/70 dark:bg-gray-700/70">
          <div
            className="h-full bg-sky-500 dark:bg-violet-500"
            style={{ width: `${Math.min(100, Math.max(0, a.progress ?? 0))}%` }}
          />
        </div>
      )}
    </div>
  );
}

// при необходимости, тот же helper, что мы уже добавляли ранее
function defaultIconForRarity(r?: "common" | "rare" | "epic" | "legendary") {
  return r === "legendary"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg"
    : r === "epic"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31f.svg"
    : r === "rare"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f539.svg"
    : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f538.svg";
}
