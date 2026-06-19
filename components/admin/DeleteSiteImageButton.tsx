"use client";

import { deleteSiteImage } from "@/app/admin/(protected)/images/actions";

export default function DeleteSiteImageButton({ imageId }: { imageId: string }) {
  return (
    <form action={() => deleteSiteImage(imageId)}>
      <button
        type="submit"
        className="bg-status-error/90 rounded-md px-2 py-1 text-[12px] font-medium text-white hover:bg-status-error"
        onClick={(event) => {
          if (!confirm("이 이미지를 삭제할까요?")) {
            event.preventDefault();
          }
        }}
      >
        삭제
      </button>
    </form>
  );
}
