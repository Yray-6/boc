"use client";

import { useEffect, useState } from "react";
import type { PropertyType } from "@/data/home";
import type { PublicPropertyVideoSlide } from "@/lib/public-property-mapper";
import { RemoteOrLocalImage } from "@/components/common/remote-or-local-image";

type MediaTab = "photos" | "videos";

interface PropertyMediaCarouselProps {
  images: string[];
  videos: PublicPropertyVideoSlide[];
  title: string;
  type: PropertyType;
}

const TYPE_LABEL: Record<PropertyType, string> = {
  BUY: "FOR BUY",
  RENT: "FOR RENT",
  LEASE: "FOR LEASE",
  SHORT_LET: "SHORT LET",
};

const tabBase =
  "rounded-full px-4 py-2 text-sm font-semibold transition-colors [font-family:var(--font-dm-sans)]";
const tabActive = "bg-[#2a478d] text-white shadow-sm";
const tabInactive = "bg-[#f5f0e8] text-[#1a1a1a] hover:bg-[#ebe5dc]";

function TypeBadge({ type, className }: { type: PropertyType; className: string }) {
  return (
    <div className={className}>
      <span className="text-[8px] font-semibold text-white [font-family:var(--font-dm-sans)] sm:text-xs">
        {TYPE_LABEL[type]}
      </span>
    </div>
  );
}

export function PropertyMediaCarousel({ images, videos, title, type }: PropertyMediaCarouselProps) {
  const hasVideos = videos.length > 0;
  const [tab, setTab] = useState<MediaTab>("photos");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);

  const photoTotal = Math.max(images.length, 1);
  const videoTotal = Math.max(videos.length, 1);

  useEffect(() => {
    setPhotoIndex((i) => Math.min(i, Math.max(images.length - 1, 0)));
  }, [images.length]);

  useEffect(() => {
    setVideoIndex((i) => Math.min(i, Math.max(videos.length - 1, 0)));
  }, [videos.length]);

  const prevPhoto = () => setPhotoIndex((i) => (i - 1 + photoTotal) % photoTotal);
  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photoTotal);
  const prevVideo = () => setVideoIndex((i) => (i - 1 + videoTotal) % videoTotal);
  const nextVideo = () => setVideoIndex((i) => (i + 1) % videoTotal);

  const showPhotoNav = images.length > 1;
  const showVideoNav = videos.length > 1;

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2 lg:mb-4">
        <button
          type="button"
          onClick={() => setTab("photos")}
          className={`${tabBase} ${tab === "photos" ? tabActive : tabInactive}`}
        >
          Photos
        </button>
        <button
          type="button"
          onClick={() => setTab("videos")}
          className={`${tabBase} ${tab === "videos" ? tabActive : tabInactive}`}
        >
          Videos
          {hasVideos ? (
            <span className="ml-1.5 text-xs font-normal opacity-80">({videos.length})</span>
          ) : null}
        </button>
      </div>

      {tab === "photos" ? (
        <>
          <div className="relative w-full overflow-hidden lg:hidden" style={{ aspectRatio: "404/264" }}>
            <RemoteOrLocalImage
              src={images[photoIndex] ?? images[0]}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <TypeBadge
              type={type}
              className="absolute left-[7px] top-[7px] rounded-full bg-[#00C950] px-[10px] py-[3px]"
            />
            {showPhotoNav ? (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-[18px] top-1/2 flex h-[32.46px] w-[32.46px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                  className="absolute right-[18px] top-1/2 flex h-[32.46px] w-[32.46px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-[9.46px] py-[4.73px]">
                  <span className="text-[8.28px] font-normal leading-[1.43] text-white [font-family:var(--font-dm-sans)]">
                    {photoIndex + 1} / {images.length}
                  </span>
                </div>
              </>
            ) : null}
          </div>

          <div className="relative hidden w-full overflow-hidden rounded-[20px] lg:block" style={{ aspectRatio: "1240/487" }}>
            <RemoteOrLocalImage
              src={images[photoIndex] ?? images[0]}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:1440px) 100vw, 1240px"
            />
            <TypeBadge type={type} className="absolute left-4 top-4 rounded-md bg-[#00C950] px-3 py-1.5" />
            {showPhotoNav ? (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === photoIndex ? "w-5 bg-white" : "w-2 bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full overflow-hidden bg-black lg:hidden" style={{ aspectRatio: "404/264" }}>
            {hasVideos ? (
              <video
                key={videos[videoIndex].url}
                src={videos[videoIndex].url}
                poster={videos[videoIndex].poster || undefined}
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                className="absolute inset-0 z-[1] h-full w-full object-contain"
                aria-label={videos[videoIndex].title}
              />
            ) : (
              <div className="flex h-full min-h-[180px] items-center justify-center px-6 text-center text-sm text-white/80 [font-family:var(--font-dm-sans)]">
                No videos for this listing yet.
              </div>
            )}
            <TypeBadge
              type={type}
              className="pointer-events-none absolute left-[7px] top-[7px] z-10 rounded-full bg-[#00C950] px-[10px] py-[3px]"
            />
            {hasVideos && showVideoNav ? (
              <>
                <button
                  type="button"
                  onClick={prevVideo}
                  aria-label="Previous video"
                  className="absolute left-[18px] top-1/2 z-20 flex h-[32.46px] w-[32.46px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextVideo}
                  aria-label="Next video"
                  className="absolute right-[18px] top-1/2 z-20 flex h-[32.46px] w-[32.46px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-[20px] left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-[9.46px] py-[4.73px]">
                  <span className="text-[8.28px] font-normal leading-[1.43] text-white [font-family:var(--font-dm-sans)]">
                    {videoIndex + 1} / {videos.length}
                  </span>
                </div>
              </>
            ) : null}
          </div>

          <div className="relative hidden w-full overflow-hidden rounded-[20px] bg-black lg:block" style={{ aspectRatio: "1240/487" }}>
            {hasVideos ? (
              <video
                key={videos[videoIndex].url}
                src={videos[videoIndex].url}
                poster={videos[videoIndex].poster || undefined}
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                className="absolute inset-0 z-[1] h-full w-full object-contain"
                aria-label={videos[videoIndex].title}
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center text-base text-white/80 [font-family:var(--font-dm-sans)]">
                No videos for this listing yet.
              </div>
            )}
            <TypeBadge
              type={type}
              className="pointer-events-none absolute left-4 top-4 z-10 rounded-md bg-[#00C950] px-3 py-1.5"
            />
            {hasVideos && showVideoNav ? (
              <>
                <button
                  type="button"
                  onClick={prevVideo}
                  aria-label="Previous video"
                  className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M15 18l-6-6 6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextVideo}
                  aria-label="Next video"
                  className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 18l6-6-6-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                  {videos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setVideoIndex(i)}
                      aria-label={`Video ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === videoIndex ? "w-5 bg-white" : "w-2 bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
