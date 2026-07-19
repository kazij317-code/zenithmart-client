"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/context/AuthContext";
import { Package, Tag, DollarSign, List, FileText, Image, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddItem() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [stock, setStock] = useState("10");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");

  const [specs, setSpecs] = useState([
    { key: "Display", value: "Full-Color Micro OLED AR Display" },
    { key: "AI Processor", value: "Zenith Neural AI Chip" },
    { key: "Connectivity", value: "Bluetooth 5.4 & Wi-Fi 6" },
    { key: "Camera", value: "Dual 12MP Cameras" },
    { key: "Battery Life", value: "Up to 12 Hours" },
    { key: "Charging", value: "USB-C Fast Charging" },
    { key: "Audio", value: "Open-Ear Stereo Speakers" },
    { key: "Microphone", value: "AI Noise Cancellation" },
    { key: "Water Resistance", value: "IP54" },
    { key: "Frame Material", value: "Aerospace-Grade Aluminum" },
    { key: "Weight", value: "72g" },
    { key: "Compatibility", value: "Android & iOS" },
    { key: "Voice Assistant", value: "Built-in Zenith AI Assistant" },
    { key: "Color", value: "Matte Black" },
    { key: "Warranty", value: "1 Year Limited Warranty" }
  ]);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const handleAutofill = () => {
    setTitle("Zenith Predator X Gaming Laptop");
    setShortDescription("High-performance gaming laptop featuring Intel Core Ultra 9 processor, RTX 5080 graphics, and a stunning 240Hz QHD display.");
    setFullDescription("The Zenith Predator X Gaming Laptop is designed for gamers, developers, and creators who demand exceptional performance. Equipped with cutting-edge hardware, advanced cooling technology, AI-powered performance optimization, and long battery life, it delivers an immersive gaming and productivity experience.");
    setPrice("1899");
    setCategory("Computers");
    setStock("15");
    setImage("https://images.unsplash.com/photo-1496181133206-80ce9b88a853");
    setImage2("https://images.unsplash.com/photo-1517336714739-489689fd1ca8");
    setImage3("https://images.unsplash.com/photo-1517694712202-14dd9538aa97");
    setSpecs([
      { key: "Display", value: "16-inch QHD 240Hz IPS" },
      { key: "Processor", value: "Intel Core Ultra 9" },
      { key: "Graphics", value: "NVIDIA RTX 5080 16GB" },
      { key: "RAM", value: "32GB DDR5" },
      { key: "Storage", value: "2TB NVMe SSD" },
      { key: "Battery", value: "Up to 12 Hours" },
      { key: "Keyboard", value: "Per-Key RGB Mechanical" },
      { key: "Operating System", value: "Windows 11 Pro" },
      { key: "Connectivity", value: "Wi-Fi 7 & Bluetooth 5.4" },
      { key: "Ports", value: "Thunderbolt 4, HDMI 2.1, USB-C" },
      { key: "Weight", value: "2.2kg" },
      { key: "Warranty", value: "2 Years" }
    ]);
  };

  const parseAIData = (text: string) => {
    if (!text) return;

    const lines = text.split("\n");
    let currentField = "";
    
    let tempTitle = "";
    let tempPrice = "";
    let tempCategory = "Electronics";
    let tempStock = "10";
    let tempShortDesc = "";
    let tempFullDesc = "";
    let tempImages: string[] = [];
    const parsedSpecs: { key: string; value: string }[] = [];

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      const lowerLine = cleanLine.toLowerCase();
      
      // Check for standalone header tags
      if (lowerLine === "short description:" || lowerLine === "short desc:" || lowerLine === "summary:") {
        currentField = "short_desc";
        return;
      }
      if (lowerLine === "full description:" || lowerLine === "description:" || lowerLine === "details:" || lowerLine === "full specifications description:") {
        currentField = "full_desc";
        return;
      }
      if (lowerLine === "images:" || lowerLine === "image url:" || lowerLine === "image urls:") {
        currentField = "images";
        return;
      }
      if (lowerLine === "specifications:" || lowerLine === "specs:") {
        currentField = "specifications";
        return;
      }

      // Check inline fields
      if (lowerLine.startsWith("title:") || lowerLine.startsWith("name:") || lowerLine.startsWith("product title:")) {
        currentField = "";
        const val = cleanLine.substring(cleanLine.indexOf(":") + 1).trim();
        if (val) tempTitle = val;
        return;
      }
      if (lowerLine.startsWith("price:") || lowerLine.startsWith("cost:")) {
        currentField = "";
        const val = cleanLine.substring(cleanLine.indexOf(":") + 1).trim();
        if (val) tempPrice = val.replace(/[^0-9.]/g, "");
        return;
      }
      if (lowerLine.startsWith("category:")) {
        currentField = "";
        const val = cleanLine.substring(cleanLine.indexOf(":") + 1).trim();
        if (val) tempCategory = val;
        return;
      }
      if (lowerLine.startsWith("stock:") || lowerLine.startsWith("quantity:") || lowerLine.startsWith("count:")) {
        currentField = "";
        const val = cleanLine.substring(cleanLine.indexOf(":") + 1).trim();
        if (val) tempStock = val.replace(/\D/g, "");
        return;
      }

      // If we are currently reading content for a multi-line field
      if (currentField === "short_desc") {
        tempShortDesc = tempShortDesc ? tempShortDesc + "\n" + cleanLine : cleanLine;
      } else if (currentField === "full_desc") {
        tempFullDesc = tempFullDesc ? tempFullDesc + "\n" + cleanLine : cleanLine;
      } else if (currentField === "images") {
        if (cleanLine.startsWith("http")) {
          tempImages.push(cleanLine);
        }
      } else if (currentField === "specifications") {
        const colonIdx = cleanLine.indexOf(":");
        if (colonIdx > 0) {
          const key = cleanLine.substring(0, colonIdx).trim().replace(/^[-*•\s]+/, "");
          const value = cleanLine.substring(colonIdx + 1).trim();
          if (key && value) {
            parsedSpecs.push({ key, value });
          }
        }
      } else {
        // Single-line fallback
        const colonIdx = cleanLine.indexOf(":");
        if (colonIdx > 0) {
          const field = cleanLine.substring(0, colonIdx).toLowerCase().trim();
          const value = cleanLine.substring(colonIdx + 1).trim();

          if (field === "short description" || field === "short desc" || field === "summary") {
            tempShortDesc = value;
          } else if (field === "full description" || field === "description" || field === "details" || field === "full specifications description") {
            tempFullDesc = value;
          } else if (field === "image" || field === "image url" || field === "main image" || field === "main image url") {
            tempImages.push(value);
          }
        }
      }
    });

    if (tempTitle) setTitle(tempTitle);
    if (tempPrice) setPrice(tempPrice);
    if (tempCategory) {
      const cat = tempCategory.toLowerCase();
      if (cat.includes("computers") || cat.includes("electronic") || cat.includes("laptop")) {
        setCategory("Electronics");
      } else if (cat.includes("fashion") || cat.includes("apparel")) {
        setCategory("Fashion");
      } else if (cat.includes("home") || cat.includes("living")) {
        setCategory("Home & Living");
      } else if (cat.includes("fit") || cat.includes("outdoor") || cat.includes("sport")) {
        setCategory("Fitness & Outdoor");
      }
    }
    if (tempStock) setStock(tempStock);
    if (tempShortDesc) setShortDescription(tempShortDesc);
    if (tempFullDesc) setFullDescription(tempFullDesc);
    
    if (tempImages.length > 0) {
      setImage(tempImages[0] || "");
      setImage2(tempImages[1] || "");
      setImage3(tempImages[2] || "");
    }
    if (parsedSpecs.length > 0) {
      setSpecs(parsedSpecs);
    }

    toast.success("AI Data parsed and populated successfully!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !fullDescription || !price || !image) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const tokenRes = await authClient.token();
    const token = tokenRes.data?.token || "";

    const specifications: Record<string, string> = {};
    specs.forEach((item) => {
      if (item.key && item.value) {
        specifications[item.key] = item.value;
      }
    });

    const productPayload = {
      title,
      shortDescription,
      fullDescription,
      price: Number(price),
      category,
      stock: Number(stock),
      image,
      images: [image2, image3].filter(Boolean),
      specifications
    };

    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product added successfully!");
        router.push("/dashboard/admin");
      } else {
        toast.error(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Could not save product.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-sm font-semibold">Authorizing administrator privileges...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/dashboard/admin" className="text-xs font-bold text-gray-500 hover:text-brand flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight mt-4">Add New Product</h1>
            <p className="text-xs text-gray-500 mt-1">Publish a premium new innovation to the ZenithMart catalog.</p>
          </div>
          <button
            type="button"
            onClick={handleAutofill}
            className="px-4 py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-xl text-xs font-bold transition-all cursor-pointer border border-indigo-500/20"
          >
            ⚡ Autofill Demo Product
          </button>
        </div>

        {/* Smart Paste Input */}
        <div className="mb-8 p-5 glass-panel rounded-2xl border border-dashed border-indigo-500/30 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-xs text-indigo-700 dark:text-indigo-400">Smart AI Data Importer</h4>
              <p className="text-[10px] text-gray-400">Paste your raw AI-generated product specifications text here to automatically fill the form.</p>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">AI Smart Fill</span>
          </div>
          <textarea
            onChange={(e) => parseAIData(e.target.value)}
            placeholder="Paste raw text here. Example:&#10;Title: Zenith Smart Watch&#10;Price: $299&#10;Category: Electronics&#10;Description: Next-gen smartwatch...&#10;Specifications:&#10;- Display: 1.4 inch AMOLED&#10;- Battery: 7 Days"
            className="w-full glass-input p-3.5 rounded-xl text-xs min-h-[100px] font-mono focus:outline-none"
          />
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-2xl border border-card-border space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Product Title *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Zenith Noise-Cancelling Headphones"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                />
                <Tag size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Price ($) *</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                />
                <DollarSign size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Category *</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-card-border rounded-xl text-sm p-2.5 focus:outline-none text-gray-800 dark:text-gray-200"
                >
                  <option value="Electronics" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">Electronics</option>
                  <option value="Fashion" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">Fashion</option>
                  <option value="Home & Living" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">Home & Living</option>
                  <option value="Fitness & Outdoor" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">Fitness & Outdoor</option>
                </select>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Initial Stock Count</label>
              <div className="relative">
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                />
                <Package size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Main Image URL & Optional Image URLs */}
            <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Main Image URL *</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                  <Image size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Image URL 2 (Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                  <Image size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Image URL 3 (Optional)</label>
                <div className="relative">
                  <input
                    type="url"
                    value={image3}
                    onChange={(e) => setImage3(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                  />
                  <Image size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Short Description *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Wireless over-ear headphones with active noise cancellation."
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
                />
                <List size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Full Description */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Full Specifications Description *</label>
              <div className="relative">
                <textarea
                  required
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Describe all key features, benefits, usage guides, and design specifications..."
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                />
                <FileText size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Technical Specifications (Optional specs) */}
            <div className="sm:col-span-2 border-t border-card-border pt-4">
              <h3 className="text-xs font-bold text-gray-500 mb-3">Add Custom Technical Specifications (Optional)</h3>
              <div className="space-y-3">
                {specs.map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Spec Name (e.g. Connection)"
                      value={item.key}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[index].key = e.target.value;
                        setSpecs(updated);
                      }}
                      className="w-full glass-input px-3 py-2.5 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Spec Value (e.g. Bluetooth 5.2)"
                      value={item.value}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[index].value = e.target.value;
                        setSpecs(updated);
                      }}
                      className="w-full glass-input px-3 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? "Saving Product..." : <><Plus size={18} /> Publish Product</>}
          </button>
        </form>
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
