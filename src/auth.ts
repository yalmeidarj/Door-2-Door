import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { ConvexAdapter } from "./app/ConvexAdapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: ConvexAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //   },
      // }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
