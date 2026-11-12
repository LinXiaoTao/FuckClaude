export const content = `
<h2>1. Zona horaria y configuración regional en macOS</h2>
<p>Las preferencias del sistema en macOS afectan directamente las huellas del navegador. Configure zona horaria, idioma y región para que coincidan con la región de salida del proxy:</p>

<h3>Configuración de zona horaria</h3>
<pre><code># Check current timezone
sudo systemsetup -gettimezone

# Set timezone to US Eastern
sudo systemsetup -settimezone "America/New_York"

# Alternative: US Pacific
sudo systemsetup -settimezone "America/Los_Angeles"

# UK London
sudo systemsetup -settimezone "Europe/London"

# Singapore
sudo systemsetup -settimezone "Asia/Singapore"

# Verify Intl timezone matches
node -e "console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)"</code></pre>

<h3>Idioma y región</h3>
<ul>
  <li>Abra System Settings → General → Language & Region</li>
  <li>Defina Preferred Language en «English (United States)»</li>
  <li>Defina Region en «United States» (o Reino Unido/SG si usa esos proxies)</li>
  <li>Elimine todas las entradas de idioma chino de la lista de idiomas</li>
  <li>Reinicie el navegador para aplicar los cambios</li>
</ul>

<h2>2. Variables de entorno y registro en Windows</h2>
<p>Windows guarda zona horaria e idioma en claves del registro. Modifíquelos a nivel de sistema para mantener coherencia:</p>

<h3>Configuración de zona horaria en PowerShell</h3>
<pre><code># List available timezones
Get-TimeZone -ListAvailable | Where-Object { $_.Id -like "*Pacific*" }

# Set timezone
Set-TimeZone -Id "Pacific Standard Time"

# Verify
Get-TimeZone

# Alternative zones:
# "Eastern Standard Time" (US East)
# "GMT Standard Time" (UK)
# "Singapore Standard Time" (Singapore)</code></pre>

<h3>Configuración de idioma en el registro</h3>
<pre><code># Set system locale to en-US
Set-WinUserLanguageList -LanguageList en-US -Force

# Remove Chinese input methods
Get-WinUserLanguageList | Where-Object { $_.LanguageTag -notlike "zh-*" } | Set-WinUserLanguageList

# Verify
Get-WinUserLanguageList</code></pre>

<h2>3. Entorno de terminal en Linux y aislamiento de fuentes</h2>
<p>En Linux hace falta configurar manualmente variables de entorno y fuentes para evitar filtración de huellas asociadas al chino:</p>

<h3>Zona horaria y configuración regional</h3>
<pre><code># Set timezone
sudo timedatectl set-timezone America/New_York

# Verify
timedatectl

# Set system locale to en_US.UTF-8
sudo localectl set-locale LANG=en_US.UTF-8

# Add to ~/.bashrc or ~/.zshrc
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export TZ=America/New_York

# Reload shell
source ~/.bashrc</code></pre>

<h3>Aislamiento de fuentes (eliminar fuentes chinas)</h3>
<pre><code># List installed Chinese fonts
fc-list :lang=zh

# Option 1: Temporarily disable Chinese fonts
mkdir -p ~/.config/fontconfig
cat > ~/.config/fontconfig/fonts.conf <<'EOF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <selectfont>
    <rejectfont>
      <pattern>
        <patelt name="family">
          <string>Noto Sans CJK</string>
          <string>WenQuanYi</string>
          <string>AR PL</string>
        </patelt>
      </pattern>
    </rejectfont>
  </selectfont>
</fontconfig>
EOF

# Rebuild font cache
fc-cache -f

# Option 2: Uninstall Chinese font packages (Debian/Ubuntu)
sudo apt remove fonts-wqy-* fonts-arphic-* fonts-noto-cjk</code></pre>

<h2>4. Configuración anti-ban en móviles iOS/Android</h2>
<p>Los dispositivos móviles tienen opciones limitadas, pero los ajustes clave aún pueden reducir el riesgo de huella:</p>

<h3>Configuración en iOS</h3>
<ul>
  <li><strong>Zona horaria:</strong> Settings → General → Date & Time → Set Automatically OFF → Elija la zona horaria que coincida con la región de salida de la VPN</li>
  <li><strong>Idioma:</strong> Settings → General → Language & Region → iPhone Language → English (US)</li>
  <li><strong>VPN:</strong> Use una app VPN con soporte de IP residencial (evite VPN gratuitas). Pruebe la IP en ipinfo.io en Safari.</li>
  <li><strong>Desactivar ubicación:</strong> Settings → Privacy & Security → Location Services → Claude.ai → Never</li>
  <li><strong>Borrar cookies:</strong> Settings → Safari → Advanced → Website Data → Remove All</li>
</ul>

<h3>Configuración en Android</h3>
<ul>
  <li><strong>Zona horaria:</strong> Settings → System → Date & Time → Use network-provided time zone OFF → Seleccione la zona horaria manualmente</li>
  <li><strong>Idioma:</strong> Settings → System → Languages → Add a language → English (United States) → Move to top</li>
  <li><strong>VPN:</strong> Instale una app VPN desde Play Store, confirme que ofrezca IP residencial y verifique en ipinfo.io</li>
  <li><strong>Chrome Flags:</strong> Abra chrome://flags → Busque «WebRTC» → Anonymize local IPs exposed by WebRTC → Enabled</li>
  <li><strong>Borrar datos del sitio:</strong> Chrome → Settings → Privacy → Clear browsing data → All time → Cookies, Cached images</li>
</ul>
`;
