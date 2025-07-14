import React, { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingCart,
  Search,
  MapPin,
  User,
  Menu,
  Plus,
  Minus,
  Star,
  Clock,
  Truck,
  Zap,
  Facebook,
  Instagram,
  MessageCircle,
  Download,
  Package,
  Edit,
  LogOut,
  ChevronDown,
  ChevronRight,
  Heart,
  Filter
} from "lucide-react";

// Mock data
const dhakaAreas = [
  "Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur",
  "Old Dhaka", "Wari", "Ramna", "Tejgaon", "Panthapath", "Farmgate",
  "Elephant Road", "New Market", "Azimpur", "Lalmatia", "Shyamoli"
];

const categories = [
  { id: 1, name: "Fresh Vegetables", icon: "🥬", color: "bg-green-100" },
  { id: 2, name: "Fresh Fruits", icon: "🍎", color: "bg-red-100" },
  { id: 3, name: "Dairy & Eggs", icon: "🥛", color: "bg-blue-100" },
  { id: 4, name: "Meat & Fish", icon: "🐟", color: "bg-pink-100" },
  { id: 5, name: "Rice & Grains", icon: "🌾", color: "bg-yellow-100" },
  { id: 6, name: "Spices & Oil", icon: "🌶️", color: "bg-orange-100" },
  { id: 7, name: "Snacks & Beverages", icon: "🥤", color: "bg-purple-100" },
  { id: 8, name: "Personal Care", icon: "🧴", color: "bg-teal-100" }
];

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 45,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=300&h=300&fit=crop",
    category: 1,
    rating: 4.5,
    inStock: true,
    discount: 10
  },
  {
    id: 2,
    name: "Red Apples",
    price: 180,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
    category: 2,
    rating: 4.8,
    inStock: true,
    discount: 0
  },
  {
    id: 3,
    name: "Fresh Milk",
    price: 65,
    unit: "per liter",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop",
    category: 3,
    rating: 4.6,
    inStock: true,
    discount: 5
  },
  {
    id: 4,
    name: "Hilsa Fish",
    price: 850,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop",
    category: 4,
    rating: 4.9,
    inStock: true,
    discount: 0
  },
  {
    id: 5,
    name: "Basmati Rice",
    price: 95,
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    category: 5,
    rating: 4.7,
    inStock: true,
    discount: 15
  },
  {
    id: 6,
    name: "Soybean Oil",
    price: 145,
    unit: "per liter",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop",
    category: 6,
    rating: 4.4,
    inStock: true,
    discount: 8
  }
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"normal" | "emergency">("normal");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check for first-time user location
  useEffect(() => {
    const savedLocation = localStorage.getItem("ghatpar-location");
    if (!savedLocation) {
      setIsLocationModalOpen(true);
    } else {
      setSelectedLocation(savedLocation);
    }

    // Check authentication status
    const authStatus = localStorage.getItem("ghatpar-auth");
    if (authStatus) {
      setIsAuthenticated(true);
    }
  }, []);

  const addToCart = (product: any) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        unit: product.unit
      }];
    });
  };

  const updateCartQuantity = (id: number, change: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = deliveryType === "emergency" ? 80 : 30;
    return { subtotal, deliveryCharge, total: subtotal + deliveryCharge };
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    localStorage.setItem("ghatpar-location", location);
    setIsLocationModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductsByCategory = (categoryId: number) => {
    return products.filter(product => product.category === categoryId);
  };

  return (
    <>
      <Head>
        <title>Ghatpar.com - Fresh Groceries Delivered Fast</title>
        <meta name="description" content="Order fresh groceries online in Dhaka. Fast delivery, quality products, best prices." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Top Navbar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-primary hidden sm:block">Ghatpar</span>
              </motion.div>

              {/* Location Selector */}
              <Select value={selectedLocation} onValueChange={handleLocationSelect}>
                <SelectTrigger className="w-32 sm:w-40">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {dhakaAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Categories Dropdown - Hidden on mobile */}
              <Select>
                <SelectTrigger className="w-32 hidden md:flex">
                  <div className="flex items-center gap-1">
                    <Menu className="w-4 h-4" />
                    <span>Categories</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Search Bar */}
              <div className="flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Cart Icon */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 mt-4">
                      {cartItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Your cart is empty
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">৳{item.price} {item.unit}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="w-6 h-6"
                                  onClick={() => updateCartQuantity(item.id, -1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="w-6 h-6"
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    {cartItems.length > 0 && (
                      <div className="border-t pt-4 space-y-4">
                        {/* Delivery Options */}
                        <div>
                          <h4 className="font-medium mb-2">Delivery Options</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={deliveryType === "normal" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setDeliveryType("normal")}
                              className="flex items-center gap-2"
                            >
                              <Truck className="w-4 h-4" />
                              Normal (৳30)
                            </Button>
                            <Button
                              variant={deliveryType === "emergency" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setDeliveryType("emergency")}
                              className="flex items-center gap-2"
                            >
                              <Zap className="w-4 h-4" />
                              Emergency (৳80)
                            </Button>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <h4 className="font-medium mb-2">Delivery Address</h4>
                          <Textarea
                            placeholder="Enter your delivery address..."
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>

                        {/* Special Instructions */}
                        <div>
                          <h4 className="font-medium mb-2">Special Instructions</h4>
                          <Textarea
                            placeholder="Any special requests..."
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            className="min-h-[60px]"
                          />
                        </div>

                        {/* Price Summary */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>৳{getTotalPrice().subtotal}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Delivery:</span>
                            <span>৳{getTotalPrice().deliveryCharge}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span>৳{getTotalPrice().total}</span>
                          </div>
                        </div>

                        <Button className="w-full" size="lg">
                          Place Order
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Profile Icon */}
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Profile Menu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Download className="w-4 h-4" />
                      Install Ghatpar App
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                    <Separator />
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="pt-20 pb-16">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12"
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-primary mb-4"
              >
                Fresh Groceries
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8"
              >
                Delivered to your doorstep in Dhaka
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  30 min delivery
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Fresh quality
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Free delivery over ৳500
                </Badge>
              </motion.div>
            </div>
          </motion.section>

          {/* Categories Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-8"
              >
                Shop by Category
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                  >
                    <Card className="p-4 text-center hover:shadow-lg transition-all">
                      <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <h3 className="font-medium text-sm">{category.name}</h3>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Products by Category */}
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} className="py-8">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="text-xl font-bold flex items-center gap-2"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </motion.h2>
                    <Button variant="ghost" className="text-primary">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {categoryProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-48"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 object-cover"
                            />
                            {product.discount > 0 && (
                              <Badge className="absolute top-2 left-2 bg-secondary">
                                {product.discount}% OFF
                              </Badge>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">{product.rating}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-primary">৳{product.price}</span>
                                <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product)}
                                className="h-8 px-3"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </main>

        {/* Footer */}
        <footer className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-primary">Ghatpar</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fresh groceries delivered fast across Dhaka
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-4">Quick Links</h4>
                <div className="space-y-2 text-sm">
                  <a href="#" className="block text-muted-foreground hover:text-primary">About Us</a>
                  <a href="#" className="block text-muted-foreground hover:text-primary">Contact</a>
                  <a href="#" className="block text-muted-foreground hover:text-primary">Privacy Policy</a>
                  <a href="#" className="block text-muted-foreground hover:text-primary">FAQ</a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Follow Us</h4>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Get the App</h4>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Install Ghatpar App
                </Button>
              </div>
            </div>
            <Separator className="my-8" />
            <div className="text-center text-sm text-muted-foreground">
              © 2024 Ghatpar.com. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Location Selection Modal */}
        <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Your Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please select your area to see available products and delivery options.
              </p>
              <Select onValueChange={handleLocationSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your area" />
                </SelectTrigger>
                <SelectContent>
                  {dhakaAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Authentication Modal */}
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please login or create an account to add items to your cart.
              </p>
              <div className="flex gap-2">
                <Button className="flex-1">Login</Button>
                <Button variant="outline" className="flex-1">Sign Up</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}