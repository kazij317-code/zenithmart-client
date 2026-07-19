"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/context/AuthContext";
import { Package, Tag, DollarSign, List, FileText, Image, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    setTitle("Zenith Pro VR Headset");
    setShortDescription("Aerospace-grade standalone VR headset with 8K Micro-OLED display.");
    setFullDescription("Experience ultra-realistic virtual reality with the Zenith Pro standalone VR headset. Featuring dual 4K Micro-OLED panels, Snapdragon XR2+ Gen 2 chipset, spatial audio, and hand/eye tracking capabilities.");
    setPrice("899");
    setCategory("Electronics");
    setStock("25");
    setImage("https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=400&auto=format&fit=crop");
    setImage2("https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=400&auto=format&fit=crop");
    setImage3("");
    setSpecs([
      { key: "Display", value: "Dual 4K Micro-OLED AR/VR Display" },
      { key: "Processor", value: "Snapdragon XR2+ Gen 2" },
      { key: "Memory", value: "12GB LPDDR5X RAM" },
      { key: "Storage", value: "256GB Standalone Storage" },
      { key: "Tracking", value: "6 DoF Inside-Out Camera Tracking" },
      { key: "Audio", value: "Spatial Sound Speakers" },
      { key: "Connectivity", value: "Wi-Fi 7 & Bluetooth 5.4" },
      { key: "Battery Life", value: "Up to 3 Hours Active Use" }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !fullDescription || !price || !image) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("better-auth.session_token") || "";

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
      images: [image, image2, image3].filter(Boolean),
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
        alert("Product added successfully!");
        router.push("/dashboard/admin");
      } else {
        alert(data.error || "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Could not save product.");
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
                  className="w-full bg-transparent border border-card-border rounded-xl text-sm p-2.5 focus:outline-none"
                >
                  <option value="Electronics" className="bg-white dark:bg-slate-900">Electronics</option>
                  <option value="Fashion" className="bg-white dark:bg-slate-900">Fashion</option>
                  <option value="Home & Living" className="bg-white dark:bg-slate-900">Home & Living</option>
                  <option value="Fitness & Outdoor" className="bg-white dark:bg-slate-900">Fitness & Outdoor</option>
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
