"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

type LightboxProps = {
  trigger: ReactNode;
  triggerLabel?: string;
  caption?: string;
  children: ReactNode;
};

export default function Lightbox({
  trigger,
  triggerLabel = "이미지 확대보기",
  caption,
  children,
}: LightboxProps) {
  const [open, setOpen] = useState(false);
  const captionId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel}
        className="block w-full appearance-none border-0 bg-transparent p-0 text-left"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={caption ? captionId : undefined}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 transition-opacity duration-[200ms] ease-in-out motion-reduce:transition-none"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-full w-full max-w-2xl overflow-auto rounded-xl bg-white p-4 md:p-6"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              ✕
            </button>
            {children}
            {caption && (
              <p id={captionId} className="mt-3 text-[13px] text-neutral-600">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
