/** Standalone privacy note for the who-am-i page. Wired by the lead into resolve.ts later. */
export const PRIVACY_WHOAMI_SECTION: { en: string; zh: string } = {
  en: `
<h2>Who am I page</h2>
<p>The <a href="/who-am-i/">Who am I</a> page computes readings in your browser. Those values are shown on the page and are not uploaded to our servers. The page calls <code>/api/whoami</code>, which echoes allowed request headers and Vercel geo headers back in the JSON response. That endpoint does not store responses. The page also calls <code>/api/ip</code> for network reputation fields. When you click to run the WebRTC probe, your browser contacts the public STUN server <code>stun:stun.cloudflare.com:3478</code>, which can see your IP address during ICE gathering.</p>
`.trim(),
  zh: `
<h2>网站眼里的你页面</h2>
<p><a href="/zh/who-am-i/">网站眼里的你</a> 页面在浏览器中计算各项读数。这些值只用于页面展示，不会上传到我们的服务器。页面会请求 <code>/api/whoami</code>，该接口在 JSON 里回显允许的请求头与 Vercel 地理请求头，不会保存响应。页面还会请求 <code>/api/ip</code> 以获取网络信誉字段。当你点击运行 WebRTC 探测时，浏览器会连接公共 STUN 服务器 <code>stun:stun.cloudflare.com:3478</code>，在 ICE 收集过程中该服务器能看到你的 IP 地址。</p>
`.trim(),
};