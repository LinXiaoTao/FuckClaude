/**
 * Facts Anthropic states publicly, shown on the guides hub. Every entry must
 * link to the official page it comes from. Re-check the sources and bump
 * `OFFICIAL_RULES_CHECKED_AT` whenever this list changes.
 */

import { OFFICIAL_SOURCES, type GuideSource, type LocalizedText } from './guides';

export const OFFICIAL_RULES_CHECKED_AT = '2026-11-12';

export interface OfficialRule {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  sources: GuideSource[];
}

export const OFFICIAL_RULES: OfficialRule[] = [
  {
    id: 'regions',
    title: { en: 'Supported regions', zh: '支持地区' },
    body: {
      en: 'Claude.ai and the API are offered only in the countries on the Supported Regions list. Mainland China, Hong Kong, and Macau are not on it; Taiwan, Singapore, Japan, and India are. Anthropic also reserves the right to refuse entities whose majority ownership is attributable to nations not on the list.',
      zh: 'Claude.ai 与 API 只在「支持地区」名单内的国家和地区提供。中国大陆、香港、澳门不在名单内，台湾、新加坡、日本、印度在名单内。Anthropic 还保留拒绝服务以下实体的权利：多数股权直接或间接归属于名单外国家的实体。',
    },
    sources: [OFFICIAL_SOURCES.supportedRegions],
  },
  {
    id: 'ban-reasons',
    title: { en: 'Ban reasons', zh: '封禁原因' },
    body: {
      en: 'Anthropic lists three: repeated Usage Policy violations, account creation from an unsupported location, and Terms of Service violations.',
      zh: 'Anthropic 列出三类：反复违反使用政策、从不受支持的地区创建账户、违反服务条款。',
    },
    sources: [OFFICIAL_SOURCES.safeguards, OFFICIAL_SOURCES.usagePolicy],
  },
  {
    id: 'appeals',
    title: { en: 'Appeals and your data', zh: '申诉与数据' },
    body: {
      en: 'Sign in to claude.ai with the banned account to reach the appeal form. Free, Pro, and Max accounts banned for Usage Policy violations can still export data or delete the account from the same screen. Warnings on API accounts go to usersafety@anthropic.com.',
      zh: '用被封账号登录 claude.ai 即可进入申诉表单。因违反使用政策被封的 Free、Pro、Max 账号，仍可在同一界面导出数据或删除账号。API 账号的警告可发邮件到 usersafety@anthropic.com。',
    },
    sources: [OFFICIAL_SOURCES.safeguards],
  },
  {
    id: 'payment',
    title: { en: 'Payment', zh: '支付' },
    body: {
      en: 'Pro and Max subscriptions bought on the web accept credit or debit cards only; PayPal and Venmo are not accepted. App Store and Google Play subscriptions use the store’s payment methods. The card’s billing address must match its country of origin and be an eligible billing location.',
      zh: '网页端购买的 Pro 与 Max 订阅只接受信用卡或借记卡，不接受 PayPal、Venmo。通过 App Store 或 Google Play 订阅时，使用应用商店的支付方式。银行卡的账单地址必须与发卡国家一致，并属于受支持的账单地区。',
    },
    sources: [OFFICIAL_SOURCES.billingFaq, OFFICIAL_SOURCES.cardDeclined],
  },
  {
    id: 'scale',
    title: { en: 'Enforcement scale', zh: '处置规模' },
    body: {
      en: 'For the first half of 2026 Anthropic reports 11.4 million accounts disabled, 398,000 appeals, and 42,000 reinstatements, about 10.5% of appeals.',
      zh: 'Anthropic 披露 2026 年上半年封禁 1140 万个账号，收到 39.8 万次申诉，恢复 4.2 万个账号，约占申诉的 10.5%。',
    },
    sources: [OFFICIAL_SOURCES.transparency],
  },
];
