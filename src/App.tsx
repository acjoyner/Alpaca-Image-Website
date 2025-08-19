import React, { useMemo, useRef, useState } from "react";

// --- Small design system helpers ------------------------------------------------
const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl shadow p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-zinc-200 dark:border-zinc-800">
    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full bg-zinc-400" />
      {title}
    </h2>
    {children}
  </div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
    {children}
  </span>
);

// --- Types ----------------------------------------------------------------------
type Category =
  | "Background"
  | "Fur"
  | "Ears"
  | "Hair"
  | "Eyes"
  | "Mouth"
  | "Clothes"
  | "Accessory";

type Option = {
  id: string;
  label: string;
};

// --- Palette --------------------------------------------------------------------
const BG_COLORS = [
  "#F1F5F9", // slate-100
  "#E2E8F0", // slate-200
  "#FEF3C7", // amber-100
  "#DCFCE7", // green-100
  "#E0E7FF", // indigo-100
  "#FFE4E6", // rose-100
  "#F5F3FF", // violet-100
  "#FFEDD5", // orange-100
  "#E5E7EB", // gray-200
];

const FUR_COLORS = [
  "#F4E1C1", // sand
  "#E8D0A9",
  "#D8B384",
  "#C69C6D",
  "#A2795B",
  "#6B4F3A",
  "#EEE1D5", // cream
];

const ACCENT = "#1F2937"; // gray-800 for line art

// --- Utilities ------------------------------------------------------------------
const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]) => arr[rand(arr.length)];

// --- Options per category --------------------------------------------------------
const OPTIONS: Record<Category, Option[]> = {
  Background: BG_COLORS.map((c, i) => ({ id: c, label: `Color ${i + 1}` })),
  Fur: FUR_COLORS.map((c, i) => ({ id: c, label: `Fur ${i + 1}` })),
  Ears: [
    { id: "pointy", label: "Pointy" },
    { id: "round", label: "Round" },
    { id: "floppy", label: "Floppy" },
  ],
  Hair: [
    { id: "poof", label: "Poof" },
    { id: "bangs", label: "Bangs" },
    { id: "mohawk", label: "Mohawk" },
    { id: "none", label: "None" },
  ],
  Eyes: [
    { id: "happy", label: "Happy" },
    { id: "sleepy", label: "Sleepy" },
    { id: "round", label: "Round" },
    { id: "winky", label: "Winky" },
  ],
  Mouth: [
    { id: "smile", label: "Smile" },
    { id: "smirk", label: "Smirk" },
    { id: "open", label: "Open" },
    { id: "tongue", label: "Tongue" },
  ],
  Clothes: [
    { id: "none", label: "None" },
    { id: "scarf", label: "Scarf" },
    { id: "hoodie", label: "Hoodie" },
    { id: "tee", label: "T‑Shirt" },
  ],
  Accessory: [
    { id: "none", label: "None" },
    { id: "round-glasses", label: "Round Glasses" },
    { id: "sunnies", label: "Sunglasses" },
    { id: "earring", label: "Earring" },
  ],
};

// --- Default state ---------------------------------------------------------------
const DEFAULT = {
  Background: BG_COLORS[0],
  Fur: FUR_COLORS[0],
  Ears: "pointy",
  Hair: "poof",
  Eyes: "happy",
  Mouth: "smile",
  Clothes: "none",
  Accessory: "none",
} as Record<Category, string>;

// --- SVG Layer Renderers ---------------------------------------------------------
const EarsLayer = ({ type, fur }: { type: string; fur: string }) => {
  const stroke = ACCENT;
  switch (type) {
    case "round":
      return (
        <g>
          <ellipse cx="120" cy="85" rx="28" ry="22" fill={fur} stroke={stroke} strokeWidth="3" />
          <ellipse cx="280" cy="85" rx="28" ry="22" fill={fur} stroke={stroke} strokeWidth="3" />
        </g>
      );
    case "floppy":
      return (
        <g>
          <path d="M100 80 q-30 40 10 50" fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round" />
          <path d="M300 80 q30 40 -10 50" fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <polygon points="100,85 130,20 150,95" fill={fur} stroke={stroke} strokeWidth="3" />
          <polygon points="300,85 270,20 250,95" fill={fur} stroke={stroke} strokeWidth="3" />
        </g>
      );
  }
};

const HairLayer = ({ type, fur }: { type: string; fur: string }) => {
  const stroke = ACCENT;
  if (type === "none") return null;
  if (type === "poof")
    return (
      <g>
        <circle cx="200" cy="95" r="34" fill={fur} stroke={stroke} strokeWidth="3" />
        <circle cx="165" cy="100" r="30" fill={fur} stroke={stroke} strokeWidth="3" />
        <circle cx="235" cy="100" r="30" fill={fur} stroke={stroke} strokeWidth="3" />
      </g>
    );
  if (type === "bangs")
    return (
      <g>
        <path d="M150 110 q30 -30 50 0 q30 -30 50 0" fill={fur} stroke={stroke} strokeWidth="3" />
      </g>
    );
  return (
    <g>
      <rect x="185" y="60" width="30" height="70" rx="10" fill={fur} stroke={stroke} strokeWidth="3" />
    </g>
  );
};

