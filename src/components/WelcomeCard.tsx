type Props = {
  theme?: "light" | "dark";
  name: string;
  avatarUrl: string;
};

export function WelcomeCard({ theme = "light", name, avatarUrl }: Props) {
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={[
          "relative flex flex-col gap-6 items-center justify-center rounded-3xl p-10 overflow-hidden shadow-xl border",
          isDark
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-gray-700/60"
            : "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-0 blur-2xl",
            isDark
              ? "bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.25),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.18),transparent_60%)]",
          ].join(" ")}
        />
        <div className="relative">
          <img
            className={[
              "h-32 w-32 rounded-full object-cover border-4 animate-pulse",
              isDark
                ? "border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                : "border-indigo-400/30 shadow-[0_0_25px_rgba(99,102,241,0.25)]",
            ].join(" ")}
            src={avatarUrl}
            alt=""
          />
        </div>

        <div className="pt-6 font-medium text-center relative">
          <h2
            className={[
              "text-4xl font-bold bg-clip-text text-transparent animate-textGlow",
              isDark
                ? "bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"
                : "bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500",
            ].join(" ")}
          >
            Welcome,{" "}
            <span className={isDark ? "font-mono italic text-white/90" : "font-mono italic text-black/80"}>
              {name}
            </span>
            !
          </h2>
        </div>

        <div className="w-full flex flex-col items-center justify-center pt-6">
          <div
            className={[
              "w-6 h-6 rounded-full animate-spin border-4",
              isDark ? "border-purple-400 border-t-transparent" : "border-slate-300 border-t-transparent",
            ].join(" ")}
          />
          <p className={isDark ? "text-sm mt-2 font-light text-gray-300 animate-pulse" : "text-sm mt-2 font-light text-slate-600 animate-pulse"}>
            Loading…
          </p>
        </div>

        <style jsx>{`
          @keyframes textGlow {
            0%, 100% { filter: drop-shadow(0 0 4px ${isDark ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.6)"}); }
            50% { filter: drop-shadow(0 0 12px rgba(236,72,153,0.7)); }
          }
          .animate-textGlow { animation: textGlow 3s ease-in-out infinite; }
        `}</style>
      </div>
    </div>
  );
}
