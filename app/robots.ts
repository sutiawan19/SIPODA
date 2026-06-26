import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/responses'],
    },
    sitemap: 'https://penilaianpelayanan.vercel.app/sitemap.xml',
  }
}
