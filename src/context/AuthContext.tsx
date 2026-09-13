import { createContext, useContext, useMemo, useState } from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin" | "staff";
};

type AuthContextValue = {
  user: User | null;
  login: (email: string, name?: string, role?: User["role"], avatar?: string) => void;
  logout: () => void;
};

const defaultAvatar =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=96&h=96&fit=crop&auto=format";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("agrisage-user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<User>;
        return {
          name: parsed.name || "Bác Ba Đức",
          email: parsed.email || "",
          avatar: parsed.avatar || defaultAvatar,
          role: parsed.role || "user",
        };
      } catch {
        localStorage.removeItem("agrisage-user");
      }
    }
    return null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email, name = "Bác Ba Đức", role = "user", avatar = defaultAvatar) => {
        const nextUser = { name, email, role, avatar };
        localStorage.setItem("agrisage-user", JSON.stringify(nextUser));
        setUser(nextUser);
      },
      logout: () => {
        localStorage.removeItem("agrisage-user");
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
