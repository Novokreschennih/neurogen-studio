import type { OpenRouterModel } from './types';

export const DESIGN_STYLE_CONFIG: { [key: string]: string } = {
  aiChoice: "AI's Choice",
  minimalist: 'Minimalist',
  monochromatic: 'Monochromatic',
  glassmorphism: 'Glassmorphism',
  aurora: 'Aurora',
  neumorphism: 'Neumorphism',
  brutalism: 'Brutalism',
  corporate: 'Corporate',
  playful: 'Playful',
  futuristic: 'Futuristic',
  windows11: 'Windows 11',
  macos: 'macOS',
  apple: 'Apple Aesthetic',
  material3: 'Material Design 3',
  cyberpunk: 'Cyberpunk',
  claymorphism: 'Claymorphism',
  bento: 'Bento Grid',
  retroWave: 'Retro Wave',
  bauhaus: 'Bauhaus',
  swiss: 'Swiss Style',
  y2k: 'Y2K Aesthetic',
  sketch: 'Hand-drawn Sketch',
  luxury: 'Luxury / Elegant',
  popArt: 'Pop Art',
  isometric: 'Isometric 3D',
};

export const DESIGN_STYLES = Object.keys(DESIGN_STYLE_CONFIG);

export const FALLBACK_OPENROUTER_MODELS: OpenRouterModel[] = [
    { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' }
];

export const MAX_HISTORY_ITEMS = 20;
