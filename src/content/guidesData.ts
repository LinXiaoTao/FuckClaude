/**
 * Detailed guide content for the Anti-Ban & Environment Cleanup Knowledge Base.
 */

import { claude_steganography_and_risk_model_content } from './guides/claude-steganography-and-risk-model';
import { environment_cleanup_and_ip_setup_content } from './guides/environment-cleanup-and-ip-setup';
import { account_registration_and_payment_antiban_content } from './guides/account-registration-and-payment-antiban';
import { claude_code_and_api_safety_content } from './guides/claude-code-and-api-safety';
import { account_appeal_and_recovery_sop_content } from './guides/account-appeal-and-recovery-sop';
import { domestic_and_open_source_alternatives_content } from './guides/domestic-and-open-source-alternatives';
import { browser_configuration_guide_content } from './guides/browser-configuration-guide';
import { vpn_and_proxy_selection_content } from './guides/vpn-and-proxy-selection';
import { ban_case_studies_content } from './guides/ban-case-studies';
import { multi_account_management_content } from './guides/multi-account-management';
import { api_advanced_optimization_content } from './guides/api-advanced-optimization';
import { troubleshooting_guide_content } from './guides/troubleshooting-guide';
import { device_setup_guide_content } from './guides/device-setup-guide';
import { payment_methods_comparison_content } from './guides/payment-methods-comparison';
import { regional_access_strategy_content } from './guides/regional-access-strategy';
import { automation_safety_practices_content } from './guides/automation-safety-practices';

export interface ArticleContent {
  slug: string;
  title: { en: string; zh: string };
  category: { en: string; zh: string };
  readTime: string;
  updatedAt: string;
  content: {
    en: string;
    zh: string;
  };
}

