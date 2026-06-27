// ═══════════════════════════════════════════════════════════════════
//  Re-export from the central registry (v2)
//  All tool definitions live in registry.ts — the single source of truth.
//  This file exists for backward compatibility so existing imports
//  (e.g. `from "@/data/tools"`) continue to work.
// ═══════════════════════════════════════════════════════════════════

export type {
  FormatDefinition,
  ToolCategory,
  ToolSeo,
  ToolFaqEntry,
  RegistryEntry,
  ToolDefinition,
  Engine,
  ProcessingType,
} from "./registry";

export {
  FORMATS,
  FORMAT_GROUPS,
  CATEGORIES,
  CATEGORY_URLS,
  URL_TO_CATEGORY,
  getTool,
  getAllTools,
  getCuratedTools,
  getPopularTools,
  getToolsByCategory,
  getCategoryById,
  getCategoryByUrlSlug,
  getRelatedTools,
  getToolCount,
  getStaticToolSlugs,
  getCategoryTools,
  getCategoryStats,
  getCategoryPopularTools,
  getFormatByExt,
  getCuratedToolCount,
  getToolsByInputFormat,
  getToolsByOutputFormat,
  getToolsByFormat,
} from "./registry";
