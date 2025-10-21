// DiscordProfileCard.tsx
import React from "react";
import { AchievementShowcase } from "./AchievementShowcase";

type Presence = "online" | "idle" | "dnd" | "offline";

type DiscordUser = {
  id: string;
  username: string;          // "krONEkr"
  globalName?: string | null; // "ONE" (display name)
  discriminator?: string | null; // "0001" (старое)
  avatarUrl: string;         // собранный CDN url
  bannerUrl?: string | null;
  accentColor?: string | null; // hex без '#', e.g. "5865F2"
};

type GuildRole = {
  id: string;
  name: string;
  color?: string | null;  // hex с '#', если хочешь подсветить
  isHoisted?: boolean;
};

type GuildMember = {
  nick?: string | null;
  roles: GuildRole[];
  joinedAt?: string; // ISO
  presence?: Presence;
  activityName?: string | null; // игра/активность
};

type Stats = {
  level: number;
  xp: number;
  xpToNext: number;
  messages?: number;
  reactions?: number;
  rankPlace?: number;
};

// 1) Добавь (или обнови) эти типы рядом с компонентом
type Rarity = "common" | "rare" | "epic" | "legendary";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  rarity?: Rarity;
  unlocked: boolean;
  progress?: number;       // 0..100
  unlockedAt?: string | null;
};

type Props = {
  user: DiscordUser;
  member?: GuildMember;
  stats?: Stats;
  loading?: boolean;
  achievements?: Achievement[];   // ← добавили!
};

export default function DiscordProfileCard({ user, member, stats, loading, achievements = [],  }: Props) {
  const displayName =
    member?.nick || user.globalName || user.username;

  const presence: Presence = member?.presence || "offline";

  const statusColor =
    presence === "online" ? "bg-emerald-500"
    : presence === "idle"  ? "bg-amber-400"
    : presence === "dnd"   ? "bg-rose-500"
    : "bg-slate-400";

  const bannerStyle = user.bannerUrl
    ? { backgroundImage: `url(${user.bannerUrl})` }
    : { background: `linear-gradient(135deg, rgba(99,102,241,.25), rgba(236,72,153,.25)), ${
        user.accentColor ? `#${user.accentColor}` : "var(--tw-gradient-to)"
      }` };

  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-300/70 dark:border-gray-700/60 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-colors">
      {/* banner */}
      <div
        className="h-36 w-full bg-cover bg-center relative"
        style={bannerStyle as React.CSSProperties}
      >
        {/* декоративный flare */}
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_30%,rgba(255,255,255,.35),transparent)] dark:bg-[radial-gradient(60%_80%_at_80%_30%,rgba(168,85,247,.18),transparent)]"></div>

        {/* аватар */}
        <div className="absolute -bottom-10 left-6">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-lg"
            />
            <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-4 ring-white dark:ring-gray-900 ${statusColor}`}></span>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="pt-12 px-6 pb-6">
        {/* header line */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {displayName}
              <span className="ml-2 text-sm font-mono text-slate-500 dark:text-slate-400">
                @{user.username}
                {user.discriminator ? `#${user.discriminator}` : ""}
              </span>
            </h1>
            {member?.activityName && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Активность: <span className="font-medium">{member.activityName}</span>
              </p>
            )}
          </div>

          {/* quick stats */}
          {stats && (
            <div className="flex items-center gap-3">
              <Badge label={`Lvl ${stats.level}`} />
              {typeof stats.rankPlace === "number" && (
                <Badge label={`Top #${stats.rankPlace}`} tone="indigo" />
              )}
            </div>
          )}
        </div>

        {/* roles */}
        {member?.roles?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {member.roles.map((r) => (
              <RolePill key={r.id} name={r.name} color={r.color} />
            ))}
          </div>
        ) : null}

        {/* XP progress */}
        {stats && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600 dark:text-slate-400">Опыт</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {stats.xp} / {stats.xpToNext}
              </span>
            </div>
            <Progress value={Math.min(100, Math.round((stats.xp / Math.max(1, stats.xpToNext)) * 100))} />
            {/* extra numbers */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatTile label="Сообщений" value={stats.messages ?? 0} />
              <StatTile label="Реакций" value={stats.reactions ?? 0} />
              <StatTile label="Статус" value={presenceLabel(presence)} />
            </div>

            {/* Витрина ачивок */}
            {achievements && achievements.length > 0 && (
            <div className="mt-6">
                <AchievementShowcase items={achievements} max={10} />
            </div>
            )}
          </div>
        )}

        {/* meta */}
        <div className="mt-6 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
          {member?.joinedAt && (
            <div>
              В гильдии с:{" "}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(member.joinedAt)}
              </span>
            </div>
          )}
          <div>
            ID: <span className="font-mono text-slate-800 dark:text-slate-200">{user.id}</span>
          </div>
        </div>
      </div>

      {/* skeleton */}
      {loading && <SkeletonOverlay />}
    </section>
  );
}

/* --- small ui atoms --- */

function Badge({ label, tone = "violet" }: { label: string; tone?: "violet" | "indigo" }) {
  const toneClass =
    tone === "indigo"
      ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 ring-indigo-500/30"
      : "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30";
  return (
    <span className={`px-3 py-1 rounded-xl text-sm font-semibold ring-1 ${toneClass}`}>
      {label}
    </span>
  );
}

