import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import PreOrderButton from './PreOrderButton'

export default function Header() {
  return (
    <header className="fixed top-0 left-10 right-10 bg-white border-b z-50">
      <div className="relative w-full bg-indigo-600 py-2 px-4 text-center text-sm text-white">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-white hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto px-10">
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
            <PreOrderButton className="text-md size-lg py-6" />
          </div>
        </div>
      </div>
    </header>
  )
}
