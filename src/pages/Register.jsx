import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, CheckCircle2, AlertCircle, User, Phone } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  const [selectedPartner, setSelectedPartner] = useState("OM Kumar");
  const [fullName, setFullName] = useState("OM Kumar");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const nameToSave = fullName.trim() || selectedPartner;
    if (!nameToSave) {
      setError("Please enter your name");
      return;
    }

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = `+91 ${phone}`;
      const data = await signUp(email, password, {
        full_name: nameToSave,
        phone: formattedPhone,
      });
      // If email confirmation is disabled in Supabase, session is created immediately
      if (data?.session) {
        navigate("/");
      } else {
        // Confirmation email was sent
        setEmailSent(true);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        icon={CheckCircle2}
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}`}
        footer={
          <p className="text-sm text-center text-muted-foreground">
            Already verified?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        }
      >
        <div className="space-y-4 text-center">
          <p className="text-sm text-[#62666F]">
            Click the link in the email to activate your account and start using the Partnership Ledger.
          </p>
          <Button
            variant="outline"
            className="w-full h-11 border-[#E8E6E1]"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started with Partnership Ledger"
      footer={
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      {!isSupabaseConfigured && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            <strong>Supabase Setup Needed:</strong> Add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code> to enable live registration.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partnerSelect">Select Co-Founder Profile</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <select
              id="partnerSelect"
              value={selectedPartner}
              onChange={(e) => {
                setSelectedPartner(e.target.value);
                setFullName(e.target.value);
              }}
              className="w-full h-12 pl-10 pr-4 rounded-md border border-[#E8E6E1] bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4332] text-[#16181D]"
            >
              <option value="OM Kumar">OM Kumar (Developer)</option>
              <option value="Shubham Jain">Shubham Jain (Ad Creative)</option>
              <option value="Ashwin Pillai">Ashwin Pillai (Marketing)</option>
            </select>
          </div>
          <p className="text-[12px] text-[#9498A0]">
            Select your founding partner seat. Your account will automatically bind to your ledger records.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone">Mobile Number</Label>
            {phone && (
              <span className={`text-[11px] font-medium ${phone.length === 10 ? 'text-[#1B4332]' : 'text-[#9498A0]'}`}>
                {phone.length}/10 digits
              </span>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1.5 text-muted-foreground pointer-events-none z-10">
              <Phone className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#16181D] pl-1 border-r border-[#E8E6E1] pr-2">+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(numericOnly);
              }}
              className="pl-20 h-12 tracking-wide font-medium"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
