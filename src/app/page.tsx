import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "@/components/ui/switchers/ThemeSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        {/* Theme Switcher in corner */}
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>

        {/* Logo or Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logistic.jpg" // 🔁 заміни на актуальний шлях до зображення або залиш, якщо використаєш іконку з heroicons чи undraw
            alt="Логістика"
            width={150}
            height={150}
          />
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Записник Логіста
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Керуйте перевезеннями, водіями та маршрутами в одному місці.
        </p>

        {/* Кнопка входу */}
        <Link href="/login" className="bg-blue-200 p-2 rounded-xs">
         
            Увійти в систему
          
        </Link>
      </div>
    </div>
  );
}
