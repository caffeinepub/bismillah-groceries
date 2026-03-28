import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { CATEGORY_CONFIG } from "../data/sampleProducts";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } =
    useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-6">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some fresh groceries to get started!
            </p>
            <Button asChild data-ocid="cart.primary_button">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-3" data-ocid="cart.list">
              <AnimatePresence>
                {items.map((item, idx) => {
                  const cfg = CATEGORY_CONFIG[item.product.category] ?? {
                    emoji: "🛒",
                    color: "#F5F5F5",
                  };
                  return (
                    <motion.div
                      key={item.product.id.toString()}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                      data-ocid={`cart.item.${idx + 1}`}
                    >
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl shrink-0"
                        style={{ backgroundColor: cfg.color }}
                      >
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.product.category}
                        </p>
                        <p className="font-heading font-bold text-primary mt-1">
                          PKR {item.product.price.toString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          data-ocid={`cart.secondary_button.${idx + 1}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          data-ocid={`cart.secondary_button.${idx + 1}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-heading font-bold text-sm w-20 text-right">
                        PKR{" "}
                        {(
                          item.product.price * BigInt(item.quantity)
                        ).toString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="w-full lg:w-72 shrink-0">
              <div className="bg-card border border-border rounded-xl p-5 sticky top-36">
                <h2 className="font-heading font-bold text-base text-foreground mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items ({totalItems})</span>
                    <span>PKR {totalAmount.toString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-primary font-medium">Free</span>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-heading font-bold text-foreground">
                  <span>Total</span>
                  <span>PKR {totalAmount.toString()}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  asChild
                  data-ocid="cart.primary_button"
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  asChild
                  data-ocid="cart.secondary_button"
                >
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
