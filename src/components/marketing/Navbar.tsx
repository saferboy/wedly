import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif italic text-[#8B1A1A]">
              Wedly
            </span>
            <span className="text-xs text-[#C9A84C] font-medium tracking-widest mt-1">
              ✦
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/templates"
              className="text-sm text-gray-600 hover:text-[#8B1A1A] transition-colors"
            >
              Templatelar
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-[#8B1A1A] transition-colors"
            >
              Qanday ishlaydi
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-600 hover:text-[#8B1A1A] transition-colors"
            >
              Narxlar
            </Link>
          </nav>

          <Button href="/templates" size="sm">
            Boshlash →
          </Button>
        </div>
      </Container>
    </header>
  );
}
