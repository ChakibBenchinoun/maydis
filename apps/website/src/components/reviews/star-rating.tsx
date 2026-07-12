import { Star } from "lucide-react";

export function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="text-primary fill-primary" />
      ))}
    </div>
  );
}
