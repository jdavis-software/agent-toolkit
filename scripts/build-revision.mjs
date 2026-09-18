// Build-only environment access; the public endpoint exposes no other variables.
export function buildRevision() {
  const candidate = process.env.GITHUB_SHA;
  return candidate && /^[0-9a-f]{40}$/.test(candidate) ? candidate : null;
}
