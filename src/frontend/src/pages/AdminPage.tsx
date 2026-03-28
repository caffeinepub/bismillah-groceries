import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  ClipboardList,
  Edit2,
  Loader2,
  LogIn,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Order, Product } from "../backend.d";
import {
  ALL_CATEGORIES,
  CATEGORY_CONFIG,
  SAMPLE_PRODUCTS,
} from "../data/sampleProducts";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useInitializeUser,
  useIsAdmin,
  useListOrders,
  useListProducts,
  useUpdateOrderStatus,
  useUpdateProduct,
} from "../hooks/useQueries";

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  category: "Dairy",
  description: "",
  price: 0n,
  imageUrl: "",
  inStock: true,
};

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminPage() {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const qc = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";
  const isLoggedIn = !!identity;

  const { data: backendProducts } = useListProducts();
  const { data: orders, isLoading: ordersLoading } = useListOrders();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const initializeUser = useInitializeUser();
  const initCalledRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once when actor is ready
  useEffect(() => {
    if (isLoggedIn && actor && !initCalledRef.current) {
      initCalledRef.current = true;
      initializeUser
        .mutateAsync()
        .catch(() => {
          // ignore — may already be initialized
        })
        .finally(() => {
          qc.invalidateQueries({ queryKey: ["isAdmin"] });
        });
    }
  }, [isLoggedIn, actor]);

  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SAMPLE_PRODUCTS;

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [priceStr, setPriceStr] = useState("0");
  const [deleteDialogId, setDeleteDialogId] = useState<bigint | null>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setPriceStr("0");
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      inStock: p.inStock,
    });
    setPriceStr(p.price.toString());
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const product: Product = {
      ...form,
      id: editingProduct?.id ?? 0n,
      price: BigInt(priceStr || "0"),
    };
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(product);
        toast.success("Product updated");
      } else {
        await addProduct.mutateAsync(product);
        toast.success("Product added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
      setDeleteDialogId(null);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleStatusChange = async (order: Order, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId: order.id, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-card"
          data-ocid="admin.card"
        >
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold text-2xl mx-auto mb-4">
            B
          </div>
          <h1 className="font-heading font-bold text-xl text-foreground mb-1">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Bismillah Groceries Management
          </p>
          <Button
            className="w-full gap-2"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="admin.primary_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Logging in…" : "Login to Continue"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Initializing / checking admin status
  if (initializeUser.isPending || isAdminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Setting up your account…
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center" data-ocid="admin.error_state">
          <p className="text-muted-foreground mb-4">
            You don't have admin access.
          </p>
          <Button variant="outline" onClick={clear}>
            Log out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold">
              B
            </div>
            <div>
              <span className="font-heading font-bold text-foreground text-sm">
                Bismillah Groceries
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Admin
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            data-ocid="admin.secondary_button"
          >
            Log out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" data-ocid="admin.tab">
          <TabsList className="mb-6">
            <TabsTrigger
              value="products"
              className="gap-2"
              data-ocid="admin.tab"
            >
              <Package className="w-4 h-4" /> Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2" data-ocid="admin.tab">
              <ClipboardList className="w-4 h-4" /> Orders
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">
                Products
              </h2>
              <Button
                onClick={openAdd}
                className="gap-2"
                data-ocid="admin.primary_button"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>

            <div
              className="bg-card border border-border rounded-xl overflow-hidden"
              data-ocid="admin.table"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProducts.map((p, idx) => {
                    const cfg = CATEGORY_CONFIG[p.category] ?? {
                      emoji: "🛒",
                      color: "#F5F5F5",
                    };
                    return (
                      <TableRow
                        key={p.id.toString()}
                        data-ocid={`admin.row.${idx + 1}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cfg.emoji}</span>
                            <div>
                              <div className="font-medium text-sm text-foreground">
                                {p.name}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {p.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          PKR {p.price.toString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={p.inStock ? "default" : "secondary"}
                            className={
                              p.inStock
                                ? "bg-primary/10 text-primary border-primary/30"
                                : ""
                            }
                          >
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(p)}
                              data-ocid={`admin.edit_button.${idx + 1}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteDialogId(p.id)}
                              data-ocid={`admin.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              Orders
            </h2>
            {ordersLoading ? (
              <div
                className="text-center py-12"
                data-ocid="admin.loading_state"
              >
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.empty_state"
              >
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div
                className="bg-card border border-border rounded-xl overflow-hidden"
                data-ocid="admin.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, idx) => (
                      <TableRow
                        key={order.id.toString()}
                        data-ocid={`admin.row.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {order.deliveryAddress}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{order.phone}</TableCell>
                        <TableCell className="font-medium">
                          PKR {order.totalAmount.toString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : order.status === "Cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              order.status === "Delivered"
                                ? "bg-primary/10 text-primary border-primary/30"
                                : ""
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order, v)}
                          >
                            <SelectTrigger
                              className="w-40 h-8 text-xs"
                              data-ocid={`admin.select.${idx + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ORDER_STATUSES.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="text-xs"
                                >
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Olpers Full Cream Milk"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="mt-1" data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description..."
                className="mt-1"
                rows={2}
                data-ocid="admin.textarea"
              />
            </div>
            <div>
              <Label>Price (PKR)</Label>
              <Input
                type="number"
                value={priceStr}
                onChange={(e) => setPriceStr(e.target.value)}
                placeholder="0"
                className="mt-1"
                data-ocid="admin.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.inStock}
                onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: v }))}
                data-ocid="admin.switch"
              />
              <Label>In Stock</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addProduct.isPending || updateProduct.isPending}
              data-ocid="admin.save_button"
            >
              {(addProduct.isPending || updateProduct.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingProduct ? "Update" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteDialogId}
        onOpenChange={(o) => !o && setDeleteDialogId(null)}
      >
        <DialogContent data-ocid="admin.dialog">
          <DialogHeader>
            <DialogTitle className="font-heading">Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogId(null)}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogId && handleDelete(deleteDialogId)}
              disabled={deleteProduct.isPending}
              data-ocid="admin.confirm_button"
            >
              {deleteProduct.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
