import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

const footerNavigation = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
    { name: 'Security', href: '/security' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/thrivestakk' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/thrivestakk' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/thrivestakk' },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">ThriveStakk</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Accelerate your business growth with our comprehensive platform designed for modern entrepreneurs.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.product.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ThriveStakk, Inc. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* NoScript fallback footer */}
      <noscript>
        <div className="border-t bg-muted p-4">
          <div className="text-center space-y-4">
            <div>
              <strong>ThriveStakk</strong> - Accelerate your business growth
            </div>
            <div className="text-sm space-x-4">
              <a href="/features" className="underline">Features</a>
              <a href="/pricing" className="underline">Pricing</a>
              <a href="/about" className="underline">About</a>
              <a href="/contact" className="underline">Contact</a>
              <a href="/privacy" className="underline">Privacy</a>
              <a href="/terms" className="underline">Terms</a>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} ThriveStakk, Inc.
            </div>
          </div>
        </div>
      </noscript>
    </footer>
  )
}