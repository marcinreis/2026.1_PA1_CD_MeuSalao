import MobileNav from "@/components/mobile-nav";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  );
}
