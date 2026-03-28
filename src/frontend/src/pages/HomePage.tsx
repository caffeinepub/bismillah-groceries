import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, Clock, ShieldCheck, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "../backend.d";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {
  ALL_CATEGORIES,
  CATEGORY_CONFIG,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";
import { useListProducts } from "../hooks/useQueries";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [organicOnly, setOrganicOnly] = useState(false);

  const { data: backendProducts } = useListProducts();

  const allProducts: Product[] = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) return backendProducts;
    return SAMPLE_PRODUCTS;
  }, [backendProducts]);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, activeCategory, search]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearchChange={setSearch} searchValue={search} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div
            className="relative rounded-2xl overflow-hidden h-64 sm:h-80"
            style={{
              backgroundImage:
                "url(/assets/generated/hero-groceries.dim_1200x500.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-amber-300 text-sm font-medium mb-2 font-heading">
                  🌿 Fresh &amp; Organic
                </p>
                <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-tight mb-3">
                  Fresh Groceries
                  <br />
                  Delivered to Your Door
                </h1>
                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-md">
                  Quality products, best prices, right to your doorstep in
                  Karachi.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                    asChild
                    data-ocid="hero.primary_button"
                  >
                    <a href="#shop">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm"
                    data-ocid="hero.secondary_button"
                  >
                    View Offers
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="max-w-7xl mx-auto px-4 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: Truck,
                label: "Free Delivery",
                sub: "Orders above PKR 1000",
              },
              {
                icon: ShieldCheck,
                label: "Quality Assured",
                sub: "100% fresh products",
              },
              { icon: Clock, label: "Same Day", sub: "Order before 2pm" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="bg-card rounded-xl p-3 border border-border text-center shadow-xs"
              >
                <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xs font-heading font-semibold text-foreground">
                  {label}
                </div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-secondary">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-center font-heading font-bold text-2xl text-foreground mb-6">
              Our Product Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
                <motion.button
                  key={cat}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl w-24 transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-md"
                      : "bg-card border border-border hover:border-primary/40 hover:shadow-xs"
                  }`}
                  data-ocid="category.button"
                >
                  <span className="text-3xl">{cfg.emoji}</span>
                  <span className="text-xs font-heading font-semibold">
                    {cat}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Listing */}
        <section id="shop" className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-6 text-center">
            Shop Our Fresh Range
          </h2>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-56 shrink-0">
              <div className="bg-card border border-border rounded-xl p-4 sticky top-36">
                <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
                  Category Filters
                </h3>
                <ul className="space-y-1">
                  {ALL_CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === cat
                            ? "bg-primary text-white font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        data-ocid="filter.button"
                      >
                        {cat === "All" ? "All Products" : cat}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border mt-4 pt-4">
                  <h3 className="font-heading font-semibold text-sm text-foreground mb-3">
                    Options
                  </h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="organic"
                      checked={organicOnly}
                      onCheckedChange={(v) => setOrganicOnly(!!v)}
                      data-ocid="filter.checkbox"
                    />
                    <Label htmlFor="organic" className="text-sm cursor-pointer">
                      Organic Only
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox id="instock" data-ocid="filter.checkbox" />
                    <Label htmlFor="instock" className="text-sm cursor-pointer">
                      In Stock Only
                    </Label>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {filtered.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="products.empty_state"
                >
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="font-heading font-medium">No products found</p>
                  <p className="text-sm mt-1">
                    Try a different search or category
                  </p>
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                  data-ocid="products.list"
                >
                  {filtered.map((product, i) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
