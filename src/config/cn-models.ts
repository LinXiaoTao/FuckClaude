/**
 * Domestic (Chinese) LLM picks rendered by `src/components/CnModels.astro`
 * as a strip of name-only outbound links below the "How the check works"
 * section. Every link is tagged with the `utm_source=fuck-claude` referral source.
 */

export interface CnModel {
  id: string;
  name: string;
  /** Outbound link, tagged with the fuck-claude referral source. */
  url: string;
}

export const CN_MODELS: CnModel[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://www.deepseek.com/?utm_source=fuck-claude',
  },
  {
    id: 'glm',
    name: 'GLM',
    url: 'https://bigmodel.cn/claude-code-plan?utm_source=fuck-claude',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    url: 'https://www.kimi.com/code?utm_source=fuck-claude',
  },
];
