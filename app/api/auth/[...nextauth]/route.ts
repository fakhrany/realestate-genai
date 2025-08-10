import NextAuth from "next-auth"; import Credentials from "next-auth/providers/credentials";
const handler = NextAuth({
  providers:[Credentials({ name:"Credentials", credentials:{ email:{}, password:{} }, async authorize(creds){ const email=(creds?.email||'') as string; const password=(creds?.password||'') as string; const role=email.endsWith("@yourcompany.com")?'staff':'user'; const adminPass=process.env.ADMIN_PASSWORD||"admin"; if(password===adminPass && email) return { id:"user-"+email, email, role }; return null; } })],
  session:{ strategy:"jwt" },
  callbacks:{ async jwt({ token, user }){ if(user) (token as any).role=(user as any).role||'user'; return token; }, async session({ session, token }){ (session.user as any).role=(token as any).role||'user'; return session; } }
});
export { handler as GET, handler as POST };
