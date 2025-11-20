import React, { useState } from "react";
import styles from "./AuthView.module.scss";

// 确保这里的路径与您的项目结构完全匹配
import LoginForm from "@/modules/AuthModule/LoginForm";
import RegistrationForm from "@/modules/AuthModule/RegistrationForm";

// 定义视图类型的别名
type AuthViewMode = "login" | "register";

// 1. 定义 props 接口，用于接收从 App.tsx 传来的登录成功回调函数
interface AuthViewProps {
  // onLoginSuccess: () => void;
}

const AuthView: React.FC = () => {
  const [viewMode, setViewMode] = useState<AuthViewMode>("login");

  return (
    <main className={styles.authPage}>
      {/* --- 左侧视觉展示区 (无改动) --- */}
      <div className={styles.showcasePanel}>
        <div className={styles.showcaseContent}>
          <div className={styles.logo}>
            <h1>GEMINI</h1>
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
          <LoginForm
            onSwitchToRegister={() => setViewMode("register")}
            // 2. 将登录成功的回调函数传递给 LoginForm 组件
            // onLoginSuccess={onLoginSuccess}
          />
        ) : (
          <RegistrationForm onSwitchToLogin={() => setViewMode("login")} />
        )}
      </div>
    </main>
  );
};

export default AuthView;
