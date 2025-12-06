import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export function H1(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={clsx("scroll-m-20 text-2xl font-extrabold tracking-tight text-balance", props.className)}
    />
  );
}

export function H2(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={clsx("scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0", props.className)}
    />
  );
}

export function H3(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return <h3 {...props} className={clsx("scroll-m-20 text-lg font-semibold tracking-tight", props.className)} />;
}

export function H4(props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return <h4 {...props} className={clsx("scroll-m-20 text-base font-semibold tracking-tight", props.className)} />;
}

export function P(props: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) {
  return <p {...props} className={clsx("leading-7 [&:not(:first-child)]:mt-6", props.className)} />;
}
