import { HTMLAttributes } from "react";
import classNames from "classnames";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {}

export default function Section({
  children,
  className,
  ...rest
}: SectionProps) {
  return (
    <section className={classNames("section w-full", className)} {...rest}>
      <div className="container">{children}</div>
    </section>
  );
}
