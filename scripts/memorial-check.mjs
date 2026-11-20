/**
 * Unit checks for memorial validation helpers and UI key coverage.
 * Run: npm run memorial:check
 */
import { ui } from '../src/i18n/ui.ts';
import {
  CLAUDE_FIRST_RELEASE,
  daysBetween,
  percentBelow,
  validateCreateInput,
} from '../src/config/memorial.ts';

const PAGE_KEYS = [
  'nav.memorial',
  'nav.memorial.desc',
  'memorial.meta.title',
  'memorial.meta.description',
  'memorial.title',
  'memorial.lead',
  'memorial.disclaimer',
  'memorial.stat.tombstones',
  'memorial.stat.median',
  'memorial.stat.longest',
  'memorial.stat.shortest',
  'memorial.stat.candles',
  'memorial.compare.label',
  'memorial.compare.hint',
  'memorial.compare.result',
  'memorial.sort.new',
  'memorial.sort.long',
  'memorial.sort.short',
  'memorial.card.no',
  'memorial.card.survived',
  'memorial.card.created',
  'memorial.card.banned',
  'memorial.card.candle',
  'memorial.card.candleCount',
  'memorial.plan.free',
  'memorial.plan.pro',
  'memorial.plan.max',
  'memorial.plan.other',
  'memorial.loadMore',
  'memorial.offline',
  'memorial.form.title',
  'memorial.form.created',
  'memorial.form.banned',
  'memorial.form.plan',
  'memorial.form.submit',
  'memorial.form.success',
  'memorial.form.copy',
  'memorial.form.codeWarning',
  'memorial.form.editCode',
  'memorial.my.title',
  'memorial.my.empty',
  'memorial.my.edit',
  'memorial.my.delete',
  'memorial.claim.title',
  'memorial.claim.no',
  'memorial.claim.code',
  'memorial.claim.submit',
  'memorial.faq.title',
  'memorial.faq.q1',
  'memorial.faq.a1',
  'memorial.faq.q2',
  'memorial.faq.a2',
  'memorial.faq.q3',
  'memorial.faq.a3',
  'memorial.err.bad_request',
  'memorial.err.invalid_date',
  'memorial.err.dates_reversed',
  'memorial.err.banned_future',
  'memorial.err.before_release',
  'memorial.err.invalid_plan',
  'memorial.err.honeypot',
  'memorial.err.elapsed_too_short',
  'memorial.err.rate_limited',
  'memorial.err.forbidden',
  'memorial.err.unavailable',
];

let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
  }
}

const now = new Date('2026-06-15T12:00:00Z');
const base = {
  createdOn: '2024-01-01',
  bannedOn: '2024-06-01',
  plan: 'pro',
  website: '',
  elapsedMs: 3000,
};

assert(validateCreateInput(base, now).ok === true, 'valid input');
assert(validateCreateInput({ ...base, bannedOn: '2023-12-01' }, now).code === 'dates_reversed', 'reversed');
assert(validateCreateInput({ ...base, bannedOn: '2099-01-01' }, now).code === 'banned_future', 'future');
assert(
  validateCreateInput({ ...base, createdOn: '2020-01-01' }, now).code === 'before_release',
  'before release',
);
assert(validateCreateInput({ ...base, createdOn: 'bad' }, now).code === 'invalid_date', 'bad format');
assert(validateCreateInput({ ...base, plan: 'vip' }, now).code === 'invalid_plan', 'bad plan');
assert(validateCreateInput({ ...base, website: 'http://x' }, now).code === 'honeypot', 'honeypot');
assert(validateCreateInput({ ...base, elapsedMs: 100 }, now).code === 'elapsed_too_short', 'elapsed');

assert(daysBetween('2024-01-01', '2024-01-11') === 10, 'daysBetween');
assert(percentBelow(5, [0, 5, 10, 15]) === 25, 'percentBelow');

const big = JSON.stringify({ ...base, padding: 'x'.repeat(1200) });
assert(big.length > 1024, 'oversize fixture');
assert(validateCreateInput(JSON.parse(big), now).ok === true, 'oversize still validates shape');

for (const key of PAGE_KEYS) {
  assert(key in ui.en, `ui.en missing ${key}`);
  assert(key in ui.zh, `ui.zh missing ${key}`);
}

assert(CLAUDE_FIRST_RELEASE === '2023-03-14', 'release constant');

if (failed > 0) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log('memorial:check OK');