const EyesLayer = ({ type }: { type: string }) => {
  const stroke = ACCENT;
  switch (type) {
    case "sleepy":
      return (
        <g stroke={stroke} strokeWidth="6" strokeLinecap="round">
          <path d="M160 160 q20 -10 40 0" />
          <path d="M240 160 q20 -10 40 0" />
        </g>
      );
    case "round":
      return (
        <g>
          <circle cx="180" cy="160" r="12" fill="#000" />
          <circle cx="260" cy="160" r="12" fill="#000" />
        </g>
      );
    case "winky":
      return (
        <g>
          <circle cx="180" cy="160" r="10" fill="#000" />
          <path d="M245 160 q15 -10 30 0" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="180" cy="160" r="8" fill="#000" />
          <circle cx="260" cy="160" r="8" fill="#000" />
          <circle cx="176" cy="156" r="3" fill="#fff" />
          <circle cx="256" cy="156" r="3" fill="#fff" />
        </g>
      );
  }
};

const MouthLayer = ({ type }: { type: string }) => {
  const stroke = ACCENT;
  if (type === "open")
    return <path d="M200 200 q30 20 60 0" stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none" />;
  if (type === "tongue")
    return (
      <g>
        <path d="M200 200 q30 20 60 0" stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M230 200 q15 20 30 0" fill="#F87171" />
      </g>
    );
  if (type === "smirk")
    return <path d="M210 205 q25 15 50 0" stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none" />;
  return <path d="M200 205 q30 15 60 0" stroke={stroke} strokeWidth="6" strokeLinecap="round" fill="none" />;
};

const ClothesLayer = ({ type }: { type: string }) => {
  const stroke = ACCENT;
  if (type === "none") return null;
  if (type === "scarf")
    return (
      <g>
        <path d="M140 240 q60 -20 120 0" fill="#38BDF8" stroke={stroke} strokeWidth="3" />
        <rect x="195" y="238" width="24" height="60" rx="6" fill="#38BDF8" stroke={stroke} strokeWidth="3" />
      </g>
    );
  if (type === "hoodie")
    return (
      <g>
        <rect x="120" y="230" width="160" height="80" rx="20" fill="#A78BFA" stroke={stroke} strokeWidth="3" />
        <path d="M130 230 q70 -30 140 0" fill="#C4B5FD" stroke={stroke} strokeWidth="3" />
      </g>
    );
  return (
    <g>
      <rect x="130" y="250" width="140" height="50" rx="12" fill="#60A5FA" stroke={stroke} strokeWidth="3" />
    </g>
  );
};

const AccessoryLayer = ({ type }: { type: string }) => {
  const stroke = ACCENT;
  if (type === "none") return null;
  if (type === "round-glasses")
    return (
      <g stroke={stroke} strokeWidth="4" fill="none">
        <circle cx="180" cy="160" r="18" />
        <circle cx="260" cy="160" r="18" />
        <line x1="198" y1="160" x2="242" y2="160" />
      </g>
    );
  if (type === "sunnies")
    return (
      <g>
        <rect x="162" y="148" width="36" height="22" rx="4" fill="#111827" />
        <rect x="242" y="148" width="36" height="22" rx="4" fill="#111827" />
        <rect x="198" y="156" width="44" height="6" rx="3" fill="#111827" />
      </g>
    );
  return <circle cx="290" cy="200" r="6" fill="#F59E0B" stroke={stroke} strokeWidth="2" />; // earring
};

