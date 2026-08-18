import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Minus, Maximize2, X, Play } from "lucide-react";

export type PlayerClip = { title: string; url: string };

type Ctx = { open: (clips: PlayerClip[], index: number) => void };

const VideoPlayerCtx = createContext<Ctx>({ open: () => {} });

export function useVideoPlayer() {
  return useContext(VideoPlayerCtx);
}

function videoSource(url: string): { kind: "yt" | "dm" | "raw"; id: string } {
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(url);
  if (yt?.[1]) return { kind: "yt", id: yt[1] };
  const dm = /dailymotion\.com\/(?:video|embed\/video)\/(\w+)/.exec(url);
  if (dm?.[1]) return { kind: "dm", id: dm[1] };
  return { kind: "raw", id: url };
}

export function playerUrl(url: string): string {
  const s = videoSource(url);
  if (s.kind === "yt")
    return `https://www.youtube-nocookie.com/embed/${s.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  if (s.kind === "dm") return `https://www.dailymotion.com/embed/video/${s.id}?autoplay=1`;
  return url;
}

export function thumbUrl(url: string): string | null {
  const s = videoSource(url);
  if (s.kind === "yt") return `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`;
  if (s.kind === "dm") return `https://www.dailymotion.com/thumbnail/video/${s.id}`;
  return null;
}

/**
 * App-level video player. Lives above the router outlet so playback survives
 * navigation. Centered and large by default, minimizes to a small bottom-right
 * card without ever dimming or blurring the page behind it.
 */
export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [clips, setClips] = useState<PlayerClip[] | null>(null);
  const [index, setIndex] = useState(0);
  const [mini, setMini] = useState(false);
  const [entered, setEntered] = useState(false);

  const open = useCallback((next: PlayerClip[], i: number) => {
    setClips(next);
    setIndex(i);
    setMini(false);
    setEntered(false);
  }, []);

  useEffect(() => {
    if (!clips) return;
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, [clips]);

  const value = useMemo(() => ({ open }), [open]);
  const clip = clips?.[index] ?? null;

  return (
    <VideoPlayerCtx.Provider value={value}>
      {children}
      {clip ? (
        <div
          className={`pointer-events-none fixed z-[80] ${
            mini
              ? "bottom-3 right-3"
              : "inset-0 flex items-center justify-center p-3 sm:p-6"
          }`}
        >
          <div
            className={`pointer-events-auto flex flex-col overflow-hidden rounded-2xl bg-xb-panel shadow-[0_24px_80px_-16px_rgba(0,0,0,0.55)] ring-1 ring-xb-line transition-all duration-500 ease-[cubic-bezier(0.22,1.2,0.36,1)] ${
              mini ? "w-[300px] sm:w-[360px]" : "w-full max-w-5xl"
            } ${entered ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-12"}`}
            style={{ maxHeight: "calc(100dvh - 1.5rem)" }}
          >
            <div className="flex items-center gap-1.5 border-b border-xb-line px-2 py-1">
              <Play className="h-3 w-3 shrink-0 text-xb-blue" />
              <span className="flex-1 truncate text-[10px] font-medium leading-none text-xb-text-muted">
                {clip.title}
              </span>
              <button
                type="button"
                onClick={() => setMini((m) => !m)}
                aria-label={mini ? "Expand player" : "Minimize player"}
                className="flex h-5 w-5 items-center justify-center rounded text-xb-text-muted transition hover:bg-xb-odds hover:text-xb-text"
              >
                {mini ? <Maximize2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={() => setClips(null)}
                aria-label="Close video"
                className="flex h-5 w-5 items-center justify-center rounded text-xb-text-muted transition hover:bg-xb-odds hover:text-xb-text"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                key={clip.url}
                src={playerUrl(clip.url)}
                title={clip.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
                className="h-full w-full"
              />
            </div>
            {clips && clips.length > 1 ? (
              <div className="flex items-center justify-between gap-2 px-2 py-1">
                <span className="truncate text-[10px] leading-none text-xb-text-muted">
                  Clip {index + 1}/{clips.length}
                </span>
                <span className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Previous clip"
                    onClick={() => setIndex((i) => (i - 1 + clips.length) % clips.length)}
                    className="flex h-5 w-5 items-center justify-center rounded text-xb-text-muted transition hover:bg-xb-blue hover:text-xb-on-dark"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next clip"
                    onClick={() => setIndex((i) => (i + 1) % clips.length)}
                    className="flex h-5 w-5 items-center justify-center rounded text-xb-text-muted transition hover:bg-xb-blue hover:text-xb-on-dark"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </VideoPlayerCtx.Provider>
  );
}
