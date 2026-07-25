/**
 * Reads a browser File as raw base64 (data: URL prefix stripped) — the wire
 * format both upload mutations expect. Lives here (web-only utils), not in
 * `@careernext/utils`: FileReader is a browser API and that package must
 * stay safe to import from the Node.js API.
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}
