"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure we only render the form after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Username atau password salah");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading skeleton during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
        <Card className="w-full max-w-md animate-pulse bg-[#1E293B] border-[#334155]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#334155]" />
            <div className="h-6 bg-[#334155] rounded w-32 mx-auto" />
            <div className="h-4 bg-[#334155] rounded w-48 mx-auto mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-[#334155] rounded" />
              <div className="h-10 bg-[#334155] rounded" />
              <div className="h-10 bg-[#334155] rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <Card className="w-full max-w-md bg-[#1E293B] border-[#334155]">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-[#14B8A6] flex items-center justify-center">
            <span className="text-white font-bold text-lg">JP</span>
          </div>
          <CardTitle className="text-xl text-white">Admin Panel</CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Jasa Proteksi — Masuk ke panel admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#94A3B8]">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="bg-[#0F172A] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#14B8A6] focus:ring-[#14B8A6] h-12 rounded-lg transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#94A3B8]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-[#0F172A] border-[#334155] text-white placeholder:text-[#64748B] focus:border-[#14B8A6] focus:ring-[#14B8A6] h-12 rounded-lg transition-colors duration-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold tracking-wider"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