// --- Main Component --------------------------------------------------------------
export default function AlpacaAvatarGenerator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selCat, setSelCat] = useState<Category>("Hair");
  const [state, setState] = useState<Record<Category, string>>(DEFAULT);

  const onPick = (cat: Category, value: string) => setState((s) => ({ ...s, [cat]: value }));
  const randomize = () => {
    const r: Record<Category, string> = { ...state };
    (Object.keys(OPTIONS) as Category[]).forEach((k) => (r[k] = pick(OPTIONS[k]).id));
    setState(r);
  };
  const reset = () => setState(DEFAULT);

  const downloadPNG = async () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const src = serializer.serializeToString(svgEl);
    const svg64 = typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(src))) : "";
    const image64 = `data:image/svg+xml;base64,${svg64}`;

    const img = new Image();
    const canvas = document.createElement("canvas");
    const size = 640; // export at 640x640
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        resolve();
      };
      img.src = image64;
    });

    const a = document.createElement("a");
    a.download = "alpaca.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const Preview = useMemo(() => {
    const bg = state.Background;
    const fur = state.Fur;
    return (
      <svg ref={svgRef} viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <rect width="400" height="400" fill={bg} />

        {/* Subtle pattern */}
        <g opacity="0.06">
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx={20 + i * 35} cy={20 + (i % 2) * 20} r="6" fill="#111827" />
          ))}
        </g>

        {/* Body shadow */}
        <ellipse cx="200" cy="330" rx="120" ry="22" fill="#000" opacity="0.08" />

        {/* Body */}
        <g>
          <ellipse cx="200" cy="250" rx="90" ry="90" fill={fur} stroke={ACCENT} strokeWidth="3" />
          {/* neck */}
          <rect x="180" y="180" width="40" height="60" rx="12" fill={fur} stroke={ACCENT} strokeWidth="3" />
          {/* face */}
          <ellipse cx="200" cy="140" rx="70" ry="60" fill={fur} stroke={ACCENT} strokeWidth="3" />
        </g>

        {/* Ears (behind hair) */}
        <EarsLayer type={state.Ears} fur={fur} />

        {/* Hair */}
        <HairLayer type={state.Hair} fur={fur} />

        {/* Nose/Snout */}
        <g>
          <ellipse cx="220" cy="185" rx="30" ry="20" fill="#FDE68A" stroke={ACCENT} strokeWidth="3" />
          <circle cx="212" cy="182" r="3" fill={ACCENT} />
          <circle cx="228" cy="182" r="3" fill={ACCENT} />
        </g>

        {/* Eyes */}
        <EyesLayer type={state.Eyes} />

        {/* Mouth */}
        <MouthLayer type={state.Mouth} />

        {/* Accessories */}
        <AccessoryLayer type={state.Accessory} />

        {/* Clothes (front) */}
        <ClothesLayer type={state.Clothes} />
      </svg>
    );
  }, [state]);

  const categories: Category[] = ["Background", "Fur", "Ears", "Hair", "Eyes", "Mouth", "Clothes", "Accessory"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Left: Preview */}
        <Panel title="Alpaca Preview">
          <div className="aspect-square w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
            {Preview}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={randomize} className="px-4 py-2 rounded-2xl shadow border border-zinc-300 dark:border-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition">
              🎲 Randomize
            </button>
            <button onClick={reset} className="px-4 py-2 rounded-2xl shadow border border-zinc-300 dark:border-zinc-700 hover:scale-[1.02] active:scale-[0.98] transition">
              ↺ Reset
            </button>
            <button onClick={downloadPNG} className="px-4 py-2 rounded-2xl shadow bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 active:opacity-80 transition">
              ⬇️ Download PNG
            </button>
            <Badge>Exports 640×640</Badge>
          </div>
        </Panel>

        {/* Right: Controls */}
        <Panel title="Customize">
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelCat(c)}
                className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${
                  selCat === c
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                }`}
                aria-pressed={selCat === c}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {OPTIONS[selCat].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onPick(selCat, opt.id)}
                className={`group relative rounded-xl border p-2 h-16 flex items-center justify-center text-sm hover:shadow transition ${
                  state[selCat] === opt.id
                    ? "border-zinc-900 dark:border-white"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                aria-pressed={state[selCat] === opt.id}
                title={opt.label}
              >
                {/* Swatches for color categories */}
                {(selCat === "Background" || selCat === "Fur") && (
                  <span
                    className="inline-block w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-700"
                    style={{ background: opt.id }}
                  />
                )}
                {/* Icons for others */}
                {!(selCat === "Background" || selCat === "Fur") && (
                  <span className="opacity-80 group-hover:opacity-100">
                    {opt.label}
                  </span>
                )}
                {state[selCat] === opt.id && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="max-w-6xl mx-auto mt-6 grid md:grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <Panel title="Tips">
          <ul className="list-disc pl-5 space-y-1">
            <li>All parts are layered correctly: Ears → Hair → Face → Eyes/Mouth → Accessories → Clothes.</li>
            <li>Use the Randomize button to explore fun combinations.</li>
            <li>Download generates a crisp PNG suitable for profile pictures.</li>
          </ul>
        </Panel>
        <Panel title="Under the Hood">
          <ul className="list-disc pl-5 space-y-1">
            <li>Pure SVG; no external image assets needed.</li>
            <li>TailwindCSS classes for styling and layout.</li>
            <li>Deterministic state per category; easily swap with real layered PNGs later.</li>
          </ul>
        </Panel>
        <Panel title="Extend">
          <ul className="list-disc pl-5 space-y-1">
            <li>Add more parts (nose shapes, patterns, backgrounds).</li>
            <li>Persist favorites to localStorage.</li>
            <li>Add a shareable URL by encoding state into the query string.</li>
            <li>Break App component down into multiple components for better readability.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
