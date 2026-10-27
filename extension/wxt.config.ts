import { defineConfig } from 'wxt';

const e2e = process.env.SLC_E2E === '1';

export default defineConfig({
  outDir: e2e ? '.output-e2e' : '.output',
  vite: () => ({
    define: {
      __SLC_E2E__: JSON.stringify(e2e),
    },
    build: {
      sourcemap: false,
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
  }),
  manifest: {
    name: '__MSG_extName__',
    description: '__MSG_extDesc__',
    default_locale: 'en',
    permissions: [
      'storage',
      'scripting',
      'declarativeNetRequestWithHostAccess',
      ...(e2e ? ['privacy'] : []),
    ],
    optional_permissions: ['privacy'],
    optional_host_permissions: [
      'https://claude.ai/*',
      'https://*.claude.ai/*',
      'https://claude.com/*',
      'https://*.claude.com/*',
      'https://fuck-claude.vercel.app/*',
      'https://*/*',
    ],
    icons: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png',
    },
    ...(e2e ? { host_permissions: ['http://localhost/*', 'http://127.0.0.1/*'] } : {}),
    action: {
      default_title: '__MSG_extAction__',
      default_popup: 'popup.html',
      default_icon: {
        16: 'icons/icon-16.png',
        32: 'icons/icon-32.png',
        48: 'icons/icon-48.png',
      },
    },
  },
});