export const ARTICLES_DATA: Record<string, ArticleContent> = {
  'claude-steganography-and-risk-model': {
    slug: 'claude-steganography-and-risk-model',
    category: { en: 'Risk Model & Steganography', zh: '风控解密与隐写原理' },
    title: {
      en: 'Claude Code Steganography & Anthropic 4-Layer Risk Model',
      zh: 'Claude Code 隐写暗记原理与 Anthropic 四维风控模型解密',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
    content: claude_steganography_and_risk_model_content,
  },
  'environment-cleanup-and-ip-setup': {
    slug: 'environment-cleanup-and-ip-setup',
    category: { en: 'Environment Cleanup & IP Setup', zh: '环境纯化与 IP 配置' },
    title: {
      en: 'OS & Browser Environment Cleanup & Residential IP Guide',
      zh: '操作系统/浏览器环境纯化与原生住宅 IP 配置指南',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: environment_cleanup_and_ip_setup_content,
  },
  'account-registration-and-payment-antiban': {
    slug: 'account-registration-and-payment-antiban',
    category: { en: 'Account & Payment Safety', zh: '账号注册与支付避坑' },
    title: {
      en: 'Safe Account Registration, Virtual Card BIN & Payment Risk Avoidance',
      zh: 'Claude 账号注册避坑、虚拟卡 BIN 选择与高胜率订阅指南',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
    content: account_registration_and_payment_antiban_content,
  },
  'claude-code-and-api-safety': {
    slug: 'claude-code-and-api-safety',
    category: { en: 'Claude Code & API Safety', zh: 'Claude Code 与 API 规范' },
    title: {
      en: 'Claude Code Safe Configuration & Relay API Best Practices',
      zh: 'Claude Code 安全配置与第三方 API 中转平滑降级规范',
    },
    readTime: '7 min',
    updatedAt: '2026-08',
    content: claude_code_and_api_safety_content,
  },
  'account-appeal-and-recovery-sop': {
    slug: 'account-appeal-and-recovery-sop',
    category: { en: 'Account Appeal & Recovery SOP', zh: '封号诊断与申诉自救' },
    title: {
      en: 'Account Ban Diagnosis & High-Success English Appeal SOP',
      zh: 'Claude 封号类型判定与高成功率英文申诉自救 SOP',
    },
    readTime: '8 min',
    updatedAt: '2026-08',
    content: account_appeal_and_recovery_sop_content,
  },
  'domestic-and-open-source-alternatives': {
    slug: 'domestic-and-open-source-alternatives',
    category: { en: 'Domestic Models & Failover', zh: '平替模型与灾备方案' },
    title: {
      en: 'Seamless Failover to Domestic AI Models & Local Open-Source Setups',
      zh: '国产顶尖模型平替指引与私有化 Ollama/One-API 降级通道',
    },
    readTime: '6 min',
    updatedAt: '2026-08',
    content: domestic_and_open_source_alternatives_content,
  },
  'browser-configuration-guide': {
    slug: 'browser-configuration-guide',
    category: { en: 'Environment Cleanup & IP Setup', zh: '环境纯化与 IP 配置' },
    title: {
      en: 'Browser Configuration Guide for Claude Anti-Ban',
      zh: 'Chrome/Firefox/Edge 防封配置实操手册',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: browser_configuration_guide_content,
  },
  'vpn-and-proxy-selection': {
    slug: 'vpn-and-proxy-selection',
    category: { en: 'Environment Cleanup & IP Setup', zh: '环境纯化与 IP 配置' },
    title: {
      en: 'VPN & Proxy Selection: Residential IP vs Datacenter IP',
      zh: 'VPN 与代理服务选择指南：住宅 IP vs 数据中心 IP',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
    content: vpn_and_proxy_selection_content,
  },
  'ban-case-studies': {
    slug: 'ban-case-studies',
    category: { en: 'Risk Model & Steganography', zh: '风控解密与隐写原理' },
    title: {
      en: 'Claude Ban Case Studies & Root Cause Analysis',
      zh: 'Claude 封号案例复盘与避坑经验',
    },
    readTime: '11 min',
    updatedAt: '2026-08',
    content: ban_case_studies_content,
  },
  'multi-account-management': {
    slug: 'multi-account-management',
    category: { en: 'Account & Payment Safety', zh: '账号注册与支付避坑' },
    title: {
      en: 'Multi-Account Management Best Practices',
      zh: '多账号管理最佳实践：环境隔离与安全切换',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: multi_account_management_content,
  },
  'api-advanced-optimization': {
    slug: 'api-advanced-optimization',
    category: { en: 'Claude Code & API Safety', zh: 'Claude Code 与 API 规范' },
    title: {
      en: 'Advanced Claude API Optimization & Token Management',
      zh: 'Claude API 进阶优化：Token 控制与 Prompt Cache 实战',
    },
    readTime: '12 min',
    updatedAt: '2026-08',
    content: api_advanced_optimization_content,
  },
  'troubleshooting-guide': {
    slug: 'troubleshooting-guide',
    category: { en: 'Account Appeal & Recovery SOP', zh: '封号诊断与申诉自救' },
    title: {
      en: 'Claude Troubleshooting & Diagnostic Guide',
      zh: 'Claude 使用故障排查与问题定位手册',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
    content: troubleshooting_guide_content,
  },
  'device-setup-guide': {
    slug: 'device-setup-guide',
    category: { en: 'Environment Cleanup & IP Setup', zh: '环境纯化与 IP 配置' },
    title: {
      en: 'Cross-Platform Device Setup for Claude Anti-Ban',
      zh: '跨平台设备防封配置：Mac/Windows/Linux/移动端',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: device_setup_guide_content,
  },
  'payment-methods-comparison': {
    slug: 'payment-methods-comparison',
    category: { en: 'Account & Payment Safety', zh: '账号注册与支付避坑' },
    title: {
      en: 'Virtual Card Platforms & Payment Methods Comparison',
      zh: '虚拟卡平台与支付方式深度对比评测',
    },
    readTime: '11 min',
    updatedAt: '2026-08',
    content: payment_methods_comparison_content,
  },
  'regional-access-strategy': {
    slug: 'regional-access-strategy',
    category: { en: 'Account & Payment Safety', zh: '账号注册与支付避坑' },
    title: {
      en: 'Regional Access Strategies & Registration Guide',
      zh: 'Claude 全球地区访问策略与注册指引',
    },
    readTime: '9 min',
    updatedAt: '2026-08',
    content: regional_access_strategy_content,
  },
  'automation-safety-practices': {
    slug: 'automation-safety-practices',
    category: { en: 'Claude Code & API Safety', zh: 'Claude Code 与 API 规范' },
    title: {
      en: 'Safe Automation & Batch API Usage Guidelines',
      zh: 'Claude 自动化与批量调用安全规范',
    },
    readTime: '10 min',
    updatedAt: '2026-08',
    content: automation_safety_practices_content,
  },
};
