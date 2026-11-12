export default {
  'meta.title': 'Fuck Claude | ¿Es un «usuario de Cuba» de Claude?',
  'meta.description':
    'Compruebe la zona horaria, el idioma, las fuentes regionales y la configuración del navegador para ver si Claude Code le marcaría como usuario de Cuba. Ese escaneo permanece en el navegador. La comprobación separada de pureza de IP envía la IP de salida por /api/ip.',

  'nav.title': 'Fuck Claude',
  'nav.guides': 'Guías anti-bloqueo',
  'nav.news': 'Noticias',
  'nav.extension': 'Extensión',
  'nav.about': 'Acerca de',
  'nav.home': 'Inicio',

  'news.title': 'Últimas noticias de Claude',
  'news.sub':
    'Actualizaciones seleccionadas sobre productos de Claude, cambios en la API, política regional y tendencias de seguridad reportadas por la comunidad.',
  'news.note':
    'Los elementos se seleccionan manualmente a partir de anuncios oficiales de Anthropic e informes de la comunidad. Los enlaces abren fuentes externas.',
  'news.backHome': '← Volver al inicio',
  'news.viewAll': 'Ver todas las noticias',
  'news.source': 'Fuente',

  'community.title': 'Informes de campo anti-bloqueo de la comunidad',
  'community.sub':
    'Consejos reales en X (Twitter) sobre bloqueos de Claude, apelaciones, pagos y Claude Code, con enlaces directos a las publicaciones originales.',
  'community.viewAll': 'Ver todos los informes de campo',
  'community.takeaway': 'Conclusión:',
  'community.viewOnX': 'Ver el original en X (Twitter)',
  'community.externalHint': 'Abre un enlace externo en una nueva pestaña',

  credit: 'Desarrollado con Claude Fable 5',

  'guides.title': 'Base de conocimientos de seguridad y anti-bloqueo de Claude',
  'guides.sub':
    'Primero un resumen de las reglas publicadas por Anthropic; luego guías en profundidad sobre mecanismos de riesgo, limpieza del entorno, seguridad de pagos, seguridad de la API y procedimientos de apelación.',
  'guides.readMore': 'Leer guía',
  'guides.back': '← Volver a la base de conocimientos',
  'guides.backHome': '← Volver al inicio',
  'guides.editorial':
    'Escrito y mantenido por LinXiaoTao, un desarrollador independiente. Las guías se actualizan cuando surgen nuevos hallazgos de ingeniería inversa e informes de la comunidad. Esta base es educativa y de referencia; no es documentación oficial de Anthropic.',
  'guides.intro':
    'Esta base recopila lo que se sabe públicamente sobre cómo Claude Code identifica huellas de usuario y cómo ocurren los bloqueos: desde la esteganografía Unicode y el modelo de riesgo en capas de Anthropic hasta la limpieza del entorno, la seguridad de la cuenta y los pagos, y qué hacer cuando una cuenta queda marcada. Las afirmaciones sobre las reglas de Anthropic enlazan a páginas oficiales y llevan fecha de verificación. Todo lo demás proviene de informes de la comunidad e ingeniería inversa pública y se etiqueta como tal. Cada artículo es bilingüe y puede leerse solo o como parte de una ruta a continuación.',
  'guides.paths.title': 'Por dónde empezar',
  'guides.paths.sub': '¿No sabe qué artículo abrir primero? Elija la ruta que coincida con su situación.',
  'guides.path0.title': '0 · Lista rápida anti-bloqueo',
  'guides.path0.desc':
    '¿Necesita lo esencial rápido? Seguridad de la cuenta, límites de la API y reglas de frecuencia en una guía breve.',
  'guides.path0.cta': 'Abrir la lista de verificación',
  'guides.path1.title': '1 · Entender el riesgo',
  'guides.path1.desc':
    '¿Es nuevo aquí? Empiece por cómo funcionan la huella digital y el modelo de riesgo de 4 capas antes de cambiar nada.',
  'guides.path1.cta': 'Leer el modelo de riesgo',
  'guides.path2.title': '2 · Limpiar el entorno',
  'guides.path2.desc':
    'Sincronice la zona horaria, aísle las fuentes chinas, detenga fugas de WebRTC y configure una IP residencial correctamente.',
  'guides.path2.cta': 'Limpiar la configuración',
  'guides.path3.title': '3 · Registrarse y pagar con seguridad',
  'guides.path3.desc':
    'Elija un número de verificación, use un tipo de tarjeta que Claude acepte y alinee los datos de facturación con la tarjeta antes de suscribirse.',
  'guides.path3.cta': 'Registrarse de forma segura',
  'guides.path4.title': '4 · Usar Claude Code y la API con seguridad',
  'guides.path4.desc':
    'Mantenga coherentes la CLI y el navegador, elija relays que preserven el Prompt Cache y respete los límites de tasa de uso.',
  'guides.path4.cta': 'Configurar Claude Code',
  'guides.path5.title': '5 · Recuperar una cuenta bloqueada',
  'guides.path5.desc':
    '¿Ya está marcado? Diagnostique el tipo de bloqueo, envíe una apelación en inglés basada en hechos o cambie a un modelo alternativo.',
  'guides.path5.cta': 'Iniciar recuperación',
  'guides.related': 'Lectura relacionada',
  'guides.allGuides': 'Explorar todas las guías',
  'guides.catalog.title': 'Todas las guías por tema',
  'guides.catalog.nav': 'Ir a un tema',
  'guides.readTime': '{n} min de lectura',
  'guides.toc': 'En esta página',
  'guides.compliance':
    'Contenido educativo y de diagnóstico: explica cómo funcionan las señales de riesgo para que pueda entender y depurar su propia configuración. No es un consejo para infringir reglas. Siga la Política de uso y los Términos de servicio de Anthropic y las leyes de su país; si su región no está admitida, use una alternativa disponible oficialmente.',
  'guides.sources': 'Fuentes',
  'guides.verified': 'Datos oficiales verificados el {date}.',
  'guides.unverified':
    'Basado en informes de la comunidad e ingeniería inversa pública. No contrastado punto por punto con la documentación de Anthropic; confirme los detalles importantes en el Centro de ayuda oficial.',
  'guides.tableLabel': 'Tabla con desplazamiento',
  'guides.news.title': 'Actualizaciones de política y control de riesgos',
  'guides.news.sub': 'Cambios recientes de región, política y aplicación que afectan a las cuentas.',

  'rules.title': 'Reglas oficiales en un vistazo',
  'rules.sub':
    'Lo que Anthropic declara públicamente. Última verificación el {date}. El resto de estas guías es experiencia de la comunidad o ingeniería inversa y se etiqueta como tal.',
  'rules.source': 'Fuente',

  'community.relatedGuide': 'Guía relacionada',

  'hero.title': '¿Es un «usuario de Cuba» de Claude?',
  'hero.badge.local': 'El escaneo del usuario cubano permanece local',
  'hero.badge.noUpload': 'La puntuación del usuario cubano permanece en el dispositivo',
  'hero.badge.openSource': 'Código abierto',
  'hero.scoreOutOf': '/ 100',

  'sponsors.label': 'Patrocinado',
  'sponsors.cta': '¿Quiere aparecer aquí?',

  'result.sponsor.brand': 'CDND · CODE NEVER DIE',
  'result.sponsor.title': '¿{score}? Deje de forzar; cambie a acceso directo puro a Claude',
  'result.sponsor.sub':
    '100 % passthrough oficial · Potencia completa, cero inyección · Conexión directa nacional, concurrencia ilimitada · ~28 % del precio de lista',
  'result.sponsor.cta': 'Conectar ahora →',
  'result.sponsor.badge': 'Patrocinador',

  'cnModels.label': 'Modelos de IA chinos',
  'cnModels.slogan': 'Los modelos chinos simplemente son mejores',

  'band.low.title': 'Riesgo bajo',
  'band.low.desc': '🐶No es un «usuario de Cuba» de Claude🐶',
  'band.medium.title': 'Riesgo medio',
  'band.medium.desc': '🐶Probablemente es un «usuario de Cuba» de Claude🐶',
  'band.high.title': 'Riesgo alto',
  'band.high.desc': '🐶Definitivamente es un «usuario de Cuba» de Claude🐶',
  'band.high.extra': 'Pero aún tiene',
  'band.high.extraSep': ', ',
  'band.high.extraSepLast': ' y ',

  'signal.timezone.name': 'Zona horaria del sistema',
  'signal.timezone.desc':
    'Intl.DateTimeFormat expone la misma zona horaria del SO que lee Claude Code; se compara con Asia/Shanghai, Asia/Urumqi y otras zonas de China.',
  'signal.language.name': 'Idioma del navegador',
  'signal.language.desc':
    'navigator.languages: zh-CN / chino simplificado al inicio de la lista obtiene la puntuación más alta.',
  'signal.fonts.name': 'Fuentes regionales instaladas',
  'signal.fonts.desc':
    'Sondeo por ancho en canvas de fuentes simplificadas o tradicionales como Microsoft YaHei y PingFang SC.',
  'signal.vendorFonts.name': 'Fuentes de fabricantes locales',
  'signal.vendorFonts.desc':
    'Sondeo en canvas de fuentes de fabricantes o software del entorno: MiSans, HarmonyOS Sans, OPPO Sans, caras WPS Founder. Cualquier coincidencia es una señal fuerte.',
  'signal.cnBrowser.name': 'Navegador local / WebView',
  'signal.cnBrowser.desc':
    'User agent y marcas UA-CH comparados con WeChat, QQ, Quark, UC, Baidu y otros navegadores locales o WebViews en aplicaciones.',
  'signal.deviceVendor.name': 'Dispositivo de marca local',
  'signal.deviceVendor.desc':
    'Modelo de dispositivo UA-CH (navigator.userAgentData) y UA comparados con HarmonyOS, Huawei, Xiaomi, OPPO, vivo y otras marcas de hardware locales.',
  'signal.intlLocale.name': 'Configuración regional Intl',
  'signal.intlLocale.desc': 'La configuración regional que el navegador resuelve para formato de fecha y números.',
  'signal.timezoneOffset.name': 'Desplazamiento de zona horaria',
  'signal.timezoneOffset.desc': 'Si getTimezoneOffset() es igual a UTC+8.',
  'signal.webrtcLeak.name': 'Fuga de IP por WebRTC',
  'signal.webrtcLeak.desc':
    'Sondeo con RTCPeerConnection de fugas de candidatos IP local o pública real mediante STUN.',
  'signal.emoji.name': 'Estilo de renderizado de emoji',
  'signal.emoji.desc':
    'Fabricante del SO inferido del user agent; señal débil y poco correlacionada.',

  'scan.detecting': 'Comprobando',
  'scan.ready': 'Listo para escanear',
  'result.hitsTitle': 'Señales coincidentes',
  'result.noHits': 'No coincidieron señales fuertes de Cuba. Riesgo bajo.',

  'signals.title': 'Qué se escanea',
  'signals.sub': 'Diez huellas de configuración regional y red, ponderadas a una puntuación de riesgo de 0–100.',
  'tools.title': 'Herramientas de código abierto relacionadas',
  'tools.cageName': 'Claude Cage',
  'tools.cageBody':
    'Un escritorio comunitario independiente en máquina virtual para comprobaciones de red, zona horaria y aislamiento.',
  'tools.cageCta': 'Ver proyecto',
  'tools.cageNote': 'No es un proyecto oficial y no garantiza que una cuenta permanezca sin restricciones.',

  'how.title': 'Cómo funciona la comprobación',
  'how.p1':
    'Cuando Claude Code apunta a un endpoint de proxy mediante ANTHROPIC_BASE_URL, informes públicos de ingeniería inversa indican que lee la zona horaria del sistema operativo y el hostname del proxy, y oculta el veredicto en el system prompt con esteganografía Unicode: el separador de fecha y cuatro apóstrofos casi idénticos en la línea «Today’s date» codifican si parece un usuario de China.',
  'how.p2':
    'Una página web no puede leer todo lo que Claude Code puede, pero la señal clave es idéntica: esta herramienta lee la misma zona horaria del SO y suma nueve huellas más visibles en el navegador (idioma de la UI, fuentes chinas, fuentes de fabricantes chinos, fugas de IP por WebRTC, navegadores chinos, marca del dispositivo, configuración Intl, desplazamiento UTC+8 y estilo de emoji) en una puntuación ponderada. Las señales con ≥0,25 cuentan como aciertos; bandas: Bajo 0–30, Medio 31–60, Alto 61–100.',
  'ui.weight': 'Peso',

  'why.title': 'Por qué Claude le marca como «usuario de China»',
  'why.p1':
    'Anthropic no vende Claude en China continental, y se ha reportado que Claude Code trata el tráfico que «parece chino» como de mayor riesgo. El juicio no es un único interruptor: apila varias señales débiles en una probabilidad. La zona horaria del sistema es la señal individual más pesada porque viaja con cada solicitud y es difícil falsificarla por accidente, pero idioma, fuentes, marca del dispositivo y red suman peso además.',
  'why.p2':
    'La razón por la que todo el entorno del navegador filtra tanto es que la configuración regional se filtra en todo: la zona horaria del SO impulsa Intl y Date, la preferencia de idioma fija navigator.languages y la cabecera Accept-Language, y las fuentes del SO pueden sondearse píxel a píxel en un canvas. Si además se enruta Claude Code por un proxy, el hostname del proxy es otra señal: informes de ingeniería inversa encontraron el veredicto codificado de forma esteganográfica en la línea «Today’s date» del system prompt.',
  'why.p3':
    'Ninguna de estas señales es decisiva por sí sola, que es exactamente por qué el riesgo es acumulativo. Una zona horaria de EE. UU. con un paquete de fuentes chinas y un WebView de WeChat sigue leyéndose como sospechoso. La esteganografía y el modelo de riesgo completo se detallan en la',
  'why.link1': 'guía de esteganografía y modelo de riesgo de 4 capas',
  'why.p3b': ', y las correcciones prácticas están en la',
  'why.link2': 'guía de limpieza del entorno e IP residencial',
  'why.p3c': '.',

  'reduce.title': 'Cómo reducir la puntuación de riesgo',
  'reduce.sub':
    'Una lista ordenada breve. Cada paso corresponde directamente a una de las señales ponderadas anteriores; empiece por arriba, porque zona horaria e idioma llevan más peso.',
  'reduce.s1':
    'Configure la zona horaria del SO en una zona fuera de China (por ejemplo America/New_York o Europe/London) y confirme que getTimezoneOffset() ya no sea UTC+8. En los informes de ingeniería inversa esta es la señal que se dice que Claude Code lee directamente, por eso tiene el mayor peso en esta puntuación.',
  'reduce.s2':
    'Quite zh-CN / zh-Hans del inicio de la lista de idiomas del navegador y del SO para que navigator.languages y Accept-Language encabecen con inglés u otra configuración regional no china.',
  'reduce.s3':
    'Aísle fuentes chinas y de fabricante (Microsoft YaHei, PingFang SC, MiSans, HarmonyOS Sans): use un perfil limpio del navegador o un navegador anti-detección para que el sondeo de fuentes en canvas no encuentre nada claramente chino.',
  'reduce.s4':
    'Bloquee fugas de IP por WebRTC y enrute por una IP residencial en lugar de una de datacenter, para que la red y la geografía reales no anulen un perfil por lo demás limpio.',
  'reduce.s5':
    'Al usar Claude Code mediante un relay, mantenga el hostname de ANTHROPIC_BASE_URL neutro: evite dominios con palabras clave marcadas o nombres de laboratorios de IA, y sobrescriba la variable de entorno TZ si la máquina anfitriona está en China.',
  'reduce.cta': 'Los recorridos paso a paso completos están en la',
  'reduce.ctaLink': 'base de conocimientos de guías anti-bloqueo',

  'faq.title': 'Preguntas frecuentes',
  'faq.q1': '¿Claude realmente comprueba mi zona horaria?',
  'faq.a1':
    'Según informes públicos de ingeniería inversa, cuando Claude Code habla con un endpoint no oficial lee la zona horaria del SO y el hostname del proxy, y codifica el resultado de forma esteganográfica en su system prompt. La zona horaria que esta página lee mediante Intl.DateTimeFormat es exactamente la misma del SO.',
  'faq.q2': '¿Esta puntuación es la comprobación exacta que ejecuta Claude?',
  'faq.a2':
    'No. Solo la zona horaria del sistema se corresponde uno a uno con el mecanismo reportado de Claude. Las otras nueve señales son huellas habituales de entorno chino o de red que correlacionan con él; trate la puntuación como una estimación, no como un veredicto.',
  'faq.q3': '¿Cómo reduzco mi puntuación?',
  'faq.a3':
    'Cambie la zona horaria del SO fuera de zonas de China como Asia/Shanghai, quite zh-CN del inicio de la lista de idiomas del navegador, bloquee fugas de WebRTC y evite enrutar Claude Code por proxies cuyos hostnames contengan dominios marcados o palabras clave de laboratorios de IA. La lista «Cómo reducir la puntuación de riesgo» anterior lo recorre en orden.',
  'faq.q4': '¿Se suben datos?',
  'faq.a4':
    'El escaneo del usuario cubano se ejecuta en el navegador y esas señales no se suben. La comprobación separada de pureza de IP (tarjeta de inicio y /ip) envía la IP de salida al endpoint /api/ip, que consulta proxycheck.io, AbuseIPDB e ipwho.is. Esa puntuación nunca se fusiona con la de usuario cubano. El sitio también carga Google Analytics para estadísticas anónimas de visitas y Google AdSense para publicidad (los anuncios pueden usar cookies). La detección de fugas WebRTC puede contactar brevemente un servidor STUN público para recopilar candidatos ICE.',
  'faq.q5': '¿Una puntuación baja garantiza que no habrá bloqueo?',
  'faq.a5':
    'No hay garantía. La puntuación del usuario cubano de esta herramienta solo mide huellas visibles en el navegador. El modelo de riesgo real de Anthropic también pesa la reputación de la IP, el BIN de la tarjeta de pago, la antigüedad de la cuenta y los patrones de uso. Una puntuación baja elimina señales locales obvias, pero una IP de datacenter o una tarjeta virtual de alto riesgo pueden seguir marcando una cuenta. La tarjeta de pureza de IP es una heurística separada para la pregunta de salida y no cambia esta puntuación.',
  'faq.q6': '¿Usar esta herramienta o las guías infringe los términos de Anthropic?',
  'faq.a6':
    'El escáner solo lee el propio navegador e informa lo que ve; nada de eso infringe términos. Las guías son material educativo de referencia sobre cómo funciona la huella digital. Es responsable del uso de Claude y de cumplir las políticas de Anthropic y las leyes locales. Tenga en cuenta que el Centro de ayuda de Anthropic enumera crear una cuenta desde una ubicación no admitida como motivo de bloqueo; ningún ajuste del navegador hace elegible una cuenta no elegible.',
  'faq.q7': '¿Por qué importa más la zona horaria que mi dirección IP?',
  'faq.a7':
    'Porque la zona horaria del SO se lee en el cliente y viaja en la solicitud de una forma que los informes de ingeniería inversa vincularon directamente al veredicto codificado. Una VPN cambia la IP pero suele dejar intacta la zona horaria del SO, que es la razón más habitual por la que una configuración de VPN «limpia» sigue puntuando alto aquí.',
  'faq.q8': 'El resultado de la API difiere del escaneo en el navegador; ¿por qué?',
  'faq.a8':
    'El endpoint curl en /api/check se ejecuta en el servidor, así que solo ve lo que expone la solicitud: zona horaria geo de Vercel, país, Accept-Language y User-Agent. No puede sondear fuentes, configuración Intl ni fugas WebRTC, por lo que puntúa aproximadamente 62/100 del peso total y lo normaliza a 0–100. El escaneo en el navegador lee el SO real y es el panorama más completo.',
  'faq.q9': 'Mi cuenta ya está bloqueada; ¿qué hago ahora?',
  'faq.a9':
    'Primero identifique el tipo de bloqueo (bloqueo de IP, reembolso forzado o cuenta totalmente deshabilitada), porque cada uno tiene un camino distinto. La guía de diagnóstico de bloqueo y SOP de apelación en inglés explica cómo distinguirlos e incluye plantillas de correo de apelación; si la recuperación no es realista, la guía de conmutación a modelos alternativos nacionales y de código abierto cubre el cambio con mínima interrupción. El formulario oficial de apelación se alcanza iniciando sesión en claude.ai con la cuenta bloqueada.',

  'privacy.title': 'Privacidad',
  'privacy.body':
    'El escaneo del usuario cubano se ejecuta en el navegador; esos resultados permanecen en el dispositivo. La comprobación separada de pureza de IP envía la IP de salida a /api/ip, que consulta fuentes de reputación de terceros, y esa puntuación no se fusiona con la de usuario cubano. El sitio carga Google Analytics para estadísticas anónimas de visitas y Google AdSense para anuncios. La detección de fugas WebRTC puede contactar brevemente un servidor STUN público.',
  'privacy.fullPolicy': 'Política de privacidad completa →',

  'author.by': 'Escrito por',
  'author.updated': 'Actualizado:',

  'trust.privacy.title': 'Política de privacidad',
  'trust.privacy.description':
    'Cómo Fuck Claude maneja el escaneo local de usuario cubano, la comprobación de pureza de IP, Google Analytics, Google AdSense y el sondeo STUN de WebRTC.',
  'trust.terms.title': 'Términos de servicio',
  'trust.terms.description':
    'Términos y condiciones que rigen el uso educativo y técnico de Fuck Claude.',
  'trust.about.title': 'Acerca de',
  'trust.about.description':
    'Quién opera Fuck Claude, por qué existe, estándares editoriales y su relación con Anthropic.',
  'trust.contact.title': 'Contacto',
  'trust.navTitle': 'Confianza y políticas',
  'trust.contact.description':
    'Contacte a LinXiaoTao por correo electrónico o GitHub Issues para informes de errores, correcciones de guías, solicitudes de privacidad y consultas de patrocinio.',

  'social.x': 'X (Twitter)',
  'social.xiaohongshu': 'Xiaohongshu (RED)',
  'social.douyin': 'Douyin',
  'social.jike': 'Jike',
  'social.scan': 'Escanee con la aplicación o haga clic para abrir',

  'footer.disclaimer':
    'Solo como referencia, basado en informes públicos de ingeniería inversa. No es una declaración ni consejo oficial.',
  'footer.license':
    'Código abierto bajo la licencia MIT: las redistribuciones deben conservar el aviso original del proyecto.',
  'footer.repo': 'Proyecto original',
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos',
  'footer.about': 'Acerca de',
  'footer.contact': 'Contacto',
  'footer.ip': 'Pureza de IP',

  'share.label': 'Comparta su resultado',
  'share.native': 'Compartir',
  'share.copy': 'Copiar enlace',
  'share.copied': '¡Copiado!',
  'share.save': 'Guardar imagen del resultado',
  'share.saved': '¡Guardado!',
  'share.text':
    'Obtuve {score}/100 en la prueba «¿Soy un usuario de Cuba de Claude?» — ¡{verdict}! 🐶 Compruebe el suyo:',
  'share.to.x': 'Compartir en X',
  'share.to.weibo': 'Compartir en Weibo',
  'share.to.telegram': 'Compartir en Telegram',
  'share.to.facebook': 'Compartir en Facebook',
  'share.to.linkedin': 'Compartir en LinkedIn',
  'share.to.reddit': 'Compartir en Reddit',

  'api.title': 'También disponible con curl',
  'api.desc':
    '¿Prefiere la terminal? Use el endpoint siguiente: estima el riesgo a partir de la geo de su IP y las cabeceras de la solicitud, y responde en el idioma de la cabecera Accept-Language.',
  'api.ex1': '# Informe de texto: sigue Accept-Language',
  'api.ex2': '# Forzar idioma mediante cabecera',
  'api.ex3': '# Salida JSON',

  'ip.meta.title': 'Pureza de IP',
  'ip.meta.description':
    'Puntuación de pureza independiente de 0–100 para la IP de salida, desde proxycheck.io, AbuseIPDB e ipwho.is. Más alto significa más parecido a residencial. No forma parte de la puntuación del usuario cubano ni es una garantía de Claude.',
  'ip.title': 'Pureza de IP',
  'ip.lead':
    'Esta página puntúa la IP de salida de esta visita. Más alto significa más limpia y parecida a residencial. Es una heurística para los modelos de riesgo de cuentas de Claude, no una comprobación de Anthropic, y nunca se fusiona con la puntuación del usuario cubano.',
  'ip.separate': 'Separada de la puntuación del usuario cubano. Los dos números nunca se combinan.',
  'ip.waitScan': 'Se comprueba al pulsar Iniciar escaneo; no forma parte de la puntuación superior.',
  'ip.loading': 'Comprobando la IP de salida de esta visita…',
  'ip.error': 'La comprobación de pureza de IP falló.',
  'ip.rateLimited': 'Demasiadas comprobaciones desde esta IP. Espere un minuto e inténtelo de nuevo.',
  'ip.retry': 'Intentar de nuevo',
  'ip.scoreLabel': 'Pureza',
  'ip.scoreUnknown': '—',
  'ip.outOf': '/ 100',
  'ip.band.high': 'Alto',
  'ip.band.medium': 'Medio',
  'ip.band.low': 'Bajo',
  'ip.type.Residential': 'Residencial',
  'ip.type.Datacenter': 'Datacenter',
  'ip.type.Business': 'Empresarial',
  'ip.type.Unknown': 'Desconocido',
  'ip.flag.proxy': 'Proxy',
  'ip.flag.vpn': 'VPN',
  'ip.flag.tor': 'Tor',
  'ip.flag.datacenter': 'Datacenter',
  'ip.flag.abusive': 'Abusivo',
  'ip.flag.yes': 'Sí',
  'ip.flag.no': 'No',
  'ip.flag.unknown': 'Desconocido',
  'ip.yourIp': 'IP de salida',
  'ip.geo': 'Ubicación',
  'ip.network': 'Red',
  'ip.deductions': 'Por qué esta puntuación',
  'ip.noDeductions':
    'Sin descuentos. Una puntuación ausente significa que la comprobación se negó a adivinar, no que la IP esté limpia.',
  'ip.sources': 'Fuentes',
  'ip.source.proxycheck': 'proxycheck.io',
  'ip.source.abuseipdb': 'AbuseIPDB',
  'ip.source.ipwho': 'ipwho.is',
  'ip.source.ok': 'Respondió',
  'ip.source.unavailable': 'No disponible',
  'ip.source.unconfigured': 'No configurado',
  'ip.source.error': 'Error',
  'ip.source.ipwhoNote': 'Solo geo',
  'ip.details': 'Desglose completo',
  'ip.cta.extension': 'Extensión de configuración regional',
  'ip.cta.guide': 'Entorno y configuración de IP',
  'ip.disclaimer': 'No oficial y sin garantía de pasar Claude.',
  'ip.deduction.datacenter': 'Red de datacenter o hosting',
  'ip.deduction.business': 'Red empresarial u otra no residencial',
  'ip.deduction.proxy': 'Proxy',
  'ip.deduction.vpn': 'VPN',
  'ip.deduction.proxy_vpn': 'Proxy y VPN',
  'ip.deduction.tor': 'Salida Tor',
  'ip.deduction.abuse': 'Confianza de AbuseIPDB',
  'ip.deduction.abuser': 'Listado como abusador',
  'ip.deduction.proxycheck_risk': 'riesgo de proxycheck',
  'ip.deduction.conflict': 'Las fuentes no coinciden; se conserva la lectura de mayor riesgo',

  'ui.claudeBadge': 'Igual que Claude',
  'ui.retest': 'Escanear de nuevo',
  'ui.start': 'Iniciar escaneo',
  'ui.scanning': 'Escaneando…',

  'ext.title': 'Control de configuración regional del sitio',
  'ext.description':
    'En los sitios que elija, esta extensión presenta la zona horaria, el idioma, la configuración regional Intl, el user agent, las métricas de fuentes y los candidatos WebRTC como la región seleccionada. No cambia la dirección IP, no sube datos y no tiene analíticas. Aún no está en Chrome Web Store; cargue la carpeta sin empaquetar en modo desarrollador.',
  'ext.versionLabel': 'Versión',
  'ext.download': 'Descargar',
  'ext.downloadWithSize': 'Descargar ({size})',
  'ext.installTitle': 'Instalación',
  'ext.step1': 'Descargue el zip y descomprímalo. La carpeta debe contener manifest.json directamente.',
  'ext.step2': 'Abra chrome://extensions.',
  'ext.step3': 'Active el modo Desarrollador en la esquina superior derecha.',
  'ext.step4': 'Haga clic en Cargar sin empaquetar y seleccione la carpeta descomprimida.',
  'ext.step5': 'Haga clic en el icono de la barra, permita el sitio en la ventana emergente y elija Aplicar recomendado.',
  'ext.step6': 'Vuelva a la página de comprobación de este sitio y ejecute la comprobación.',
  'ext.checkCta': 'Abrir la página de comprobación',
  'ext.updateTitle': 'Actualización',
  'ext.update':
    'Tras descargar una nueva versión, reemplace la carpeta sin empaquetar y abra chrome://extensions y haga clic en Recargar.',
  'ext.featuresTitle': 'Qué cambia',
  'ext.f1': 'Zona horaria y desplazamiento UTC que reportan Date e Intl.DateTimeFormat.',
  'ext.f2': 'navigator.language / navigator.languages y la configuración regional Intl predeterminada.',
  'ext.f3': 'Opcional: cadena de user agent de Chrome de escritorio para la región seleccionada.',
  'ext.f4':
    'Opcional: métricas de fuentes, para que las fuentes del sistema específicas de la configuración regional no se expongan mediante métricas de texto.',
  'ext.f5':
    'Opcional: candidatos ICE de WebRTC visibles para la página, para no listar direcciones locales.',
  'ext.f6':
    'No cambia el reloj del sistema operativo, la dirección IP ni nada fuera de los sitios que permita.',
  'ext.privacyTitle': 'Permisos y privacidad',
  'ext.p1':
    'Los permisos requeridos son solo storage, scripting y declarativeNetRequestWithHostAccess. La compilación de release no solicita permisos de host en el momento de la instalación.',
  'ext.p2':
    'El acceso a sitios se solicita por sitio desde la ventana emergente, solo para los sitios que agregue. La política WebRTC del navegador usa el permiso opcional privacy y se pide por separado.',
  'ext.p3':
    'La configuración permanece en chrome.storage en el dispositivo. La extensión no envía solicitudes de red propias, no tiene analíticas y no sube nada.',
  'ext.p4': 'El código fuente está abierto en GitHub en la carpeta extension/ del repositorio del proyecto.',
  'ext.useTitle': 'Uso responsable',
  'ext.use':
    'Site Locale Control es una herramienta de diagnóstico y privacidad para comprobar qué puede leer una página web sobre la configuración regional del navegador. No oculta la ubicación de red y no es un medio para eludir las reglas de ningún servicio. Siga los Términos de servicio de cada sitio en el que la use.',
  'ext.faqTitle': 'Preguntas frecuentes',
  'ext.q1': '¿Por qué no está en Chrome Web Store?',
  'ext.a1':
    'Aún no se ha enviado. Hasta entonces, instale la carpeta sin empaquetar en modo desarrollador. Chrome puede mostrar un recordatorio de modo desarrollador al iniciar; es esperable.',
  'ext.q2': 'Los cambios no se aplicaron. ¿Qué conviene revisar?',
  'ext.a2':
    'Asegúrese de que el interruptor en la ventana emergente esté activado y el sitio permitido, luego recargue la pestaña. La extensión no recarga páginas automáticamente.',
  'ext.q3': '¿Qué navegadores están admitidos?',
  'ext.a3':
    'Chrome de escritorio con Manifest V3. Otros navegadores Chromium que cargan extensiones sin empaquetar suelen funcionar pero no están probados.',
  'ext.q4': '¿Cómo se desinstala?',
  'ext.a4':
    'Abra chrome://extensions y haga clic en Quitar en Site Locale Control. La configuración guardada se elimina con la extensión.',

  'banner.prompt':
    'Elija otro idioma para ver contenido adaptado a la preferencia de idioma del navegador.',
  'banner.continue': 'Continuar',
  'banner.dismiss': 'Cerrar',

  'i18n.notice':
    'Esta página se muestra en traducción automática o en inglés de respaldo. La versión en inglés es la autoritativa.',
  'i18n.noticeLink': 'Ver versión en inglés',
  'lang.toggleLabel': 'Idioma del sitio',
  'share.cardFooter': 'Mida el suyo en fuck-claude.vercel.app',
} satisfies Record<string, string>;
