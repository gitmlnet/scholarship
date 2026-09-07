import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router';
import { cn } from '@/utils/cn';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const NAV_ITEMS = [
  { to: '/scholarship', key: 'header.nav.scholarship' },
  { to: '/eligibility', key: 'header.nav.eligibility' },
  { to: '/syllabus', key: 'header.nav.syllabus' },
  { to: '/notices', key: 'header.nav.notices' },
  { to: '/results', key: 'header.nav.results' },
  { to: '/faq', key: 'header.nav.faq' },
] as const;

export function Header() {
  const { t } = useTranslation(['layout', 'common']);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Close the mobile menu on Escape while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="border-line bg-surface-raised border-b">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label={t('header.home')} className="rounded-lg">
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={t('header.home')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-navy-950 decoration-gold-400 underline decoration-2 underline-offset-8'
                        : 'text-ink-muted hover:text-navy-800',
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ButtonLink to="/register" variant="primary" size="md" className="hidden sm:inline-flex">
            {t('common:actions.apply')}
          </ButtonLink>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="text-navy-900 hover:bg-navy-100/70 rounded-lg p-2 lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? t('header.closeMenu') : t('header.openMenu')}
            </span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true" focusable="false">
              {menuOpen ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label={t('header.home')}
          className="border-line bg-surface-raised border-t lg:hidden"
        >
          <Container className="py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg px-3 py-2.5 text-sm font-medium',
                        isActive
                          ? 'bg-navy-50 text-navy-950'
                          : 'text-ink-muted hover:bg-navy-50 hover:text-navy-800',
                      )
                    }
                  >
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink
                  to="/track"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-navy-50 text-navy-950'
                        : 'text-ink-muted hover:bg-navy-50 hover:text-navy-800',
                    )
                  }
                >
                  {t('header.nav.track')}
                </NavLink>
              </li>
              <li className="pt-2">
                <ButtonLink
                  to="/register"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={closeMenu}
                >
                  {t('common:actions.apply')}
                </ButtonLink>
              </li>
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
