import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/** Matches navbar width: `max-w-7xl` + `px-6 md:px-10`. */
const containerClassName = "mx-auto w-full max-w-7xl px-6 md:px-10";

type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Site content width — same horizontal bounds as the navbar.
 * Use inside sections for vertical padding / backgrounds only on the outer `<section>`.
 */
export function Container<T extends ElementType = "div">({
  as,
  className = "",
  children,
  ...props
}: ContainerProps<T>) {
  const Comp = (as ?? "div") as ElementType;
  return (
    <Comp className={`${containerClassName}${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </Comp>
  );
}

export { containerClassName };
