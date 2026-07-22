export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/downloads/', '/admin/'],
    },
    sitemap: 'https://neurodivers3.co.uk/sitemap.xml',
  };
}
