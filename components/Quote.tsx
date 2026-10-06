import clsx from "clsx";

interface QuoteProps {
  /** Rendered from markdown to inline HTML; safe to drop into `dangerouslySetInnerHTML`. */
  html: string;
  color?: string;
  className?: string;
  align?: "center" | "left";
}

/**
 * A large, bold pull-quote, fit to the width of the page's normal text
 * column, with generous space above and below. Reusable across any page,
 * not tied to a single content type, pass in whatever inline HTML (from
 * `markdownToInlineHtml`) needs the callout treatment.
 */
export function Quote({ html, color, className, align = "center" }: QuoteProps) {
  const isCentered = align === "center";
  return (
    <div className="w-full px-[clamp(20px,2.5vw,40px)] pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/*
        `792px` matches the site's main text column (`max-w-[44em]` at its
        18px font size, 44 * 18, same as `AboutView`'s paired sidebar
        width), in `px` rather than `em` so it doesn't resolve against this
        block's own much larger font size instead.
      */}
      <div className={clsx("max-w-[792px]", isCentered && "mx-auto")}>
        <p
          className={clsx(
            isCentered ? "text-center" : "text-left",
            "text-[26px] leading-[1.25] font-bold italic tracking-[-0.01em] sm:text-[32px] sm:leading-[1.2] [&_sup]:font-normal [&_sup]:not-italic [&_sup]:text-[14px] sm:[&_sup]:text-base",
            className
          )}
          style={color ? { color } : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
