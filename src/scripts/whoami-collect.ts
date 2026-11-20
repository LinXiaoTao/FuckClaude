import type { Layer, Reading, ReadingId, Snapshot } from '../config/whoami';

export type WhoAmIApi = {
  ip: string | null;
  geo: {
    country: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
  };
  headers: Record<string, string | null>;
};

function reading(id: ReadingId, layer: Layer, value: string, atMs: number): Reading {
  return { id, layer, value, atMs };
}

function shortHash(input: string): string {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 8);
}

function canvasReading(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'unavailable';
    const draw = () => {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(0, 0, 120, 30);
      ctx.fillStyle = '#069';
      ctx.fillText('whoami', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('whoami', 4, 17);
    };
    draw();
    const a = shortHash(canvas.toDataURL());
    draw();
    const b = shortHash(canvas.toDataURL());
    return a === b ? `stable ${a}` : `unstable ${a}/${b}`;
  } catch {
    return 'unavailable';
  }
}

function scriptTimezoneValue(): string {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const off = m === 0 ? `${sign}${h}` : `${sign}${h}:${String(m).padStart(2, '0')}`;
  return `${zone} (UTC${off})`;
}

function gpuRenderer(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    if (!gl) return 'unavailable';
    const webgl = gl as WebGLRenderingContext;
    const ext = webgl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return 'masked';
    const renderer = webgl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
    return typeof renderer === 'string' && renderer ? renderer : 'masked';
  } catch {
    return 'unavailable';
  }
}

function uaDataPlatform(): string | null {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const p = nav.userAgentData?.platform;
  return p && p.length > 0 ? p : null;
}

function collectScriptReadings(started: number): Partial<Snapshot> {
  const now = () => performance.now() - started;
  const out: Partial<Snapshot> = {};

  out['script.timezone'] = reading('script.timezone', 'script', scriptTimezoneValue(), now());
  out['script.languages'] = reading(
    'script.languages',
    'script',
    navigator.languages?.length ? navigator.languages.join(', ') : navigator.language,
    now(),
  );
  out['script.userAgent'] = reading('script.userAgent', 'script', navigator.userAgent, now());
  const platform = uaDataPlatform();
  if (platform) {
    out['script.uaDataPlatform'] = reading('script.uaDataPlatform', 'script', platform, now());
  }
  const dpr = window.devicePixelRatio ?? 1;
  const screenVal = `${window.screen.width}×${window.screen.height} CSS ${Math.round(window.innerWidth)}×${Math.round(window.innerHeight)}, DPR ${dpr}, depth ${window.screen.colorDepth}`;
  out['script.screen'] = reading('script.screen', 'script', screenVal, now());
  const gpu = gpuRenderer();
  if (gpu !== 'masked') {
    out['script.gpu'] = reading('script.gpu', 'script', gpu, now());
  }
  out['script.cores'] = reading('script.cores', 'script', String(navigator.hardwareConcurrency ?? '—'), now());
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number') {
    out['script.memory'] = reading('script.memory', 'script', `${mem} GiB`, now());
  }
  out['script.touch'] = reading('script.touch', 'script', String(navigator.maxTouchPoints ?? 0), now());
  out['script.canvas'] = reading('script.canvas', 'script', canvasReading(), now());
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  const dnt = navigator.doNotTrack === '1' || (navigator as Navigator & { doNotTrack?: string }).doNotTrack === '1';
  out['script.privacy'] = reading('script.privacy', 'script', `GPC ${gpc ? 'on' : 'off'}, DNT ${dnt ? 'on' : 'off'}`, now());

  return out;
}

function mapRequest(api: WhoAmIApi, started: number): Partial<Snapshot> {
  const t = () => performance.now() - started;
  const out: Partial<Snapshot> = {};
  if (api.ip) out['request.ip'] = reading('request.ip', 'request', api.ip, t());
  if (api.geo.country) out['request.country'] = reading('request.country', 'request', api.geo.country, t());
  if (api.geo.region) out['request.region'] = reading('request.region', 'request', api.geo.region, t());
  if (api.geo.city) out['request.city'] = reading('request.city', 'request', api.geo.city, t());
  if (api.geo.timezone) out['request.ipTimezone'] = reading('request.ipTimezone', 'request', api.geo.timezone, t());
  const al = api.headers['accept-language'];
  if (al) out['request.acceptLanguage'] = reading('request.acceptLanguage', 'request', al, t());
  const ua = api.headers['user-agent'];
  if (ua) out['request.userAgent'] = reading('request.userAgent', 'request', ua, t());
  const platform = api.headers['sec-ch-ua-platform'];
  if (platform) out['request.secChUaPlatform'] = reading('request.secChUaPlatform', 'request', platform, t());
  const gpc = api.headers['sec-gpc'];
  if (gpc) out['request.secGpc'] = reading('request.secGpc', 'request', gpc, t());
  const dnt = api.headers['dnt'];
  if (dnt) out['request.dnt'] = reading('request.dnt', 'request', dnt, t());
  return out;
}

