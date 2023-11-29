import { HTMLAttributes } from "react";
import cn from "classnames";

export default function Button(props: HTMLAttributes<HTMLDivElement>) {
  const { className, style, ...rest } = props;
  return (
    <div
      className={cn(
        "text-style-interactive-button text-black py-1 px-[0.4375rem] rounded-[0.1875rem]",
        className
      )}
      style={{
        // backgroundColor: generateAccentColor(),
        ...style,
      }}
      {...rest}
    />
  );
}
