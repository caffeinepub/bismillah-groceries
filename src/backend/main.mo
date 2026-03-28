import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product management
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    description : Text;
    imageUrl : Text;
    inStock : Bool;
  };

  let products = Map.empty<Nat, Product>();

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  var nextProductId = 1;
  func getNextProductId() : Nat {
    let current = nextProductId;
    nextProductId += 1;
    current;
  };

  public shared ({ caller }) func addProduct(productData : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let newProduct : Product = {
      productData with
      id = getNextProductId();
    };
    products.add(newProduct.id, newProduct);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProduct(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Order management
  type OrderItem = {
    productId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    phone : Text;
    deliveryAddress : Text;
    items : [OrderItem];
    totalAmount : Nat;
    status : Text;
    createdAt : Int;
  };

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  func getNextOrderId() : Nat {
    let current = nextOrderId;
    nextOrderId += 1;
    current;
  };

  type PlaceOrderRequest = {
    customerName : Text;
    phone : Text;
    deliveryAddress : Text;
    items : [OrderItem];
  };

  public shared ({ caller }) func placeOrder(request : PlaceOrderRequest) : async Nat {
    let totalAmount = request.items.foldLeft(0, func(acc, item) { acc + getProductPrice(item.productId) * item.quantity });

    let order : Order = {
      id = getNextOrderId();
      customerName = request.customerName;
      phone = request.phone;
      deliveryAddress = request.deliveryAddress;
      items = request.items;
      totalAmount;
      status = "Pending";
      createdAt = Time.now();
    };

    orders.add(order.id, order);
    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = {
          order with status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func listOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list orders");
    };
    orders.values().toArray();
  };

  func getProductPrice(productId : Nat) : Nat {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product.price };
    };
  };
};
