import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/dbConnect"; // Import the db utility
import User from "@/models/User"; // Import the User model

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // Add the new callbacks object here
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return false; // Only allow google provider
      }

      try {
        await dbConnect();

        // 1. Check if the user already exists in our database
        const userExists = await User.findOne({ email: user.email });

        // 2. If not, create a new user document
        if (!userExists) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account.provider,
          });
        }

        return true; // Allow the sign-in
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Prevent sign-in on database error
      }
    },
  },
});

export { handler as GET, handler as POST };
