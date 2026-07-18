"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface Product {
  _id?: string;
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  specifications: Record<string, string>;
}

interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

interface FavoriteItem {
  _id?: string;
  id?: string;
  email: string;
  productId: string;
  product?: Product;
}

interface AppContextType {
  cart: CartItem[];
  favorites: FavoriteItem[];
  isLoadingCart: boolean;
  isLoadingFavs: boolean;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  checkout: (shippingAddress: string, paymentMethod: string) => Promise<boolean>;
  refreshCartAndFavs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingFavs, setIsLoadingFavs] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  // Fetch Cart and Favorites when user session changes or refresh trigger changes
  useEffect(() => {
    const fetchCartAndFavs = async () => {
      if (!user) {
        setCart([]);
        setFavorites([]);
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Get session token to pass to Express backend
      const sessionToken = localStorage.getItem("better-auth.session_token") || "";
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      }

      setIsLoadingCart(true);
      setIsLoadingFavs(true);

      try {
        // Fetch cart
        const cartRes = await fetch(`${BASE_URL}/api/cart?email=${encodeURIComponent(user.email)}`, { headers });
        const cartContentType = cartRes.headers.get("content-type");
        if (cartContentType && cartContentType.includes("application/json")) {
          const cartData = await cartRes.json();
          if (cartData.success) {
            setCart(cartData.cart || cartData.items || []);
          }
        } else {
          console.error("Cart response was not JSON:", await cartRes.text());
        }

        // Fetch favorites
        const favsRes = await fetch(`${BASE_URL}/api/favorites?email=${encodeURIComponent(user.email)}`, { headers });
        const favsContentType = favsRes.headers.get("content-type");
        if (favsContentType && favsContentType.includes("application/json")) {
          const favsData = await favsRes.json();
          if (favsData.success) {
            setFavorites(favsData.favorites || []);
          }
        } else {
          console.error("Favorites response was not JSON:", await favsRes.text());
        }
      } catch (err) {
        console.error("Error fetching cart/favs:", err);
      } finally {
        setIsLoadingCart(false);
        setIsLoadingFavs(false);
      }
    };

    fetchCartAndFavs();
  }, [user, refreshTrigger, BASE_URL]);

  const refreshCartAndFavs = () => setRefreshTrigger(prev => prev + 1);

  const addToCart = async (productId: string, qty = 1) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }
    const sessionToken = localStorage.getItem("better-auth.session_token") || "";
    try {
      const response = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ email: user.email, productId, quantity: qty })
      });
      const data = await response.json();
      if (data.success) {
        refreshCartAndFavs();
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    const sessionToken = localStorage.getItem("better-auth.session_token") || "";
    try {
      const response = await fetch(`${BASE_URL}/api/cart/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        refreshCartAndFavs();
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const sessionToken = localStorage.getItem("better-auth.session_token") || "";
    try {
      await fetch(`${BASE_URL}/api/cart?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      });
      refreshCartAndFavs();
    } catch (error) {
      console.error("Clear cart error:", error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage favorites.");
      return;
    }
    const sessionToken = localStorage.getItem("better-auth.session_token") || "";
    try {
      const response = await fetch(`${BASE_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ email: user.email, productId })
      });
      const data = await response.json();
      if (data.success) {
        if (data.isFavorite) {
          toast.success("Added to Favourite");
        } else {
          toast.success("Removed from Favourite");
        }
        refreshCartAndFavs();
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.productId === productId || fav.product?._id === productId || fav.product?.id === productId);
  };

  const checkout = async (shippingAddress: string, paymentMethod: string) => {
    if (!user || cart.length === 0) return false;
    const sessionToken = localStorage.getItem("better-auth.session_token") || "";

    const totalAmount = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const orderItems = cart.map(item => ({
      productId: item.productId,
      title: item.product?.title || "",
      price: item.product?.price || 0,
      quantity: item.quantity,
      image: item.product?.image || ""
    }));

    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount,
          shippingAddress,
          paymentMethod
        })
      });
      const data = await response.json();
      if (data.success) {
        refreshCartAndFavs();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Checkout error:", error);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        isLoadingCart,
        isLoadingFavs,
        addToCart,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        checkout,
        refreshCartAndFavs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
