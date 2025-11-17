import { useState, useEffect } from "react";

// 1. 将函数签名修改为泛型，以接受任何 HTMLElement 的子类型 (如 HTMLDivElement)
//    这使得 Hook 更具通用性和类型安全性
export const useMousePosition = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 2. 这里的 ref.current 类型现在是 T | null，这是正确的
    const element = ref.current;

    // 3. 这个空值检查现在不仅是好的实践，而且是 TypeScript 类型检查所必需的
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setPosition({ x, y });
    };

    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      // 确保在组件卸载时移除监听器
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref]); // 依赖项是 ref 对象本身

  return position;
};
