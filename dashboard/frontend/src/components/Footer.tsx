import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="bg-background border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy & Terms of Service</Link></li>
                <li>
                  <Link href="https://how-to-record-in-person--bzv7ly8.gamma.site/" className="text-muted-foreground hover:text-foreground">
                    Consent Tips
                  </Link>
                </li>
              </ul>
            </div>

            {/* Engineering Section 
            <div>
              <h3 className="font-semibold text-lg mb-4">Engineering</h3>
              <ul className="space-y-3">
                <li><Link href="/changelog" className="text-muted-foreground hover:text-foreground">Changelog</Link></li>
                <li><Link href="/status" className="text-muted-foreground hover:text-foreground">Status</Link></li>
                <li><Link href="/docs" className="text-muted-foreground hover:text-foreground">Docs</Link></li>
              </ul>
            </div>
            */}

            {/* 
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
          */}
          </div>


          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-12">
              <p className="text-center text-sm text-gray-500">
                <span className="float-left flex items-center gap-2">
                  <Image src="/cosmic-logo-big.png" alt="Deep Kali Labs Logo" width={20} height={20} />
                  <span>© 2025 Deep Kali Labs, Inc.</span>
                </span>
                <span className="float-right">Made with ❤️ in Toronto & SF</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
}