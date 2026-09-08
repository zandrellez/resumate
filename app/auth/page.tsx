"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";

export default function AuthSwitch() {
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".auth-container");
    if (!container) return;
    if (isSignUp) container.classList.add("sign-up-mode");
    else container.classList.remove("sign-up-mode");
  }, [isSignUp]);

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

        .google-btn {
          width: 100%;
          max-width: 380px;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          height: 40px;
          border-radius: 12px;
          color: #0F172A;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.2s;
          font-size: 0.82rem;
        }

        .google-btn:hover {
          background-color: #F8FAFC;
          border-color: #CBD5E1;
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
              <form className="sign-in-form" onSubmit={(e) => e.preventDefault()}>
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                  <input type="email" placeholder="Email address" />
                </div>
                <div className="input-field">
                  <input type="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn">Sign In</button>
                <div className="divider">or</div>
                <button type="button" className="google-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
              </form>

              {/* Sign Up Form */}
              <form className="sign-up-form" onSubmit={(e) => e.preventDefault()}>
                <h2 className="title">Create account</h2>
                <div className="input-field">
                  <input type="text" placeholder="Username" />
                </div>
                <div className="input-field">
                  <input type="email" placeholder="Email address" />
                </div>
                <div className="input-field">
                  <input type="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn">Create Account</button>
                <div className="divider">or</div>
                <button type="button" className="google-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>
              </form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Sign up to explore all features and manage your workspace efficiently.</p>
                <button className="btn transparent" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </button>
              </div>
            </div>

            <div className="panel right-panel">
              <div className="content">
                <h3>Welcome back</h3>
                <p>Log in to your account to continue where you left off.</p>
                <button className="btn transparent" onClick={() => setIsSignUp(false)}>
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