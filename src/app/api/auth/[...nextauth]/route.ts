import { options } from '../../../../components/options'
import NextAuth from "next-auth/next";

const handler = NextAuth(options);

export { handler as GET, handler as POST };