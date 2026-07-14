import { Footer } from "@/components/layout/footer";
import { HashScroll } from "@/components/layout/hash-scroll";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HashScroll />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
