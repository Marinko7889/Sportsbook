// middleware.js
// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("token"); // token mora biti u cookie
//   const url = req.nextUrl.clone();

//   // Ako korisnik nema token i pokuša ući na zaštićene rute → redirect na login
//   if (!token && ["/", "/teams", "/competition"].includes(url.pathname)) {
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/teams", "/competition"], // rute koje želimo protectati
// };
// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Middleware ne radi ništa, samo prosljeđuje zahtjev dalje
  return NextResponse.next();
}

// Opcionalno: config za rute koje bi middleware obradio
export const config = {
  matcher: [], // ostavi prazno ako ne želiš ništa specifično
};
