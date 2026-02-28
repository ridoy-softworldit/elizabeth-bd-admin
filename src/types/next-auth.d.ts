import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    gender: string;
    walletPoint: number;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      gender: string;
      walletPoint: number;
      accessToken?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    gender: string;
    walletPoint: number;
    accessToken?: string;
  }
}
