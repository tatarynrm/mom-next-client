import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Шлях до приватних сторінок
const protectedPaths = ["/dashboard", "/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Пропускаємо публічні сторінки
  if (!protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Беремо refresh token з cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;


  if (!refreshToken) {
    // Редірект на логін якщо токена немає
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Тут можна додатково валідувати refresh token на сервері
  // Наприклад, через запит до API:
  // const valid = await validateToken(refreshToken);
  // if (!valid) return NextResponse.redirect(loginUrl);

  return NextResponse.next();
}

// Застосувати middleware лише для потрібних сторінок
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
// src/middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("refreshToken"); // або JWT access cookie

//   const url = req.nextUrl.clone();

//   // Якщо користувач залогінений і заходить на login/register
//   if (token && url.pathname.startsWith("/login")) {
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }

//   // Якщо користувач не залогінений і заходить на приватну сторінку
//   const protectedPaths = ["/dashboard", "/profile"];
//   if (!token && protectedPaths.some(path => url.pathname.startsWith(path))) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// // застосування middleware для всіх сторінок
// export const config = {
//   matcher: ["/login", "/dashboard/:path*"], 
// };
