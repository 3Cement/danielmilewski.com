import Script from "next/script";

export function ThemeInitializer() {
  return (
    <Script
      id="theme-initializer"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          const r=document.documentElement;
          const s=localStorage.getItem("theme");
          const d=window.matchMedia("(prefers-color-scheme: dark)").matches;
          const t=s==="light"||s==="dark"?s:(d?"dark":"light");
          r.classList.toggle("dark",t==="dark");
          document.cookie="theme="+t+"; Path=/; Max-Age=31536000; SameSite=Lax";
        `,
      }}
    />
  );
}
