import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onSearchChange?: (q: string) => void;
  searchValue?: string;
}

export default function Header({
  onSearchChange,
  searchValue = "",
}: HeaderProps) {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearch = (val: string) => {
    setLocalSearch(val);
    onSearchChange?.(val);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-xl">
            B
          </div>
          <div className="hidden sm:block">
            <div className="font-heading font-bold text-foreground text-base leading-tight">
              Bismillah
            </div>
            <div className="font-heading text-xs text-muted-foreground leading-tight">
              Groceries
            </div>
          </div>
        </Link>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="header.search_input"
              placeholder="Search groceries…"
              className="pl-9 bg-background border-border"
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin"
            className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted transition-colors"
            data-ocid="nav.link"
          >
            <User className="w-4 h-4" />
            <span>Account</span>
          </Link>
          <Link
            to="/cart"
            className="relative flex items-center gap-1 text-sm font-medium text-white bg-primary px-3 py-2 rounded-md hover:bg-primary/90 transition-colors"
            data-ocid="cart.link"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-amber-500 hover:bg-amber-500 border-0">
                {totalItems}
              </Badge>
            )}
          </Link>
        </div>
      </div>

      <nav className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-2">
            {[
              { label: "Home", to: "/" },
              { label: "Dairy 🥛", to: "/" },
              { label: "Household 🏠", to: "/" },
              { label: "Fruits 🍎", to: "/" },
              { label: "Beverages 🥤", to: "/" },
              { label: "Snacks 🍿", to: "/" },
              { label: "Offers", to: "/" },
            ].map((link) => (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => navigate({ to: link.to })}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
