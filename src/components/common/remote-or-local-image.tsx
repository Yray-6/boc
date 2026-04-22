import Image from "next/image";

type RemoteOrLocalImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Width/height when not using fill */
  width?: number;
  height?: number;
};

function isRemote(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

/** Use Next `Image` for local assets; plain `img` for remote URLs so any CDN host works without config. */
export function RemoteOrLocalImage({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  width,
  height,
}: RemoteOrLocalImageProps) {
  if (isRemote(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`} />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} className={className} />
    );
  }

  if (fill) {
    return (
      <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1}
      height={height ?? 1}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
