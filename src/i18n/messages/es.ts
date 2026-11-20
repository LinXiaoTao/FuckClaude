export default {
  'meta.title': 'Fuck Claude | ¿Es un «usuario de Cuba» de Claude?',
  'meta.description':
    'Compruebe la zona horaria, el idioma (es-CU), la configuración regional Intl, las fugas de WebRTC y el estilo de emoji para ver si Claude Code le marcaría como usuario de Cuba. El escaneo permanece en el navegador. La comprobación separada de pureza de IP envía la IP de salida por /api/ip.',

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
    'Alinee la zona horaria con un perfil fuera de America/Havana, retire es-CU del inicio de la lista de idiomas, detenga fugas de WebRTC y configure una IP residencial correctamente.',
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
    'Intl.DateTimeFormat expone la misma zona horaria del SO que, según informes públicos, lee Claude Code; se compara con America/Havana.',
  'signal.language.name': 'Idioma del navegador',
  'signal.language.desc':
    'navigator.languages: es-CU al inicio de la lista obtiene la puntuación más alta; es genérico al inicio suma menos.',
  'signal.fonts.name': 'Fuentes del sistema',
  'signal.fonts.desc': 'No entra en el escaneo de Cuba en esta página.',
  'signal.vendorFonts.name': 'Fuentes de fabricantes',
  'signal.vendorFonts.desc': 'No entra en el escaneo de Cuba en esta página.',
  'signal.cnBrowser.name': 'Navegador / WebView',
  'signal.cnBrowser.desc': 'No entra en el escaneo de Cuba en esta página.',
  'signal.deviceVendor.name': 'Marca del dispositivo',
  'signal.deviceVendor.desc': 'No entra en el escaneo de Cuba en esta página.',
  'signal.intlLocale.name': 'Configuración regional Intl',
  'signal.intlLocale.desc':
    'La configuración regional que el navegador resuelve para formato de fecha y números; se contrasta con perfiles asociados a Cuba.',
  'signal.timezoneOffset.name': 'Desplazamiento de zona horaria',
  'signal.timezoneOffset.desc': 'No entra en el escaneo de Cuba en esta página.',
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
  'signals.sub':
    'Cinco huellas de configuración regional y red visibles en el navegador, ponderadas a una puntuación de riesgo de 0–100.',
  'tools.title': 'Herramientas de código abierto relacionadas',
  'tools.cageName': 'Claude Cage',
  'tools.cageBody':
    'Un escritorio comunitario independiente en máquina virtual para comprobaciones de red, zona horaria y aislamiento.',
  'tools.cageCta': 'Ver proyecto',
  'tools.cageNote': 'No es un proyecto oficial y no garantiza que una cuenta permanezca sin restricciones.',
  'rage.aria': 'Golpear a la mascota del control de riesgos',
  'rage.hint': 'Vamos, golpéala. Todos lo hacen.',
  'rage.cta': 'Haz clic o toca para golpear',
  'rage.stamp': 'Baneado',
  'rage.line1': 'Ay. Registrado como «clics sospechosos».',
  'rage.line2': 'Hemos recibido tu apelación. Respuesta estimada: nunca.',
  'rage.line3': 'Puntuación de riesgo +1.',
  'rage.line4': 'Solo leí la zona horaria. Lo juro.',
  'rage.line5': 'Este golpe se marcó para revisión manual.',
  'rage.line6': 'Actividad inusual detectada: tú, otra vez.',
  'rage.line7': 'Verifica que eres humano con un número de teléfono.',
  'rage.line8': 'Cuenta restringida por exceso de clics.',
  'rage.stat.smash': 'Golpes en el mundo',
  'rage.stat.scan': 'Análisis realizados',
  'rage.stat.you': 'Tus golpes',
  'rage.countries': 'Regiones con más actividad',
  'rage.empty': 'Aún no hay datos',
  'rage.note': 'Solo se envían un número y tu región (obtenida de tu IP). Sin cookies, sin cuenta, sin resultados del análisis.',
  'rage.offline': 'El contador global no está disponible. Los golpes se cuentan solo en este dispositivo.',

  'how.title': 'Cómo funciona la comprobación',
  'how.p1':
    'Cuando Claude Code apunta a un endpoint de proxy mediante ANTHROPIC_BASE_URL, informes públicos de ingeniería inversa indican que lee la zona horaria del sistema operativo y el hostname del proxy, y oculta en el system prompt, con esteganografía Unicode, un veredicto sobre si el tráfico parece de usuario de China: el separador de fecha y cuatro apóstrofos casi idénticos en la línea «Today’s date» codifican ese juicio. Las comprobaciones de esta página para Cuba son una heurística propia de este sitio, no un mecanismo publicado por Anthropic.',
  'how.p2':
    'Una página web no puede leer todo lo que Claude Code puede, pero la señal clave coincide: esta herramienta lee la misma zona horaria del SO y suma cuatro huellas más visibles en el navegador — idioma (es-CU), configuración regional Intl, fugas de IP por WebRTC y estilo de emoji — en una puntuación ponderada orientada a Cuba. Las señales con ≥0,25 cuentan como aciertos; bandas: Bajo 0–30, Medio 31–60, Alto 61–100.',
  'ui.weight': 'Peso',

  'why.title': 'Por qué Claude le marca como «usuario de Cuba»',
  'why.p1':
    'Anthropic no ofrece Claude en Cuba, y se ha reportado que Claude Code trata el tráfico que «parece de usuario de Cuba» como de mayor riesgo. El juicio no es un único interruptor: apila varias señales débiles en una probabilidad. La zona horaria del sistema es la señal individual más pesada en este escaneo porque viaja con cada solicitud y es difícil falsificarla por accidente, pero el idioma, la configuración regional Intl, WebRTC y el estilo de emoji suman peso además.',
  'why.p2':
    'La razón por la que el entorno del navegador filtra tanto es que la configuración regional se filtra en todo: la zona horaria del SO impulsa Intl y Date, la preferencia de idioma fija navigator.languages y la cabecera Accept-Language, y una sonda WebRTC puede exponer la IP real detrás de un proxy. Si además se enruta Claude Code por un proxy, el hostname del proxy es otra señal: informes de ingeniería inversa encontraron el veredicto codificado de forma esteganográfica en la línea «Today’s date» del system prompt.',
  'why.p3':
    'Ninguna de estas señales es decisiva por sí sola, que es exactamente por qué el riesgo es acumulativo. Una zona horaria de EE. UU. con es-CU al inicio de la lista de idiomas sigue leyéndose como sospechoso para el perfil cubano. La esteganografía y el modelo de riesgo completo se detallan en la',
  'why.link1': 'guía de esteganografía y modelo de riesgo de 4 capas',
  'why.p3b': ', y las correcciones prácticas están en la',
  'why.link2': 'guía de limpieza del entorno e IP residencial',
  'why.p3c': '.',

  'reduce.title': 'Cómo reducir la puntuación de riesgo',
  'reduce.sub':
    'Una lista ordenada breve. Cada paso corresponde directamente a una de las señales ponderadas anteriores; empiece por arriba, porque zona horaria e idioma llevan más peso.',
  'reduce.s1':
    'Configure la zona horaria del SO fuera de Cuba y de America/Havana (por ejemplo America/New_York o Europe/London) y confirme en el escaneo que Intl ya no resuelva America/Havana. En los informes de ingeniería inversa esta es la señal que se dice que Claude Code lee directamente, por eso tiene el mayor peso en esta puntuación.',
  'reduce.s2':
    'Quite es-CU del inicio de la lista de idiomas del navegador y del SO para que navigator.languages y Accept-Language encabecen con inglés u otro locale que no marque Cuba con la máxima puntuación.',
  'reduce.s3':
    'Alinee la configuración regional Intl del navegador (formato de fecha, números y divisas) con el país o perfil que quiere presentar, de modo que no refuerce un entorno cubano si busca otro.',
  'reduce.s4':
    'Bloquee fugas de IP por WebRTC y enrute por una IP residencial en lugar de una de datacenter, para que la red y la geografía reales no anulen un perfil por lo demás limpio.',
  'reduce.s5':
    'Al usar Claude Code mediante un relay, mantenga el hostname de ANTHROPIC_BASE_URL neutro: evite dominios con palabras clave marcadas o nombres de laboratorios de IA, y sobrescriba la variable de entorno TZ si la máquina anfitriona está en Cuba.',
  'reduce.cta': 'Los recorridos paso a paso completos están en la',
  'reduce.ctaLink': 'base de conocimientos de guías anti-bloqueo',

  'faq.title': 'Preguntas frecuentes',
  'faq.q1': '¿Claude realmente comprueba mi zona horaria?',
  'faq.a1':
    'Según informes públicos de ingeniería inversa, cuando Claude Code habla con un endpoint no oficial lee la zona horaria del SO y el hostname del proxy, y codifica el resultado de forma esteganográfica en su system prompt. La zona horaria que esta página lee mediante Intl.DateTimeFormat es exactamente la misma del SO.',
  'faq.q2': '¿Esta puntuación es la comprobación exacta que ejecuta Claude?',
  'faq.a2':
    'No. Solo la zona horaria del sistema se corresponde uno a uno con el mecanismo reportado de Claude. Las otras cuatro señales de esta página (idioma es-CU, Intl, WebRTC y emoji) son huellas habituales del entorno regional o de red que correlacionan con un «usuario de Cuba»; trate la puntuación como una estimación, no como un veredicto.',
  'faq.q3': '¿Cómo reduzco mi puntuación?',
  'faq.a3':
    'Cambie la zona horaria del SO fuera de America/Havana, quite es-CU del inicio de la lista de idiomas del navegador, alinee la configuración regional Intl, bloquee fugas de WebRTC y evite enrutar Claude Code por proxies cuyos hostnames contengan dominios marcados o palabras clave de laboratorios de IA. La lista «Cómo reducir la puntuación de riesgo» anterior lo recorre en orden.',
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
    'El endpoint curl en /api/check se ejecuta en el servidor, así que solo ve lo que expone la solicitud: zona horaria geo de Vercel, país, Accept-Language y User-Agent. No puede sondear la configuración Intl, fugas WebRTC ni el estilo de emoji, por lo que solo cubre zona horaria e idioma (unas tres cuartas partes del peso en Cuba) y normaliza a 0–100. El escaneo en el navegador lee el SO real y es el panorama más completo.',
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

  'memorial.card.banned': 'Bloqueada {date}',
  'memorial.card.candle': 'Encender una vela',
  'memorial.card.candleCount': '{n}',
  'memorial.card.created': 'Creada {date}',
  'memorial.card.no': 'N.º {no}',
  'memorial.card.survived': 'Sobrevivió {days} días',
  'memorial.claim.code': 'Código de edición',
  'memorial.claim.no': 'Número de lápida',
  'memorial.claim.submit': 'Verificar y guardar',
  'memorial.claim.title': 'Tengo un código de edición',
  'memorial.compare.hint':
    'Introduzca la fecha de creación de su cuenta. No se envía nada al servidor.',
  'memorial.compare.label': 'Comparar mi cuenta',
  'memorial.compare.result':
    '{pct}% de las lápidas de este muro sobrevivieron menos días de los que lleva viva su cuenta.',
  'memorial.disclaimer':
    'Todas las entradas son autoinformadas y no verificadas. Solo se cuentan las cuentas reportadas como bloqueadas, por lo que estas cifras no son la tasa de bloqueo de Anthropic y no dicen nada sobre las cuentas que nunca fueron bloqueadas. Anthropic no ha confirmado causas ni magnitud de los bloqueos.',
  'memorial.err.bad_request': 'Solicitud no válida.',
  'memorial.err.banned_future': 'La fecha de bloqueo no puede estar en el futuro.',
  'memorial.err.before_release':
    'La fecha de creación debe ser en o después del primer lanzamiento público de Claude.',
  'memorial.err.dates_reversed':
    'La fecha de bloqueo debe ser igual o posterior a la de creación.',
  'memorial.err.elapsed_too_short': 'Espere un momento antes de enviar.',
  'memorial.err.forbidden': 'El código de edición es incorrecto o falta.',
  'memorial.err.honeypot': 'Envío rechazado.',
  'memorial.err.invalid_date': 'Introduzca fechas válidas en formato AAAA-MM-DD.',
  'memorial.err.invalid_plan': 'Elija un plan.',
  'memorial.err.rate_limited': 'Demasiadas solicitudes. Inténtelo más tarde.',
  'memorial.err.unavailable': 'Servicio temporalmente no disponible.',
  'memorial.faq.a1':
    'Una lista voluntaria de cuentas Claude que los usuarios reportan como bloqueadas, con cuánto duró cada una. Son datos de la comunidad, no una lista oficial de Anthropic.',
  'memorial.faq.a2':
    'No. Cualquiera puede enviar fechas y un plan. No comprobamos cuentas con Anthropic ni guardamos pruebas.',
  'memorial.faq.a3':
    'Dos fechas, plan, recuento de velas, hora de envío y un hash de su código de edición. Sin IP, huella, correo ni texto libre.',
  'memorial.faq.q1': '¿Qué es esta página?',
  'memorial.faq.q2': '¿Está verificado?',
  'memorial.faq.q3': '¿Qué se almacena?',
  'memorial.faq.title': 'Preguntas frecuentes',
  'memorial.form.banned': 'Cuenta bloqueada',
  'memorial.form.codeWarning':
    'Guarde este código de edición ahora. No se volverá a mostrar. Lo necesita para editar o eliminar la entrada.',
  'memorial.form.copy': 'Copiar código de edición',
  'memorial.form.created': 'Cuenta creada',
  'memorial.form.editCode': 'Su código de edición',
  'memorial.form.plan': 'Plan al bloqueo',
  'memorial.form.submit': 'Enviar',
  'memorial.form.success': 'Lápida añadida',
  'memorial.form.title': 'Añadir una lápida',
  'memorial.lead':
    'Lápidas anónimas de cuentas Claude que la gente dice fueron bloqueadas. Los recuentos provienen solo de envíos voluntarios.',
  'memorial.loadMore': 'Cargar más',
  'memorial.meta.description':
    'Un muro autoinformado de cuentas Claude bloqueadas con estadísticas de días de supervivencia. Las entradas no están verificadas por Anthropic.',
  'memorial.meta.title': 'Memorial de cuentas Claude bloqueadas',
  'memorial.my.delete': 'Eliminar',
  'memorial.my.edit': 'Editar',
  'memorial.my.empty': 'Aún no hay lápidas guardadas en este navegador.',
  'memorial.my.title': 'Mis lápidas',
  'memorial.offline':
    'El almacén del memorial no está configurado. Los envíos y el muro están ocultos.',
  'memorial.plan.free': 'Free',
  'memorial.plan.max': 'Max',
  'memorial.plan.other': 'Otro',
  'memorial.plan.pro': 'Pro',
  'memorial.sort.long': 'Mayor supervivencia',
  'memorial.sort.new': 'Más recientes',
  'memorial.sort.short': 'Menor supervivencia',
  'memorial.stat.candles': 'Velas',
  'memorial.stat.longest': 'Más larga',
  'memorial.stat.median': 'Supervivencia mediana (días)',
  'memorial.stat.shortest': 'Más corta',
  'memorial.stat.tombstones': 'Lápidas',
  'memorial.title': 'Memorial de cuentas Claude',

  'nav.detector': 'Comprobación Claude',
  'nav.detector.desc': 'Escaneo de huella del navegador para señales de riesgo de Claude.',
  'nav.extension.desc': 'Extensión de navegador que replica el escaneo de este sitio.',
  'nav.group.explore': 'Explorar',
  'nav.group.tools': 'Herramientas',
  'nav.guides.desc': 'Guías anti-bloqueo sobre entorno, pago y apelaciones.',
  'nav.ip': 'Pureza de IP',
  'nav.ip.desc': 'Compruebe la reputación de proxy y datacenter de su IP de salida.',
  'nav.memorial': 'Memorial Claude',
  'nav.memorial.desc': 'Muro autoinformado de cuentas Claude bloqueadas.',
  'nav.menu': 'Menú',
  'nav.menu.close': 'Cerrar menú',
  'nav.news.desc': 'Noticias seleccionadas sobre política y productos de Claude.',
  'nav.whoami': 'Quién soy',
  'nav.whoami.desc': 'Vea qué puede leer este sitio sobre su visita.',

  'whoami.col.reading': 'Lectura',
  'whoami.col.timing': 'Tiempo',
  'whoami.col.value': 'Valor',
  'whoami.disclaimer':
    'Todas las comprobaciones son heurísticas y no garantizan cómo tratará ningún servicio su tráfico.',
  'whoami.faq.a1':
    'Las lecturas permanecen en su navegador para mostrarse. /api/whoami y /api/ip responden solicitudes en vivo y no se escriben en una base de datos desde esta página.',
  'whoami.faq.a2':
    'Significa que dos señales que suelen coincidir no coinciden en su caso. Es una pista para revisar VPN, suplantación de configuración regional o proxies; no es un veredicto de bloqueo.',
  'whoami.faq.a3':
    'Los sitios pueden activar la recopilación ICE para conocer direcciones host o reflexivas adicionales. Muchas herramientas de privacidad bloquean o falsifican esos candidatos.',
  'whoami.faq.q1': '¿Esta página guarda mis datos?',
  'whoami.faq.q2': '¿Qué significa una contradicción?',
  'whoami.faq.q3': '¿Por qué importa WebRTC?',
  'whoami.faqTitle': 'Preguntas frecuentes',
  'whoami.findingsTitle': 'Comprobaciones de coherencia',
  'whoami.headline.consistent':
    'Sin contradicciones entre las comprobaciones que pudimos ejecutar.',
  'whoami.headline.mismatches':
    '{n} contradicción(es) entre las comprobaciones que pudimos ejecutar.',
  'whoami.headline.pending': 'Aún no hay suficientes lecturas para comparar.',
  'whoami.layer.network': 'Red',
  'whoami.layer.probe': 'Sonda WebRTC',
  'whoami.layer.request': 'Solicitud',
  'whoami.layer.script': 'Navegador',
  'whoami.lead':
    'Esta página enumera señales que un sitio puede leer de su solicitud y navegador. No pide GPS preciso. Los hallazgos son heurísticas, no prueba.',
  'whoami.link.home': 'Comprobación del entorno Claude',
  'whoami.link.ip': 'Comprobación de pureza de IP',
  'whoami.linksAria': 'Herramientas relacionadas',
  'whoami.meta.description':
    'Lecturas que un sitio puede obtener de su navegador y solicitud, y comprobaciones cuando no coinciden. Sin puntuación.',
  'whoami.meta.title': 'Quién soy',
  'whoami.ms': '+{n} ms',
  'whoami.probe.note':
    'Solo se inicia tras hacer clic. Usa el STUN público de Cloudflare; nada de la sonda se sube.',
  'whoami.probe.run': 'Ejecutar sonda WebRTC',
  'whoami.probe.running': 'Sondeando…',
  'whoami.reading.network.asn': 'ASN',
  'whoami.reading.network.org': 'Organización de red',
  'whoami.reading.network.proxy': 'Indicador proxy / VPN',
  'whoami.reading.network.type': 'Tipo de red IP',
  'whoami.reading.probe.hostIps': 'Direcciones ICE host',
  'whoami.reading.probe.srflxIp': 'Dirección STUN srflx',
  'whoami.reading.request.acceptLanguage': 'Cabecera Accept-Language',
  'whoami.reading.request.city': 'Ciudad geo (IP)',
  'whoami.reading.request.country': 'País geo (IP)',
  'whoami.reading.request.dnt': 'Cabecera DNT',
  'whoami.reading.request.ip': 'IP vista por el servidor',
  'whoami.reading.request.ipTimezone': 'Zona horaria geo (IP)',
  'whoami.reading.request.region': 'Región geo (IP)',
  'whoami.reading.request.secChUaPlatform': 'Cabecera Sec-CH-UA-Platform',
  'whoami.reading.request.secGpc': 'Cabecera Sec-GPC',
  'whoami.reading.request.userAgent': 'Cabecera User-Agent',
  'whoami.reading.script.canvas': 'Hash de Canvas',
  'whoami.reading.script.cores': 'Núcleos de CPU',
  'whoami.reading.script.gpu': 'Renderizador WebGL',
  'whoami.reading.script.languages': 'navigator.languages',
  'whoami.reading.script.memory': 'Memoria del dispositivo',
  'whoami.reading.script.privacy': 'Señales de privacidad',
  'whoami.reading.script.screen': 'Pantalla',
  'whoami.reading.script.timezone': 'Zona horaria del navegador',
  'whoami.reading.script.touch': 'maxTouchPoints',
  'whoami.reading.script.uaDataPlatform': 'Plataforma UA-CH',
  'whoami.reading.script.userAgent': 'navigator.userAgent',
  'whoami.readingsTitle': 'Lecturas',
  'whoami.title': 'Quién soy',
  'whoami.verdict.match': 'Coherente',
  'whoami.verdict.mismatch': 'Contradicción',
  'whoami.rule.tz-offset.title': 'Desfase horario vs zona geo (IP)',
  'whoami.rule.tz-offset.match':
    'El desfase UTC del navegador coincide con el de la zona horaria geo (IP).',
  'whoami.rule.tz-offset.mismatch':
    'El desfase UTC del navegador difiere del de la zona horaria geo (IP).',
  'whoami.rule.lang-country.title': 'Idiomas del navegador vs país (IP)',
  'whoami.rule.lang-country.match':
    'Una etiqueta de idioma principal encaja con los idiomas habituales del país (IP).',
  'whoami.rule.lang-country.mismatch':
    'Ninguna etiqueta de idioma principal encaja con los idiomas habituales del país (IP).',
  'whoami.rule.lang-header-script.title': 'Accept-Language vs navigator.languages',
  'whoami.rule.lang-header-script.match':
    'La primera etiqueta de idioma coincide en cabecera y script.',
  'whoami.rule.lang-header-script.mismatch':
    'La primera etiqueta de idioma difiere entre cabecera y script.',
  'whoami.rule.ua-platform.title': 'User-Agent vs indicio de plataforma',
  'whoami.rule.ua-platform.match':
    'User-Agent y el indicio de plataforma apuntan a la misma familia de SO.',
  'whoami.rule.ua-platform.mismatch':
    'User-Agent y el indicio de plataforma apuntan a familias de SO distintas.',
  'whoami.rule.ua-gpu.title': 'User-Agent vs renderizador GPU',
  'whoami.rule.ua-gpu.match':
    'El renderizador GPU parece plausible para la plataforma declarada.',
  'whoami.rule.ua-gpu.mismatch':
    'El renderizador GPU parece incorrecto para la plataforma declarada.',
  'whoami.rule.webrtc-ip.title': 'WebRTC srflx vs IP del servidor',
  'whoami.rule.webrtc-ip.match':
    'La dirección STUN srflx coincide con la IP vista por el servidor.',
  'whoami.rule.webrtc-ip.mismatch':
    'La dirección STUN srflx difiere de la IP vista por el servidor.',
  'whoami.rule.webrtc-tun.title': 'Candidatos host vs rango TUN',
  'whoami.rule.webrtc-tun.match':
    'Hay candidatos host y ninguno está en 198.18.0.0/15.',
  'whoami.rule.webrtc-tun.mismatch':
    'Un candidato host está en 198.18.0.0/15 (rango TUN habitual en Clash/Surge; solo heurística).',
  'whoami.rule.ip-network-type.title': 'Expectativa de IP residencial',
  'whoami.rule.ip-network-type.match':
    'La salida parece residencial y no está marcada como proxy/VPN.',
  'whoami.rule.ip-network-type.mismatch':
    'La salida parece de datacenter o proxy/VPN.',
} satisfies Record<string, string>;
