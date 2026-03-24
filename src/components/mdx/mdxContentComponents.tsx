import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import { slugifyHeading } from "@/lib/headings";

function plainTextFromChildren(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainTextFromChildren).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children != null) {
      return plainTextFromChildren(props.children);
    }
  }
  return "";
}

export const mdxContentComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => {
    const { children, id, ...rest } = props;
    void id;
    return (
      <h2 id={slugifyHeading(plainTextFromChildren(children))} {...rest}>
        {children}
      </h2>
    );
  },
  h3: (props: ComponentPropsWithoutRef<"h3">) => {
    const { children, id, ...rest } = props;
    void id;
    return (
      <h3 id={slugifyHeading(plainTextFromChildren(children))} {...rest}>
        {children}
      </h3>
    );
  },
};
