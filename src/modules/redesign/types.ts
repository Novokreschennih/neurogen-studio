export type AppMode = 'redesign' | 'apply';
export type SidebarTab = 'controls' | 'history';
export type Viewport = 'desktop' | 'mobile';
export type ApiProvider = 'gemini' | 'openrouter' | 'routerai';

export interface DesignVariant {
  id: string;
  name: string;
  html: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  provider: ApiProvider;
  inputHtml: string;
  selectedStyle: string;
  selectedModel: string;
  generatedDesigns: DesignVariant[];
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

export interface RedesignConstants {
  DESIGN_STYLES: Record<string, string>;
  DESIGN_STYLE_CONFIG: Record<string, string>;
}
