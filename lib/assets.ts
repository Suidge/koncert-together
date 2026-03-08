const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(src?: string | null) {
  if (!src) {
    return "";
  }

  if (/^https?:\/\//.test(src)) {
    return src;
  }

  return `${basePath}${src}`;
}