function RolePill({ name, color }: { name: string; color?: string | null }) {
  const style: React.CSSProperties | undefined = color
    ? {
        color,
        boxShadow: `inset 0 0 0 1px ${color}33`,
        background: `${color}14`,
      }
    : undefined;
  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 ring-1 ring-slate-300/60 dark:ring-gray-700/50"
      style={style}
    >
      {name}
    </span>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-3 rounded-full bg-slate-200/70 dark:bg-gray-800/70 overflow-hidden ring-1 ring-slate-200 dark:ring-gray-700">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 dark:from-purple-500 dark:via-pink-500 dark:to-indigo-500 transition-[width] duration-700"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl p-3 bg-white/60 dark:bg-gray-800/40 border border-slate-200/70 dark:border-gray-700/50 shadow-sm text-center">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">{value}</div>
    </div>
  );
}

function SkeletonOverlay() {
  return (
    <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-[2px] animate-pulse pointer-events-none" />
  );
}

function AchievementsGrid({ items }: { items: Achievement[] }) {
  return (
    <div className="grid gap-3
      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <AchievementCard key={a.id} a={a} />
      ))}
    </div>
  );
}

function AchievementCard({ a }: { a: Achievement }) {
  const ring = ringByRarity(a.rarity ?? "common");
  const progress = Math.max(0, Math.min(100, a.progress ?? (a.unlocked ? 100 : 0)));

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border shadow-sm p-3 flex items-center gap-3",
        "bg-white/70 dark:bg-gray-800/40",
        "border-slate-200/70 dark:border-gray-700/50",
        a.unlocked ? "opacity-100" : "opacity-75",
      ].join(" ")}
      title={a.description}
    >
      {/* прогресс-колечко */}
      <div className="relative shrink-0">
        <div className={`h-12 w-12 rounded-full grid place-items-center ring-2 ${ring.ring} bg-transparent`}>
          <div className={`absolute inset-[3px] rounded-full ${ring.fill} opacity-20`}/>
          <div className="absolute inset-0 rounded-full">
            {/* прогресс дугой — CSS conic-gradient */}
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(${ring.progress} ${progress}%, transparent ${progress}%)`,
                WebkitMask: "radial-gradient(#000 63%, transparent 64%)",
                mask: "radial-gradient(#000 63%, transparent 64%)",
                borderRadius: "9999px",
              }}
            />
          </div>
          <img
            src={a.iconUrl || defaultIconForRarity(a.rarity)}
            alt=""
            className="h-6 w-6 object-contain"
          />
        </div>
      </div>

      {/* текст */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
            {a.title}
          </span>
          <RarityPill rarity={a.rarity ?? "common"} />
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {a.description}
        </div>

        {/* полоса прогресса, если не 100% */}
        {progress < 100 && (
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-slate-200/70 dark:bg-gray-700/60 overflow-hidden">
              <div
                className={`h-full rounded-full ${ring.bar}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {progress}%
            </div>
          </div>
        )}

        {/* дата получения */}
        {a.unlocked && a.unlockedAt && (
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Открыто: {formatDate(a.unlockedAt)}
          </div>
        )}
      </div>

      {/* замок поверх, если закрыта */}
      {!a.unlocked && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-white/0 to-white/0 dark:from-black/0 dark:to-black/10" />
      )}
    </div>
  );
}

function RarityPill({ rarity }: { rarity: Rarity }) {
  const map: Record<Rarity, string> = {
    common: "bg-slate-500/15 text-slate-700 dark:text-slate-300 ring-slate-500/30",
    rare: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30",
    epic: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 ring-fuchsia-500/30",
    legendary: "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
  };
  return (
    <span className={`px-2 py-0.5 text-[11px] rounded-md ring-1 ${map[rarity]} uppercase`}>
      {rarity === "common" ? "Common" :
       rarity === "rare" ? "Rare" :
       rarity === "epic" ? "Epic" : "Legendary"}
    </span>
  );
}

function ringByRarity(r: Rarity) {
  switch (r) {
    case "rare":
      return {
        ring: "ring-sky-400/50",
        fill: "bg-sky-400",
        bar: "bg-sky-500",
        progress: "skyblue"
      };
    case "epic":
      return {
        ring: "ring-fuchsia-400/50",
        fill: "bg-fuchsia-400",
        bar: "bg-fuchsia-500",
        progress: "fuchsia"
      };
    case "legendary":
      return {
        ring: "ring-amber-400/60",
        fill: "bg-amber-400",
        bar: "bg-amber-500",
        progress: "gold"
      };
    default:
      return {
        ring: "ring-slate-400/50",
        fill: "bg-slate-400",
        bar: "bg-slate-500",
        progress: "slategray"
      };
  }
}

function defaultIconForRarity(r?: Rarity) {
  // можно подставить свои CDN-иконки
  return r === "legendary"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg" // ✨
    : r === "epic"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31f.svg" // 🌟
    : r === "rare"
    ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f539.svg" // 🔹
    : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f538.svg";  // 🔸
}


/* --- helpers --- */
function presenceLabel(p: Presence) {
  return p === "online" ? "Онлайн" : p === "idle" ? "Отошёл" : p === "dnd" ? "Не бесп." : "Оффлайн";
}
function formatDate(iso?: string) {
  try {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso ?? "—";
  }
}
