export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          const r=document.documentElement;
          const s=localStorage.getItem("theme");
          const d=window.matchMedia("(prefers-color-scheme: dark)").matches;
          r.classList.toggle("dark",s?s==="dark":d);
        `,
      }}
    />
  );
}
