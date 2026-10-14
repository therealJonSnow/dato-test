/**
 * Default content for the site header (desktop nav-dropdown 2883:11102 and
 * mobile-menu 2883:11432). Copied from the Figma variants Menu=Product … Menu=Developers.
 * Header.astro takes this as its default `items` prop, so a page can pass its own.
 *
 * Model: an item with `columns` opens a dropdown; an item with only `href` is a plain link
 * (Philosophy, Pricing). A column stacks groups; a group has a muted heading, links and an
 * optional "→ All …" link. On mobile every group becomes one cell of a 2-column grid.
 */
export interface NavLink { label: string; href: string }
export interface NavGroup { heading: string; links: NavLink[]; all?: NavLink }
export interface NavColumn { groups: NavGroup[] }
export interface NavItem { id: string; label: string; href?: string; columns?: NavColumn[] }

const l = (label: string, href = '#'): NavLink => ({ label, href });

export const navItems: NavItem[] = [
  {
    id: 'product',
    label: 'Product',
    columns: [
      { groups: [{ heading: 'Product', links: [l('Overview'), l('Developer Experience'), l('Editor Experience'), l('AI & Automation')] }] },
      {
        groups: [{
          heading: 'Features',
          links: [l('GraphQL API'), l('Localization'), l('Visual Editing'), l('Plugins'), l('Structured Text'), l('Modular Content'), l('Cache Tags'), l('AI & Automation')],
          all: l('All Features'),
        }],
      },
      {
        groups: [
          { heading: 'Marketplace', links: [l('Plugins'), l('Hosting & Builds'), l('Schema Recipes'), l('Starters'), l('Enterprise Apps')] },
          { heading: 'Integration Guides', links: [l('Next.js'), l('SvelteKit'), l('Astro'), l('Nuxt')] },
        ],
      },
    ],
  },
  {
    id: 'solutions',
    label: 'Solutions',
    columns: [
      { groups: [{ heading: 'By Use Case', links: [l('eCommerce'), l('Digital Publishing'), l('Knowledge Management'), l('Modern Websites'), l('Travel')] }] },
      { groups: [{ heading: 'By Team', links: [l('For Developers'), l('For Marketers'), l('For Content Creators'), l('For Enterprise')] }] },
      { groups: [{ heading: 'Compare', links: [l('Contentful'), l('Sanity'), l('Storyblok'), l('Strapi'), l('WordPress')] }] },
    ],
  },
  {
    id: 'customers',
    label: 'Customers',
    columns: [
      {
        groups: [{
          heading: 'Case Studies',
          links: [l('Polestar'), l('Arduino'), l('Hashicorp'), l('Le Pain Quotidien'), l('Chilly’s'), l('Netflix'), l('Oberlo'), l('Wonderland')],
          all: l('All Case Studies'),
        }],
      },
      {
        groups: [{
          heading: 'Casual Chats',
          links: [
            l('w/ Overnice: On helping shape the GraphQL Community'),
            l('w/ L+R: On powering offline wayfinding'),
            l('w/ Goodbase: On the aesthetics of a lighter internet'),
          ],
          all: l('All Casual Chats'),
        }],
      },
      { groups: [{ heading: 'Testimonials', links: [l('Wall Of Love')] }] },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    columns: [
      {
        groups: [{
          heading: 'Agency Directory',
          links: [l('Overview'), l('Europe (147)'), l('North America (55)'), l('Oceania (22)'), l('Asia (21)'), l('South America (7)'), l('Africa (4)')],
          all: l('All Partners'),
        }],
      },
      {
        groups: [{
          heading: 'Partner Showcase',
          links: [l('L’Officiel'), l('Wild'), l('Toca Boca'), l('MDLBEAST'), l('Aston Power'), l('Olive Green Times'), l('The Picnic Guide'), l('Goldengates')],
          all: l('All Projects'),
        }],
      },
      { groups: [{ heading: 'Join The Network', links: [l('Become A Partner')] }] },
    ],
  },
  {
    id: 'developers',
    label: 'Developers',
    columns: [
      {
        groups: [{
          heading: 'Docs',
          links: [l('Content modelling'), l('Content Delivery API'), l('Content Management API'), l('AI & Automation'), l('Plugin SDK')],
          all: l('All Docs'),
        }],
      },
      { groups: [{ heading: 'Resources', links: [l('Academy'), l('How To DatoCMS'), l('User Guides'), l('Glossary'), l('Blog')] }] },
      {
        groups: [
          { heading: 'Marketplace', links: [l('Plugins'), l('Hosting & Builds'), l('Schema Recipes'), l('Starters'), l('Enterprise Apps')] },
          { heading: 'Community', links: [l('Forum'), l('Slack'), l('Support')] },
        ],
      },
    ],
  },
  { id: 'philosophy', label: 'Philosophy', href: '#' },
  { id: 'pricing', label: 'Pricing', href: '#' },
];
