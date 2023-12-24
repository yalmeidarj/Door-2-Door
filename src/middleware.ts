import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server"; // Import NextResponse

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);

    // Check if the user is not an ADMIN
    if (req.nextauth.token?.role !== "ADMIN") {
      // Redirect to '/forbiddenUser' if not ADMIN
      return NextResponse.redirect("http://localhost:3000/forbiddenUser");
    }

    // Continue with the middleware processing if the user is ADMIN
    return NextResponse.next();
  },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "ADMIN", // Check if the role is ADMIN
//     },
//   }
);

export const config = { matcher: ["/admin"] };