interface IpJson {
  network?: { type?: string | null; asn?: string | null; org?: string | null };
  flags?: { proxy?: boolean | null; vpn?: boolean | null };
}

function mapNetwork(data: IpJson, started: number): Partial<Snapshot> {
  const t = () => performance.now() - started;
  const out: Partial<Snapshot> = {};
  const type = data.network?.type;
  if (type) out['network.type'] = reading('network.type', 'network', type, t());
  const asn = data.network?.asn;
  if (asn) out['network.asn'] = reading('network.asn', 'network', String(asn), t());
  const org = data.network?.org;
  if (org) out['network.org'] = reading('network.org', 'network', org, t());
  const proxy = data.flags?.proxy === true || data.flags?.vpn === true;
  const no = data.flags?.proxy === false && data.flags?.vpn === false;
  if (proxy || no) {
    out['network.proxy'] = reading('network.proxy', 'network', proxy ? 'yes' : 'no', t());
  }
  return out;
}

export async function fetchWhoAmIApi(): Promise<WhoAmIApi | null> {
  try {
    const res = await fetch('/api/whoami', { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as WhoAmIApi;
  } catch {
    return null;
  }
}

export async function fetchIpNetwork(): Promise<IpJson | null> {
  try {
    const res = await fetch('/api/ip?format=json', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as IpJson;
  } catch {
    return null;
  }
}

function extractIp(candidate: string): string | null {
  const v4 = /(\d{1,3}(?:\.\d{1,3}){3})/.exec(candidate);
  if (v4) return v4[1];
  const v6 = /([a-f0-9:]{2,})/i.exec(candidate);
  if (v6 && v6[1].includes(':')) return v6[1];
  return null;
}

function isMdnsHost(candidate: string): boolean {
  return /\.local\b/i.test(candidate);
}

export function runWebrtcProbe(started: number): Promise<Partial<Snapshot>> {
  return new Promise((resolve) => {
    if (typeof RTCPeerConnection === 'undefined') {
      resolve({});
      return;
    }

    let srflx: string | null = null;
    const hosts = new Set<string>();
    let pc: RTCPeerConnection | null = null;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      try {
        pc?.close();
      } catch {
        /* ignore */
      }
      const t = () => performance.now() - started;
      const out: Partial<Snapshot> = {};
      if (srflx) out['probe.srflxIp'] = reading('probe.srflxIp', 'probe', srflx, t());
      if (hosts.size > 0) {
        out['probe.hostIps'] = reading('probe.hostIps', 'probe', [...hosts].join(', '), t());
      }
      resolve(out);
    };

    const timer = setTimeout(finish, 4000);

    try {
      pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.cloudflare.com:3478' }],
      });
      pc.onicecandidate = (ev) => {
        if (!ev.candidate?.candidate) return;
        const line = ev.candidate.candidate;
        if (isMdnsHost(line)) return;
        const typ = / typ (\w+)/.exec(line)?.[1] ?? '';
        const ip = extractIp(line);
        if (!ip) return;
        if (typ === 'srflx') srflx = ip;
        if (typ === 'host') hosts.add(ip);
      };
      pc.createDataChannel('');
      pc.createOffer()
        .then((sdp) => pc?.setLocalDescription(sdp))
        .catch(() => {
          clearTimeout(timer);
          finish();
        });
      pc.onicegatheringstatechange = () => {
        if (pc?.iceGatheringState === 'complete') {
          clearTimeout(timer);
          finish();
        }
      };
    } catch {
      clearTimeout(timer);
      finish();
    }
  });
}

export async function collectWhoAmISnapshot(): Promise<Snapshot> {
  const started = performance.now();
  const [api, ipJson, script] = await Promise.all([
    fetchWhoAmIApi(),
    fetchIpNetwork(),
    Promise.resolve(collectScriptReadings(started)),
  ]);

  const snap: Snapshot = { ...script };
  if (api) Object.assign(snap, mapRequest(api, started));
  if (ipJson) Object.assign(snap, mapNetwork(ipJson, started));
  return snap;
}