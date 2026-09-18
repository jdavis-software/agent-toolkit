export interface CategoryDefinition {
  id:string; title:string; description:string; icon:string; entryIds:string[];
  counts:{entries:number;skills:number;tools:number;workflows:number};
}
export const categoryIcons:string[];
export function validateCategories(document:unknown,entries:unknown):CategoryDefinition[];
export function loadCategories(root?:string):Promise<CategoryDefinition[]>;
