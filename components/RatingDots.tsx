import { cn } from "@/lib/utils";

/**
 * Ratings are rendered as filled circles (never stars), per the Aaron Works
 * design language. 5 dots, each full, half or empty based on the score.
 */
export default function RatingDots({
  rating,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  const dots = Array.from({ length: 5 }, (_, index) => {
    const position = index + 1;
    if (rounded >= position) return "on";
    if (rounded >= position - 0.5) return "half";
    return "off";
  });

  return (
    <span
      className={cn("aw-rating", className)}
      style={size === "sm" ? { fontSize: 10.5 } : undefined}
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <span className="aw-dots" aria-hidden="true">
        {dots.map((state, index) => (
          <i
            key={index}
            className={state === "on" ? "is-on" : state === "half" ? "is-half" : undefined}
            style={size === "sm" ? { width: 7, height: 7, borderWidth: 1 } : undefined}
          />
        ))}
      </span>
      {showValue ? <span>{rating.toFixed(1)}</span> : null}
      {typeof reviewCount === "number" ? (
        <span style={{ fontWeight: 500 }}>({reviewCount})</span>
      ) : null}
    </span>
  );
}
