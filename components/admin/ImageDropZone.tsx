"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { validateImageFile } from "@/lib/utils/image";

type ImageDropZoneProps = {
  name: string;
  multiple?: boolean;
  label?: string;
};

export default function ImageDropZone({
  name,
  multiple = false,
  label,
}: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const result = validateImageFile(file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
    }
    setError(null);
    setPreviews(fileArray.map((f) => URL.createObjectURL(f)));

    // 드래그 드롭 시 숨겨진 input에 파일 등록 (FormData 수집 대상)
    if (inputRef.current) {
      const dt = new DataTransfer();
      for (const file of fileArray) dt.items.add(file);
      inputRef.current.files = dt.files;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviews([]);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isSelected = previews.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <p className="text-[14px] font-medium text-neutral-800">{label}</p>
      )}

      {/* 드롭존 */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors select-none ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : isSelected
              ? "border-brand-300 bg-brand-50/50"
              : "border-neutral-200 hover:border-brand-300 hover:bg-neutral-50"
        }`}
      >
        {isSelected ? (
          <p className="px-4 text-center text-[14px] font-medium text-brand-700">
            {previews.length}개 파일 선택됨 — 클릭하여 변경
          </p>
        ) : (
          <>
            <svg
              className="h-9 w-9 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-[14px] text-neutral-500">
              클릭하거나 드래그하여 업로드
            </p>
            <p className="text-[12px] text-neutral-400">
              jpg · png · webp · 최대 5MB{multiple ? " · 여러 장 가능" : ""}
            </p>
          </>
        )}
      </div>

      {/* 선택된 파일 미리보기 */}
      {previews.length > 0 && (
        <div
          className={`grid gap-2 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1 max-w-[220px]"}`}
        >
          {previews.map((url, i) => (
            <div
              key={i}
              className="relative aspect-video overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100"
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <button
          type="button"
          onClick={clearSelection}
          className="self-start text-[13px] text-neutral-400 underline hover:text-neutral-600"
        >
          선택 취소
        </button>
      )}

      {error && (
        <p className="text-status-error text-[13px]">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
