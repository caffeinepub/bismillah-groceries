import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer
      style={{ backgroundColor: "oklch(var(--footer-bg))" }}
      className="text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-white">
                B
              </div>
              <div>
                <div className="font-heading font-bold text-sm">
                  Bismillah Groceries
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Fresh groceries delivered to your door with care and quality you
              can trust.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4 text-white/90">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                "Dairy Products",
                "Household Items",
                "Fresh Fruits",
                "Beverages",
                "Snacks",
              ].map((item) => (
                <li key={item}>
                  <a href="/" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4 text-white/90">
              Customer Service
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              {["Track Your Order", "Return Policy", "FAQ", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <a href="/" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4 text-white/90">
              Connect
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <span className="cursor-default">📘 Facebook</span>
              </li>
              <li>
                <span className="cursor-default">📸 Instagram</span>
              </li>
              <li>
                <span className="cursor-default">💬 WhatsApp</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <span>
            © {year}. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-400 fill-red-400" /> using{" "}
            <a
              href={utmLink}
              className="underline hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </span>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white/10 rounded text-white/80">
              💳 Cash on Delivery
            </span>
            <span className="px-2 py-1 bg-white/10 rounded text-white/80">
              🏦 Bank Transfer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
