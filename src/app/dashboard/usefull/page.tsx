"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

/**
 * Сервіси:
 * - Open-Meteo (без ключів): https://open-meteo.com/
 *   endpoint used: /v1/forecast?latitude=...&longitude=...&current_weather=true&timezone=auto
 *
 * - exchangerate.host (без ключів): https://exchangerate.host/
 *   endpoint used: /latest?base=UAH&symbols=USD,EUR,PLN
 *
 * Примітка: координати приблизні — при потребі підправлю.
 */

type WeatherResult = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  placeName: string;
};

type RatesResult = {
  base: string;
  date: string;
  rates: { [key: string]: number };
};

const CITY_LIST = [
  {
    id: "burshtyn",
    name: "Бурштин",
    lat: 49.0511,
    lon: 24.4278,
  },
  {
    id: "demnya", // новий id для Демні
    name: "Демня", // назва міста
    lat: 49.7944, // координати Демні (приблизно)
    lon: 23.8884, // координати Демні (приблизно)
  },
  {
    id: "lviv",
    name: "Львів",
    lat: 49.8397,
    lon: 24.0297,
  },
  {
    id: "gorzow",
    name: "Gorzów Wielkopolski",
    lat: 52.7368,
    lon: 15.2288,
  },
];

/** Прості описи weathercode з Open-Meteo */
const weatherCodeMap: Record<number, string> = {
  0: "Ясно",
  1: "Переважно ясно",
  2: "Переважно хмарно",
  3: "Похмуро",
  45: "Туман",
  48: "Дрібний туман (кристали)",
  51: "Дрібний дощ (легкий)",
  53: "Помірний дрібний дощ",
  55: "Щільний дрібний дощ",
  56: "Дрібний дощ (замерзаючий)",
  57: "Сильний дрібний дощ (замерзаючий)",
  61: "Дощ (легкий)",
  63: "Дощ (помірний)",
  65: "Дощ (сильний)",
  66: "Замерзаючий дощ (легкий)",
  67: "Замерзаючий дощ (сильний)",
  71: "Сніг (легкий)",
  73: "Сніг (помірний)",
  75: "Сніг (сильний)",
  77: "Сніжні зерна",
  80: "Зливи (локально)",
  81: "Зливи (помірні)",
  82: "Зливи (сильні)",
  85: "Снігопад (легкий)",
  86: "Снігопад (сильний)",
  95: "Гроза",
  96: "Гроза з невеликим градом",
  99: "Гроза з сильним градом",
};

export default function WeatherAndRatesPage() {
  const [weathers, setWeathers] = useState<
    Record<string, WeatherResult | null>
  >({});

  const [loadingWeather, setLoadingWeather] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Функція для отримання погоди для кожного міста
    const fetchWeatherData = async () => {
      setLoadingWeather(true);
      try {
        // Використовуємо Promise.all для паралельних запитів
        await Promise.all(
          CITY_LIST.map(async (city) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`;

            try {
              const response = await fetch(url);
              if (!response.ok) {
                throw new Error(`Weather fetch failed for ${city.name}`);
              }

              const data = await response.json();
              const cw = data.current_weather;

              // Створюємо результат і зберігаємо його в стан
              const result = {
                temperature: cw.temperature,
                windspeed: cw.windspeed,
                winddirection: cw.winddirection,
                weathercode: cw.weathercode,
                time: cw.time,
                placeName: city.name,
              };

              // Оновлюємо стан погоди
              setWeathers((prev) => ({ ...prev, [city.id]: result }));
            } catch (err) {
              // Якщо помилка в окремому запиті
              console.error(`Failed to fetch weather for ${city.name}`, err);
            }
          })
        );
      } catch (err) {
        console.error("General error in fetching weather data", err);
        setError("Помилка при отриманні погоди");
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, []); // Порожній масив залежностей означає, що ефект виконається лише один раз

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {CITY_LIST.map((city) => {
            const weather = weathers[city.id];
            return (
              <div
                key={city.id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {city.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Коорд.: {city.lat.toFixed(4)}, {city.lon.toFixed(4)}
                </p>
                <div className="mt-4">
                  {loadingWeather ? (
                    <div className="text-sm text-slate-500">
                      Завантаження погоди...
                    </div>
                  ) : weather ? (
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-sky-100 dark:bg-sky-900/30 w-20 h-20 flex items-center justify-center text-xl font-bold text-sky-700 dark:text-sky-200">
                        {Math.round(weather.temperature)}°C
                      </div>
                      <div>
                        <div className="text-sm text-slate-700 dark:text-slate-200">
                          {weatherCodeMap[weather.weathercode] ??
                            `Код ${weather.weathercode}`}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                          Вітер: {weather.windspeed} км/год • напрям{" "}
                          {Math.round(weather.winddirection)}°
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Час: {new Date(weather.time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">Немає даних</div>
                  )}
                </div>
                <div className="mt-4 text-right text-xs text-slate-400">
                  джерело: Open-Meteo
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-6 text-center text-xs text-slate-500">
          Джерела: Open-Meteo (погода), exchangerate.host (курси). Якщо хочеш —
          додам іконки погоди або графіки.
        </footer>
      </div>
    </div>
  );
}
