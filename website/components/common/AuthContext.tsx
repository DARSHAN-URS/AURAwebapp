"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

const PROTECTED_ROUTES = [
  "/dashboard",
  "/visa-check",
  "/sop",
  "/scholarships",
  "/universities",
  "/applications",
  "/visa-success",
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Route protection
  useEffect(() => {
    if (!loading) {
      const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
      if (isProtected && !user) {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  // Global Fetch Interceptor (injects Supabase token dynamically into FastAPI requests)
  useEffect(() => {
    const originalFetch = window.fetch;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    window.fetch = async (input, init) => {
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof URL) {
        url = input.toString();
      } else {
        url = input.url;
      }

      // If the request points to our FastAPI backend API, inject the JWT bearer token
      if (url.startsWith(API_URL)) {
        try {
          const { data } = await supabase.auth.getSession();
          const activeSession = data.session;
          if (activeSession?.access_token) {
            init = init || {};
            const headers = new Headers(init.headers || {});
            if (!headers.has("Authorization")) {
              headers.set("Authorization", `Bearer ${activeSession.access_token}`);
            }
            init.headers = headers;
          }
        } catch (err) {
          console.error("Auth fetch interceptor failed to get session token:", err);
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
