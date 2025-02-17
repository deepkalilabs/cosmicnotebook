import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
      <Link href="/" className="font-bold text-xl">
        <Image src="/cosmic-logo-big.png" alt="Logo" width={45} height={45} className="rounded-lg" />
      </Link>
    </div>
    <div className="flex items-center space-x-4">
      <Link href="/auth/signup">
        <Button variant="ghost">
          Sign in
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button className="bg-gradient-to-r from-black-900 via-slate-800 to-black hover:from-blue-950 hover:via-slate-900 hover:to-black text-white">
          Get started
        </Button>
      </Link>
    </div>
     </div>
      </div>
    </header>
  )
}
