import React, { useState } from "react";
import styles from "./AuthView.module.scss";
import LoginForm from "@/modules/AuthModule/LoginForm";
import RegistrationForm from "@/modules/AuthModule/RegistrationForm";

type AuthViewMode = "login" | "register";

const AuthView: React.FC = () => {
  const [viewMode, setViewMode] = useState<AuthViewMode>("login");

  return (
    <main className={styles.authPage}>
      {/* --- 左侧视觉展示区 (无改动) --- */}
      <div className={styles.showcasePanel}>
        <div className={styles.showcaseContent}>
          <div className={styles.logo}>
            <h1>RockNet</h1>
            <p>ARTIFICIAL INTELLIGENCE</p>
          </div>
          <div className={styles.techQuote}>
            <p>"任何足够先进的技术，都与魔法无异。"</p>
            <span>- Arthur C. Clarke</span>
          </div>
        </div>
      </div>
      {/* --- 右侧表单区域 --- */}
      <div className={styles.formPanel}>
        {viewMode === "login" ? (
          <LoginForm onSwitchToRegister={() => setViewMode("register")} />
        ) : (
          <RegistrationForm onSwitchToLogin={() => setViewMode("login")} />
        )}
      </div>
    </main>
  );
};

export default AuthView;
