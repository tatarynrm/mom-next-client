import ThemeSwitcher from "@/components/ui/switchers/ThemeSwitcher";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-2  min-h-screen">
      <ThemeSwitcher />
      <Link href={'/login'}>Увійти</Link>
    </div>
  );
}
