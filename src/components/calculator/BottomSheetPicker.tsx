"use client";

import * as React from "react";
import { Search, X, Check, ArrowLeft } from "lucide-react";

interface BottomSheetPickerProps {
  open: boolean;
  onClose: () => void;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  title: string;
  placeholder?: string;
  /**
   * "sheet" (default) — bottom sheet sliding up from bottom.
   * "fullscreen" — full-screen modal from top, keyboard-aware.
   *   Use fullscreen only for brand picker on mobile.
   */
  presentation?: "sheet" | "fullscreen";
}

/**
 * Mobile-first picker for long lists (brands, models).
 *
 * presentation="sheet" (default):
 * - Slides up from bottom with drag handle.
 * - Search filter at top.
 * - Single-tap to select + auto-close.
 * - Keyboard-aware via visualViewport.
 *
 * presentation="fullscreen":
 * - Fixed full-screen modal from top.
 * - Sticky header + search, results directly below.
 * - Uses visualViewport for height/offset so keyboard never covers results.
 * - Desktop (>768px) still uses the sheet presentation.
 */
export function BottomSheetPicker({
  open,
  onClose,
  options,
  value,
  onChange,
  title,
  placeholder = "Cari...",
  presentation = "sheet",
}: BottomSheetPickerProps) {
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const sheetRef = React.useRef<HTMLDivElement | null>(null);
  // Track the max-height override driven by the visual viewport (Android keyboard)
  const [sheetMaxHeight, setSheetMaxHeight] = React.useState<string | null>(null);

  // For fullscreen mode: track visualViewport dimensions
  const [vvHeight, setVvHeight] = React.useState<number | null>(null);
  const [vvOffsetTop, setVvOffsetTop] = React.useState<number>(0);

  // Lock body scroll + escape-to-close + keyboard-aware resize
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Focus search after slide-up starts
    const t = setTimeout(() => searchRef.current?.focus(), 100);

    // ── Keyboard-aware resize using visualViewport API ──
    const vv = window.visualViewport;

    if (presentation === "fullscreen" && vv) {
      // Fullscreen mode: track height + offsetTop for full positioning
      const onResize = () => {
        setVvHeight(vv.height);
        setVvOffsetTop(vv.offsetTop);
      };
      vv.addEventListener("resize", onResize);
      vv.addEventListener("scroll", onResize);
      onResize();
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener("keydown", onKey);
        clearTimeout(t);
        vv.removeEventListener("resize", onResize);
        vv.removeEventListener("scroll", onResize);
        setVvHeight(null);
        setVvOffsetTop(0);
      };
    }

    // Sheet mode: track max-height for keyboard avoidance
    const onResize = () => {
      if (!vv) return;
      const visibleHeight = vv.height;
      setSheetMaxHeight(`${Math.round(visibleHeight * 0.9)}px`);
    };
    if (vv) {
      vv.addEventListener("resize", onResize);
      vv.addEventListener("scroll", onResize);
      onResize();
    }

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      if (vv) {
        vv.removeEventListener("resize", onResize);
        vv.removeEventListener("scroll", onResize);
      }
      setSheetMaxHeight(null);
    };
  }, [open, onClose, presentation]);

  // Reset search when sheet opens
  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [query, options]);

  if (!open) return null;

  // ── Desktop: always use sheet presentation regardless of prop ──
  // Only use fullscreen on mobile (width < 768)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
  const useFullscreen = presentation === "fullscreen" && !isDesktop;

  if (useFullscreen) {
    return <FullscreenPicker
      title={title}
      placeholder={placeholder}
      query={query}
      setQuery={setQuery}
      searchRef={searchRef}
      filtered={filtered}
      value={value}
      onChange={onChange}
      onClose={onClose}
      vvHeight={vvHeight}
      vvOffsetTop={vvOffsetTop}
    />;
  }

  // ── Sheet mode (default for model picker, desktop, and all non-brand pickers) ──
  return (
    <>
      <div className="ds-sheet-backdrop" onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        className="ds-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={sheetMaxHeight ? { maxHeight: sheetMaxHeight } : undefined}
      >
        <div className="ds-sheet-handle" aria-hidden />
        <div className="ds-sheet-header">
          <h3 className="font-bold text-[#0F172A] text-base">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 flex-shrink-0">
          <div className="relative">
            <input
              ref={searchRef}
              type="text"
              className="ds-input pr-9"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <Search
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
              aria-hidden
            />
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">
            {filtered.length} opsi
          </p>
        </div>

        <div className="ds-sheet-body">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#64748B]">
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul role="listbox" aria-label={title}>
              {filtered.slice(0, 300).map((opt) => {
                const active = opt === value;
                return (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={active}
                    tabIndex={0}
                    className="ds-sheet-item"
                    data-active={active}
                    onClick={() => {
                      onChange(opt);
                      onClose();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange(opt);
                        onClose();
                      }
                    }}
                  >
                    <span className="truncate">{opt}</span>
                    {active && <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0" aria-hidden />}
                  </li>
                );
              })}
            </ul>
          )}
          {filtered.length > 300 && (
            <p className="px-4 py-2 text-xs text-[#64748B] text-center">
              Menampilkan 300 dari {filtered.length} hasil. Persempit pencarian untuk hasil lainnya.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Fullscreen picker sub-component (mobile only) ── */

interface FullscreenPickerProps {
  title: string;
  placeholder: string;
  query: string;
  setQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  filtered: string[];
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
  vvHeight: number | null;
  vvOffsetTop: number;
}

function FullscreenPicker({
  title,
  placeholder,
  query,
  setQuery,
  searchRef,
  filtered,
  value,
  onChange,
  onClose,
  vvHeight,
  vvOffsetTop,
}: FullscreenPickerProps) {
  // Use visualViewport dimensions if available, fallback to 100dvh
  const heightStyle = vvHeight !== null ? `${vvHeight}px` : "100dvh";
  const topStyle = vvOffsetTop > 0 ? `${vvOffsetTop}px` : "0px";

  return (
    <div
      className="ds-fs-picker"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        top: topStyle,
        left: 0,
        right: 0,
        height: heightStyle,
        zIndex: 100,
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        animation: "ds-fs-fade-in 150ms ease-out",
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#0F172A] hover:bg-[#F1F5F9]"
            aria-label="Tutup"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h3 className="font-bold text-[#0F172A] text-base truncate">{title}</h3>
        </div>
      </div>

      {/* Sticky search */}
      <div
        style={{
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "#FFFFFF",
        }}
        className="px-4 pt-3 pb-2"
      >
        <div className="relative">
          <input
            ref={searchRef}
            type="text"
            className="ds-input pr-9"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <Search
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
            aria-hidden
          />
        </div>
        <p className="text-xs text-[#64748B] mt-1.5">
          {filtered.length} opsi
        </p>
      </div>

      {/* Results — flex-1, overflow-y-auto, starts directly below search */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "0.5rem 0.5rem 1rem",
        }}
      >
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[#64748B]">
            Tidak ada hasil untuk &ldquo;{query}&rdquo;
          </div>
        ) : (
          <ul role="listbox" aria-label={title}>
            {filtered.slice(0, 300).map((opt) => {
              const active = opt === value;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={active}
                  tabIndex={0}
                  className="ds-sheet-item"
                  data-active={active}
                  onClick={() => {
                    onChange(opt);
                    onClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(opt);
                      onClose();
                    }
                  }}
                >
                  <span className="truncate">{opt}</span>
                  {active && <Check className="h-4 w-4 text-[#0F766E] flex-shrink-0" aria-hidden />}
                </li>
              );
            })}
          </ul>
        )}
        {filtered.length > 300 && (
          <p className="px-4 py-2 text-xs text-[#64748B] text-center">
            Menampilkan 300 dari {filtered.length} hasil. Persempit pencarian untuk hasil lainnya.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Trigger button that looks like a ds-input but opens the sheet ── */
interface PickerTriggerProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
  invalid?: boolean;
  icon?: React.ReactNode;
  hideLabel?: boolean;
}

export function PickerTrigger({
  label,
  value,
  placeholder,
  onClick,
  disabled,
  invalid,
  icon,
  hideLabel = false,
}: PickerTriggerProps) {
  return (
    <div>
      {!hideLabel && (
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
          {invalid && <span className="text-xs text-[#B91C1C] font-semibold">Wajib</span>}
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        data-invalid={invalid ? "true" : undefined}
        className={`
          ds-input flex items-center gap-2.5 text-left
          ${disabled ? "opacity-50 cursor-not-allowed bg-[#F8FAFC]" : "cursor-pointer hover:border-[#CBD5E1]"}
          ${invalid ? "!border-[#B91C1C] !bg-[#FEF2F2]" : ""}
        `}
      >
        {icon && (
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${invalid ? "bg-[#FEE2E2] text-[#B91C1C]" : "bg-[#ECFDF5] text-[#0F766E]"}`}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {hideLabel ? (
            <>
              <span className={`block text-xs ${value ? "text-[#64748B]" : invalid ? "text-[#B91C1C]" : "text-[#94A3B8]"}`}>
                {label}
              </span>
              <span className={`block text-sm truncate ${value ? "text-[#0F172A] font-semibold" : invalid ? "text-[#B91C1C]" : "text-[#94A3B8]"}`}>
                {value || placeholder}
              </span>
            </>
          ) : (
            <span className={`truncate ${value ? "text-[#0F172A]" : invalid ? "text-[#B91C1C]" : "text-[#94A3B8]"}`}>
              {value || placeholder}
            </span>
          )}
        </div>
        {hideLabel && invalid && <span className="text-xs text-[#B91C1C] font-semibold">Wajib</span>}
      </button>
    </div>
  );
}
