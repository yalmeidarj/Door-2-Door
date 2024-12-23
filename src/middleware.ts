// import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server"; // Import NextResponse

// export default withAuth(
//   function middleware(req: NextRequestWithAuth) {
//      return NextResponse.next();
//   }
// );

// export const config = { matcher: ["/admin"] };
export { auth as middleware } from "@/auth";