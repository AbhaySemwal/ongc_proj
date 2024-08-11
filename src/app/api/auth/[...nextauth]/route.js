import Patient from "@/models/Patient";
import connect from "../../../../../utils/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        await connect();

        try {
          // Fetch user from the database using CPF number
          const user = await Patient.findOne({ cpf: credentials.cpf });
          if (!user) {
            throw new Error("User not found");
          }

          // At this point, we assume the user has already been authenticated by Firebase on the client side
          // We're just validating the CPF and retrieving user data from our database

          return {
            id: user._id.toString(),
            name: user.name,
            cpf: user.cpf,
            email: user.email, // Assuming you store email in your Patient model
          };
        } catch (err) {
          console.error("Authentication error:", err);
          throw new Error(err.message || "Error during authentication");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.cpf = user.cpf;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.cpf = token.cpf;
      session.user.email = token.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };