const NAV_BREAKPOINT = 900;

function navMenus(): HTMLDetailsElement[] {
  return [...document.querySelectorAll<HTMLDetailsElement>('details[data-nav-menu]')];
}

function closeAllExcept(keep?: HTMLDetailsElement) {
  for (const menu of navMenus()) {
    if (menu !== keep && menu.open) menu.open = false;
  }
}

function mobileDrawer(): HTMLDetailsElement | null {
  return document.querySelector<HTMLDetailsElement>('details.nav-drawer');
}

document.addEventListener(
  'click',
  (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    for (const menu of navMenus()) {
      if (menu.open && !menu.contains(target)) menu.open = false;
    }
  },
  true,
);

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openMenu = navMenus().find((menu) => menu.open);
  if (!openMenu) return;
  event.preventDefault();
  openMenu.open = false;
  const summary = openMenu.querySelector('summary');
  if (summary instanceof HTMLElement) summary.focus();
});

for (const menu of navMenus()) {
  menu.addEventListener('toggle', () => {
    if (menu.open) closeAllExcept(menu);
  });
}

const drawer = mobileDrawer();
if (drawer) {
  drawer.addEventListener('click', (event) => {
    const link = (event.target as Element).closest('a');
    if (link && drawer.open) drawer.open = false;
  });
}

const mq = window.matchMedia(`(max-width: ${NAV_BREAKPOINT}px)`);
function onViewportChange() {
  if (!mq.matches) {
    const d = mobileDrawer();
    if (d?.open) d.open = false;
  }
}
mq.addEventListener('change', onViewportChange);
onViewportChange();