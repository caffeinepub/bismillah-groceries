import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { CATEGORY_CONFIG } from "../data/sampleProducts";
import { usePlaceOrder } from "../hooks/useQueries";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [addressErr, setAddressErr] = useState("");

  const placeOrder = usePlaceOrder();

  const validate = () => {
    let valid = true;
    setNameErr("");
    setPhoneErr("");
    setAddressErr("");
    if (!name.trim()) {
      setNameErr("Name is required");
      valid = false;
    }
    if (!phone.trim()) {
      setPhoneErr("Phone is required");
      valid = false;
    }
    if (!address.trim()) {
      setAddressErr("Address is required");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await placeOrder.mutateAsync({
        customerName: name,
        phone,
        deliveryAddress: address,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: BigInt(i.quantity),
        })),
      });
      clearCart();
      setSuccess(true);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main
          className="flex-1 flex items-center justify-center px-4"
          data-ocid="checkout.success_state"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16 max-w-sm"
          >
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
              Order Placed!
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {name}! Your groceries will be delivered soon.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              data-ocid="checkout.primary_button"
            >
              Back to Shopping
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-6">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form */}
          <div className="flex-1">
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-xl p-6 space-y-4"
            >
              <h2 className="font-heading font-semibold text-base text-foreground mb-2">
                Delivery Details
              </h2>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="mt-1"
                  data-ocid="checkout.input"
                />
                {nameErr && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {nameErr}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className="mt-1"
                  data-ocid="checkout.input"
                />
                {phoneErr && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {phoneErr}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, area, city..."
                  className="mt-1"
                  rows={3}
                  data-ocid="checkout.textarea"
                />
                {addressErr && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {addressErr}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={placeOrder.isPending}
                data-ocid="checkout.submit_button"
              >
                {placeOrder.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm Order
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-heading font-bold text-base text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-2">
                {items.map((item) => {
                  const cfg = CATEGORY_CONFIG[item.product.category] ?? {
                    emoji: "🛒",
                    color: "#F5F5F5",
                  };
                  return (
                    <div
                      key={item.product.id.toString()}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-lg">{cfg.emoji}</span>
                      <span className="flex-1 text-muted-foreground line-clamp-1">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        PKR{" "}
                        {(
                          item.product.price * BigInt(item.quantity)
                        ).toString()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-heading font-bold text-foreground">
                <span>Total</span>
                <span>PKR {totalAmount.toString()}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
