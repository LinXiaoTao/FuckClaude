/** Appended to privacy later by the lead. Not wired in resolve.ts yet. */
export const PRIVACY_MEMORIAL_SECTION: { en: string; zh: string } = {
  en: `
<h2>Memorial wall</h2>
<p>The <a href="/memorial/">Claude account memorial</a> stores voluntary tombstone entries in Upstash Redis. For each visible entry we keep the account created date, ban date, derived survival days, reported plan tier, candle count, submission time (UTC), and a SHA-256 hash of a one-time edit code. We do not store IP addresses, browser fingerprints, Anthropic account identifiers, email addresses, or free-text comments. Entries are public on the wall. Create, edit, delete, and candle actions are rate-limited per server instance using the client address only in memory for a short window; nothing from that limiter is written to Redis. You can delete your entry with the edit code, or ask us via the <a href="/contact/">contact page</a>.</p>
`.trim(),
  zh: `
<h2>纪念墙</h2>
<p><a href="/zh/memorial/">Claude 账户纪念墙</a>将自愿提交的纪念碑条目存放在 Upstash Redis 中。每条公开可见的记录包括账户创建日、封禁日、推算的存活天数、用户自报的套餐、蜡烛计数、提交时间（UTC），以及一次性编辑码的 SHA-256 哈希。我们不保存 IP 地址、浏览器指纹、Anthropic 账户标识、电子邮箱或自由文本评论。条目在纪念墙上公开显示。创建、编辑、删除与点蜡烛的接口在每台服务器实例上以短时内存窗口按客户端地址限流，限流数据不写入 Redis。您可用编辑码删除自己的条目，或通过<a href="/zh/contact/">联系页</a>与我们联系。</p>
`.trim(),
};