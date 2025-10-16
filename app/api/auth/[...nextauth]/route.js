// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials.email === "marinko@gmail.com" &&
//           credentials.password === "1234"
//         ) {
//           return { id: 1, name: "Marinko", email: "marinko@gmail.com" };
//         }

//         return null;
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },

//   session: {
//     strategy: "jwt",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };
