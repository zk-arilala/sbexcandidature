export const navItems = [
  {
    type: 'link',
    href: '/',
    label: 'Accueil',
  },
  {
    type: 'link',
    label: 'Bourses disponibles',
    href: '/bourses_disponibles',
  },
  {
    type: 'dropdown',
    label: 'Formulaires de candidature',
    items: [
      { href: '/candidature-universitaire', label: 'Bourse Universitaire' },
      { href: '/candidature-post-universitaire', label: 'Bourse Post Universitaire' },
    ],
  },
  {
    type: 'link',
    label: 'Suivre un dossier',
    href: '/suivi-candidature',
  },
  {
    type: 'link',
    label: 'Contacts',
    href: '/contact',
  }
] satisfies NavItem[];

type NavItem = Record<string, string | unknown> &
  (
    | {
        type: 'link';
        href: string;
      }
    | {
        type: 'dropdown';
      }
  );
