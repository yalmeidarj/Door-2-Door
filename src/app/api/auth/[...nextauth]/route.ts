// import NextAuth from "next-auth";

// import { handlers } from "@/auth"

// import { authOptions } from "@/server/auth";

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
import { handlers } from "@/auth"
//  eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const {GET, POST} = handlers;