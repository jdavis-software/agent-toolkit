/** Public types for the runtime-validated, dependency-free resolver. */
export interface BundleDefinition {
  id: string;
  title: string;
  description: string;
  version: string;
  stage: 'experimental';
  skills: string[];
}
export interface BundleFile { path: string; bytes: number; sha256: string; }
export interface BundleManifest {
  schemaVersion: 1;
  bundleId: string;
  bundleVersion: string;
  skills: string[];
  files: BundleFile[];
  bundleDigest: string;
  source: { revision: string | null; dirty: boolean | null; verification: 'git-observed' | 'content-only' };
  limits: string[];
}
export interface BundleResolveOptions { requireClean?: boolean; expectedRevision?: string; }
export function safeBundlePath(path: unknown): string;
export function validateBundleDefinitions(document: unknown, entries: unknown): BundleDefinition[];
export function loadBundles(root?: string): Promise<BundleDefinition[]>;
export function resolveBundle(root: string, id: string, options?: BundleResolveOptions): Promise<BundleManifest>;
export function validateExpansion(root?: string): Promise<{ bundles: number; skills: number; scenarioInputs: number }>;

export function readSelectionBytes(root: string, path: string): Promise<Buffer>;
export function resolveSkillSelection(root: string, selection: BundleDefinition, options?: BundleResolveOptions & { registryPaths?: string[] }): Promise<BundleManifest>;
