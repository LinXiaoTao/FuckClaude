/** Shared Redis key prefix for memorial wall (Node plain JS). */

export function memorialPrefix(env = process.env.VERCEL_ENV || 'development') {
  return `fc:mem:${env}:`;
}

export function memorialKeys(env) {
  const p = memorialPrefix(env);
  return {
    seq: `${p}seq`,
    entry: (no) => `${p}m:${no}`,
    idxNew: `${p}idx:new`,
    idxDays: `${p}idx:days`,
    agg: `${p}agg`,
    pattern: `${p}*`,
  };
}