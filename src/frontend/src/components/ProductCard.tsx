import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";
import { CATEGORY_CONFIG } from "../data/sampleProducts";

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const catConfig = CATEGORY_CONFIG[product.category] ?? {
    emoji: "🛒",
    color: "#F5F5F5",
  };
  const stars = 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div
        className="w-full h-36 flex items-center justify-center text-5xl relative"
        style={{ backgroundColor: catConfig.color }}
      >
        <span>{catConfig.emoji}</span>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1">
          <Badge
            variant="outline"
            className="text-xs text-primary border-primary/30 mb-1"
          >
            {product.category}
          </Badge>
          <h3 className="font-heading font-semibold text-sm text-foreground leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-0.5 my-1.5">
          {STAR_KEYS.map((k, i) => (
            <Star
              key={k}
              className="w-3 h-3"
              style={{
                fill: i < stars ? "oklch(var(--star-gold))" : "none",
                color: "oklch(var(--star-gold))",
              }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-heading font-bold text-base text-foreground">
            PKR {product.price.toString()}
          </span>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="h-8 text-xs gap-1"
            data-ocid="product.button"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
