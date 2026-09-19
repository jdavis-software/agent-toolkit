import type { BundleManifest, BundleResolveOptions } from './bundles.mjs';
export interface RoleDefinition {
 id: string; title: string; kind: 'review'|'implementation'|'analysis'|'production'; description: string;
 version: string; stage: 'experimental'; requestedMode: 'read-only'|'task-bound'; skills: string[];
 deliverables: string[]; context: string[]; nonGoals: string[];
}
export interface RoleManifest {
 schemaVersion: 1; role: RoleDefinition; skills: string[]; files: BundleManifest['files']; roleDigest: string;
 source: BundleManifest['source']; execution: 'none'; authority: string; limits: string[];
}
export function validateRoles(document: unknown, entries: unknown): RoleDefinition[];
export function loadRoles(root?: string): Promise<RoleDefinition[]>;
export function resolveRole(root: string, id: string, options?: BundleResolveOptions): Promise<RoleManifest>;
export function validateRolePackages(root?: string): Promise<number>;
