#!/usr/bin/env node
/**
 * Memorial wall admin (Upstash REST). Credentials from env (KV_REST_* or UPSTASH_*).
 *
 * Usage:
 *   node scripts/memorial-admin.mjs --help
 *   node scripts/memorial-admin.mjs stats [--env development|preview|production]
 *   node scripts/memorial-admin.mjs list [--env ...]
 *   node scripts/memorial-admin.mjs hide <no> [--env ...]
 *   node scripts/memorial-admin.mjs show <no> [--env ...]
 *   node scripts/memorial-admin.mjs delete <no> [--env ...]
 *   node scripts/memorial-admin.mjs purge-prefix [--env ...]  (refuses production)
 *
 * Default --env is development. production mutators require --yes.
 */

import { memorialKeys } from './memorial-keys.mjs';

function help() {
  console.log(`Memorial admin

  node scripts/memorial-admin.mjs stats [--env development|preview|production]
  node scripts/memorial-admin.mjs list [--env ...]
  node scripts/memorial-admin.mjs hide <no> [--env ...]
  node scripts/memorial-admin.mjs show <no> [--env ...]
  node scripts/memorial-admin.mjs delete <no> [--env ...]
  node scripts/memorial-admin.mjs purge-prefix [--env ...]

Set KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_*).
`);
}

function parseArgs(argv) {
  let env = 'development';
  let yes = false;
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--env') {
      env = argv[++i] ?? env;
    } else if (a === '--yes') {
      yes = true;
    } else if (a === '--help' || a === '-h') {
      help();
      process.exit(0);
    } else {
      rest.push(a);
    }
  }
  return { cmd: rest[0], args: rest.slice(1), env, yes };
}

function redisConfig() {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!url || !token) throw new Error('Missing Redis REST credentials');
  return { url, token };
}

async function pipeline(config, commands) {
  const res = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const cells = await res.json();
  const failed = cells.find((c) => c.error);
  if (failed) throw new Error(failed.error);
  return cells;
}

async function multiExec(config, commands) {
  const res = await fetch(`${config.url}/multi-exec`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  const cells = await res.json();
  const failed = cells.find((c) => c.error);
  if (failed) throw new Error(failed.error);
  return cells;
}

function flatHash(flat) {
  const out = {};
  if (!Array.isArray(flat)) return out;
  for (let i = 0; i + 1 < flat.length; i += 2) out[String(flat[i])] = String(flat[i + 1]);
  return out;
}

async function loadEntry(config, k, no) {
  const [cell] = await pipeline(config, [['HGETALL', k.entry(no)]]);
  const fields = flatHash(cell.result);
  return { fields, exists: fields.createdOn !== undefined };
}

async function cmdStats(config, env) {
  const k = memorialKeys(env);
  const [aggCell, cardCell] = await pipeline(config, [['HGETALL', k.agg], ['ZCARD', k.idxDays]]);
  const agg = flatHash(aggCell.result);
  console.log(JSON.stringify({ env, agg, visibleByDaysIndex: cardCell.result }, null, 2));
}

async function cmdList(config, env) {
  const k = memorialKeys(env);
  const [idsCell] = await pipeline(config, [['ZREVRANGE', k.idxNew, 0, 49]]);
  const ids = Array.isArray(idsCell.result) ? idsCell.result.map(Number) : [];
  for (const no of ids) {
    const { fields } = await loadEntry(config, k, no);
    console.log(no, fields.status, fields.days, fields.plan, fields.bannedOn);
  }
}

async function cmdHide(config, env, no) {
  const k = memorialKeys(env);
  const { fields } = await loadEntry(config, k, no);
  if (fields.status !== 'visible') return console.log('skip');
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  await multiExec(config, [
    ['HSET', k.entry(no), 'status', 'hidden'],
    ['ZREM', k.idxNew, no],
    ['ZREM', k.idxDays, no],
    ['HINCRBY', k.agg, 'count', -1],
    ['HINCRBY', k.agg, 'sumDays', -days],
    ['HINCRBY', k.agg, 'candles', -candles],
  ]);
  console.log('hidden', no);
}

async function cmdShow(config, env, no) {
  const k = memorialKeys(env);
  const { fields } = await loadEntry(config, k, no);
  if (fields.status !== 'hidden') return console.log('skip');
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  await multiExec(config, [
    ['HSET', k.entry(no), 'status', 'visible'],
    ['ZADD', k.idxNew, no, no],
    ['ZADD', k.idxDays, days, no],
    ['HINCRBY', k.agg, 'count', 1],
    ['HINCRBY', k.agg, 'sumDays', days],
    ['HINCRBY', k.agg, 'candles', candles],
  ]);
  console.log('shown', no);
}

async function cmdDelete(config, env, no) {
  const k = memorialKeys(env);
  const { fields, exists } = await loadEntry(config, k, no);
  if (!exists) return console.log('missing');
  const days = Number(fields.days) || 0;
  const candles = Number(fields.candles) || 0;
  const cmds = [['DEL', k.entry(no)], ['ZREM', k.idxNew, no], ['ZREM', k.idxDays, no]];
  if (fields.status === 'visible') {
    cmds.push(['HINCRBY', k.agg, 'count', -1], ['HINCRBY', k.agg, 'sumDays', -days], ['HINCRBY', k.agg, 'candles', -candles]);
  }
  await multiExec(config, cmds);
  console.log('deleted', no);
}

async function cmdPurge(config, env) {
  if (env === 'production') throw new Error('refuse purge-prefix on production');
  const k = memorialKeys(env);
  let cursor = 0;
  const toDel = [];
  do {
    const [cell] = await pipeline(config, [['SCAN', cursor, 'MATCH', k.pattern, 'COUNT', 100]]);
    cursor = Number(cell.result?.[0] ?? 0);
    const keys = cell.result?.[1] ?? [];
    toDel.push(...keys);
  } while (cursor !== 0);
  if (toDel.length === 0) {
    console.log('nothing to purge');
    return;
  }
  for (let i = 0; i < toDel.length; i += 50) {
    await pipeline(config, [['DEL', ...toDel.slice(i, i + 50)]]);
  }
  console.log(`purged ${toDel.length} keys under ${k.pattern}`);
}

const { cmd, args, env, yes } = parseArgs(process.argv.slice(2));
if (!cmd) {
  help();
  process.exit(1);
}
if (env === 'production' && ['hide', 'show', 'delete', 'purge-prefix'].includes(cmd) && !yes) {
  console.error('production mutators require --yes');
  process.exit(1);
}

const config = redisConfig();

try {
  switch (cmd) {
    case 'stats':
      await cmdStats(config, env);
      break;
    case 'list':
      await cmdList(config, env);
      break;
    case 'hide':
      await cmdHide(config, env, Number(args[0]));
      break;
    case 'show':
      await cmdShow(config, env, Number(args[0]));
      break;
    case 'delete':
      await cmdDelete(config, env, Number(args[0]));
      break;
    case 'purge-prefix':
      await cmdPurge(config, env);
      break;
    default:
      help();
      process.exit(1);
  }
} catch (err) {
  console.error(err);
  process.exit(1);
}