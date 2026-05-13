import MobileNav from "@/components/mobile-nav";
import CompararBar from "@/components/comparar-bar";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CompararBar />
      <MobileNav />
    </>
  );
}
