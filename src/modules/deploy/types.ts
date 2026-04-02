export interface SiteFile {
  id: string;
  path: string;
  name: string;
  content: string | ArrayBuffer;
  type: string;
  objectUrl?: string;
  history?: string[];
  historyIndex?: number;
}

export interface HtmlFile extends SiteFile {
  content: string;
  isMain: boolean;
  newFileName: string;
  placeholders: string[];
  placeholderValues: Record<string, string>;
  linkPlaceholders: Record<string, string>;
  history?: string[];
  historyIndex?: number;
}

export type ApiProvider = 'gemini' | 'openrouter' | 'routerai';

export interface AiConfig {
    provider: ApiProvider;
    geminiKey: string;
    openRouterKey: string;
    openRouterModel: string;
    routerAiKey: string;
    routerAiModel: string;
}

export interface OpenRouterModel {
    id: string;
    name: string;
}

export interface AnalysisReport {
    seo: string;
    accessibility: string;
    recommendations: string[];
}
