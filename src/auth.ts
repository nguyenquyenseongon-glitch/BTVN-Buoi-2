import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Cấu hình đăng nhập (Auth.js v5).
 * Dùng Google OAuth, chỉ cho phép đúng email admin (ADMIN_EMAIL) đăng nhập.
 * Đọc AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET từ biến môi trường.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  callbacks: {
    signIn({ user }) {
      const admin = process.env.ADMIN_EMAIL?.toLowerCase();
      return Boolean(
        admin && user.email && user.email.toLowerCase() === admin,
      );
    },
  },
});
