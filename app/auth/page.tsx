"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Initialize Supabase Client (Ensure these are defined in your .env.local file)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthSwitch() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    const container = document.querySelector(".auth-container");
    if (!container) return;
    if (isSignUp) container.classList.add("sign-up-mode");
    else container.classList.remove("sign-up-mode");
  }, [isSignUp]);

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      router.push("/"); // Redirect to your app dashboard after login
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: {
          full_name: signUpName, // Triggers database handle_new_user function to fill profiles table
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      alert("Registration successful! Check your email for confirmation if required, or sign in.");
      setIsSignUp(false);
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .auth-wrapper {
          background: #F8FAFC;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          padding: 20px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .auth-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 550px;
          background: #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 4rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        form.sign-in-form {
          z-index: 2;
        }

        .title {
          font-size: 1.8rem;
          color: #0F172A;
          margin-bottom: 0.75rem;
          font-weight: 800;
        }

        .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #F8FAFC;
          margin: 6px 0;
          height: 44px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          transition: 0.2s;
        }

        .input-field:focus-within {
          border-color: #0D9488;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
        }

        .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 400;
          font-size: 0.9rem;
          color: #0F172A;
          width: 100%;
        }

        .input-field input::placeholder {
          color: #94A3B8;
        }

        .btn {
          width: 100%;
          max-width: 380px;
          background-color: #0D9488;
          border: none;
          outline: none;
          height: 42px;
          border-radius: 12px;
          color: #FFFFFF;
          font-weight: 600;
          margin: 10px 0 6px 0;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.85rem;
        }

        .btn:hover {
          background-color: #0F766E;
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #FFFFFF;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .panel h3 {
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: #FFFFFF;
        }

        .panel p {
          font-size: 0.85rem;
          padding: 0.4rem 0;
          color: #E2E8F0;
        }

        .btn.transparent {
          margin: 0;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          width: 120px;
          height: 38px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.75rem;
          color: #FFFFFF;
        }

        .btn.transparent:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #FFFFFF;
        }

        .right-panel .content {
          transform: translateX(800px);
        }

        .auth-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .auth-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .auth-container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .auth-container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .auth-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .auth-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        .auth-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: #0F172A;
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .divider {
          padding: 0.3rem 0;
          font-size: 0.75rem;
          color: #94A3B8;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 380px;
          text-align: center;
          margin: 2px 0;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #E2E8F0;
        }

        .divider::before {
          margin-right: .75em;
        }

        .divider::after {
          margin-left: .75em;
        }

        .error-banner {
          color: #EF4444;
          font-size: 0.75rem;
          margin-bottom: 8px;
          text-align: center;
        }
      `}</style>

      <div className="auth-wrapper">
        <Link href="/" className="absolute top-6 left-6 z-50 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#0F172A] transition flex items-center gap-1.5">
          <span>←</span> Back to home
        </Link>

        <div className="auth-container">
          <div className="forms-container">
            <div className="signin-signup">
              
              {/* Sign In Form */}
              <form className="sign-in-form" onSubmit={handleSignIn}>
                <h2 className="title">Sign in</h2>
                {errorMessage && <div className="error-banner">{errorMessage}</div>}
                
                <div className="input-field">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={signInEmail} 
                    onChange={(e) => setSignInEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-field">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={signInPassword} 
                    onChange={(e) => setSignInPassword(e.target.value)} 
                    required 
                  />
                </div>
                
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Sign Up Form */}
              <form className="sign-up-form" onSubmit={handleSignUp}>
                <h2 className="title">Create account</h2>
                {errorMessage && <div className="error-banner">{errorMessage}</div>}

                <div className="input-field">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={signUpName} 
                    onChange={(e) => setSignUpName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-field">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={signUpEmail} 
                    onChange={(e) => setSignUpEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-field">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={signUpPassword} 
                    onChange={(e) => setSignUpPassword(e.target.value)} 
                    required 
                  />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </form>

            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Sign up to explore all features and manage your workspace efficiently.</p>
                <button type="button" className="btn transparent" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </button>
              </div>
            </div>

            <div className="panel right-panel">
              <div className="content">
                <h3>Welcome back</h3>
                <p>Log in to your account to continue where you left off.</p>
                <button type="button" className="btn transparent" onClick={() => setIsSignUp(false)}>
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}