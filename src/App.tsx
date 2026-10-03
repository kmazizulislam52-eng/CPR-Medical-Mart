import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Stethoscope,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  BookOpen,
  Shirt,
  Eye,
  Scissors,
  Activity,
  Thermometer,
  Wrench,
  Search,
  Lock,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Menu,
  RotateCcw,
  Sparkles,
  ClipboardList,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Product, Order, CategoryType } from './types';
import { defaultProducts, sampleImagePresets } from './data/defaultProducts';

export default function App() {
  // Products State with automatic image enrichment from defaultProducts if missing
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('cpr_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => {
          if (!p.image) {
            const def = defaultProducts.find(d => d.id === p.id || d.name === p.name);
            if (def && def.image) {
              return { ...p, image: def.image };
            }
          }
          return p;
        });
      }
    } catch {
      // fallback
    }
    return defaultProducts;
  });

  // Orders State (stored in localStorage for admin tracking)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cpr_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ORD-1001',
        customerName: 'ডাঃ তানভীর আহমেদ',
        phone: '01812345678',
        address: 'চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল হোস্টেল, চট্টগ্রাম',
        productId: 2,
        productName: '3M Littmann Classic III Stethoscope',
        price: '১১,৫০০',
        quantity: 1,
        notes: 'কালো টিউব ও রেইনবো ফিনিশ কালার পছন্দ',
        createdAt: '২০২৬-১০-০১ ১০:৩০ AM',
        status: 'Confirmed'
      },
      {
        id: 'ORD-1002',
        customerName: 'মেহেদী হাসান (৫ম বর্ষ)',
        phone: '01798765432',
        address: 'চকবাজার, চট্টগ্রাম',
        productId: 1,
        productName: 'IQRA & Genesis Series Exam Books',
        price: '৬৫০ - ১,৫০০',
        quantity: 2,
        notes: 'জরুরি ডেলিভারি লাগবে',
        createdAt: '২০২৬-১০-০২ ০২:১৫ PM',
        status: 'Pending'
      }
    ];
  });

  // Sync products and orders to localStorage
  useEffect(() => {
    localStorage.setItem('cpr_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cpr_orders', JSON.stringify(orders));
  }, [orders]);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products');
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // File input ref for product image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Order Submission Feedback
  const [orderSuccessData, setOrderSuccessData] = useState<{
    name: string;
    product: string;
    phone: string;
    orderId: string;
  } | null>(null);

  // Direct Order Form inside Product Modal
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1,
    notes: ''
  });

  // Product Add/Edit Form State
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'instruments' as CategoryType,
    price: '',
    stock: 'in-stock' as 'in-stock' | 'stock-out',
    icon: 'Stethoscope',
    image: '',
    badge: '',
    description: '',
    features: ''
  });

  // Helper icon renderer
  const renderProductIcon = (iconName: string, className = "w-8 h-8") => {
    switch (iconName.toLowerCase()) {
      case 'bookopen':
      case 'book':
      case 'graduationcap':
        return <BookOpen className={className} />;
      case 'stethoscope':
        return <Stethoscope className={className} />;
      case 'shirt':
        return <Shirt className={className} />;
      case 'eye':
        return <Eye className={className} />;
      case 'scissors':
        return <Scissors className={className} />;
      case 'activity':
        return <Activity className={className} />;
      case 'thermometer':
        return <Thermometer className={className} />;
      case 'wrench':
        return <Wrench className={className} />;
      default:
        return <Stethoscope className={className} />;
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStock = onlyInStock ? p.stock === 'in-stock' : true;
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, onlyInStock]);

  // Admin authentication
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === '2926') {
      setAdminLoginOpen(false);
      setAdminDashboardOpen(true);
      setLoginError(false);
      setAdminPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  // Handle image upload from device
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('ছবির আকার সর্বোচ্চ ৩ মেগাবাইটের (3MB) মধ্যে হতে হবে।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Order Submission Handler
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProductModal) return;

    const newOrder: Order = {
      id: `CPR-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderForm.name,
      phone: orderForm.phone,
      address: orderForm.address || 'শোরুম থেকে সংগ্রহ করবেন',
      productId: activeProductModal.id,
      productName: activeProductModal.name,
      price: activeProductModal.price,
      quantity: Number(orderForm.quantity) || 1,
      notes: orderForm.notes,
      createdAt: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pending'
    };

    setOrders(prev => [newOrder, ...prev]);

    const submittedDetails = {
      name: orderForm.name,
      product: activeProductModal.name,
      phone: orderForm.phone,
      orderId: newOrder.id
    };

    // Reset order form and close product modal
    setOrderForm({
      name: '',
      phone: '',
      address: '',
      quantity: 1,
      notes: ''
    });
    setActiveProductModal(null);
    setOrderSuccessData(submittedDetails);
  };

  // WhatsApp Quick Order Trigger
  const handleWhatsAppOrder = (product: Product) => {
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম CPR Medical Mart,\n\nআমি এই পণ্যটি অর্ডার/ইনকোয়ারি করতে চাই:\n📦 পণ্যের নাম: ${product.name}\n💰 মূল্য: ৳ ${product.price}\n\nদয়া করে স্টক ও ডেলিভারি বিস্তারিত জানাবেন।`
    );
    window.open(`https://wa.me/8801805743666?text=${text}`, '_blank');
  };

  // Toggle Stock Status in Admin
  const toggleStockStatus = (id: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, stock: p.stock === 'in-stock' ? 'stock-out' : 'in-stock' }
          : p
      )
    );
  };

  // Delete Product
  const handleDeleteProduct = (id: number) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই পণ্যটি ক্যাটালগ থেকে মুছে ফেলতে চান?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Open Product Form (Add / Edit)
  const openProductForm = (product?: Product) => {
    if (product) {
      setEditingProductId(product.id);
      setProductFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        icon: product.icon || 'Stethoscope',
        image: product.image || '',
        badge: product.badge || '',
        description: product.description,
        features: (product.features || []).join('\n')
      });
    } else {
      setEditingProductId(null);
      setProductFormData({
        name: '',
        category: 'instruments',
        price: '',
        stock: 'in-stock',
        icon: 'Stethoscope',
        image: '',
        badge: '',
        description: '',
        features: ''
      });
    }
    setProductFormModalOpen(true);
  };

  // Save Product Form
  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const splitFeatures = productFormData.features
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    if (editingProductId) {
      // Edit
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProductId
            ? {
                ...p,
                name: productFormData.name,
                category: productFormData.category,
                price: productFormData.price,
                stock: productFormData.stock,
                icon: productFormData.icon,
                image: productFormData.image,
                badge: productFormData.badge,
                description: productFormData.description,
                features: splitFeatures
              }
            : p
        )
      );
    } else {
      // Add
      const newProd: Product = {
        id: Date.now(),
        name: productFormData.name,
        category: productFormData.category,
        price: productFormData.price,
        stock: productFormData.stock,
        icon: productFormData.icon,
        image: productFormData.image,
        badge: productFormData.badge || 'নতুন',
        description: productFormData.description,
        features: splitFeatures
      };
      setProducts(prev => [newProd, ...prev]);
    }
    setProductFormModalOpen(false);
  };

  // Reset to default dataset
  const handleResetCatalog = () => {
    if (window.confirm('সকল পণ্য ও ক্যাটালগ ফ্যাক্টরি ডিফল্ট ছবিতে রিসেট করবেন?')) {
      setProducts(defaultProducts);
    }
  };

  // Order status updater in Admin
  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('এই অর্ডার রেকর্ডটি ডিলিট করতে চান?')) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#1e549f] selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#111827] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>মতি টাওয়ার (৫ম তলা), চকবাজার, চট্টগ্রাম। প্রতিদিন সকাল ৯:০০ টা - রাত ৯:০০ টা খোলা</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:01805743666"
              className="flex items-center gap-1.5 hover:text-white font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>01805-743666</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="tel:01805743667"
              className="flex items-center gap-1.5 hover:text-white font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span>01805-743667</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#1e549f] to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1e549f] flex items-center gap-1.5">
                CPR <span className="text-[#e53935] font-black">MEDICAL MART</span>
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 block font-medium -mt-1 tracking-wide">
                Supporting Every Step of Your Medical Journey
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-sm text-slate-700">
            <a href="#home" className="hover:text-[#1e549f] transition-colors">
              হোম
            </a>
            <a href="#products-section" className="hover:text-[#1e549f] transition-colors">
              পণ্যসমূহ ও ছবি
            </a>
            <a href="#about" className="hover:text-[#1e549f] transition-colors">
              শোরুমের ঠিকানা
            </a>
            <a href="#contact" className="hover:text-[#1e549f] transition-colors">
              যোগাযোগ
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href="https://wa.me/8801805743666"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp:</span> 01805-743666
            </a>
            <button
              onClick={() => setAdminLoginOpen(true)}
              className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200"
              title="এডমিন প্যানেল"
            >
              <Lock className="w-3.5 h-3.5 text-[#1e549f]" />
              <span className="hidden md:inline">এডমিন প্যানেল</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-[#1e549f]"
            >
              হোম
            </a>
            <a
              href="#products-section"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-[#1e549f]"
            >
              পণ্যসমূহ ও ছবি ক্যাটালগ
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-[#1e549f]"
            >
              শোরুমের ঠিকানা ও ল্যান্ডমার্ক
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium hover:text-[#1e549f]"
            >
              যোগাযোগ ও হটলাইন
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="tel:01805743666"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-sm border border-emerald-200"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> হটলাইন: 01805-743666
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminLoginOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900"
              >
                <Lock className="w-4 h-4" /> এডমিন লগইন (পাসওয়ার্ড: 2926)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-white py-14 sm:py-20 lg:py-24 border-b border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Heading and Value propositions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-[#1e549f] text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> চট্টগ্রাম চকবাজারের নির্ভরযোগ্য মেডিকেল মার্ট
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Supporting Every Step of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e549f] via-sky-600 to-blue-700">
                  Your Medical Journey
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                এফসিপিএস (FCPS), বিসিএস (BCS) ও মেডিকেল প্রস্তুতিমূলক বই, আসল লিটম্যান স্ট্যাথোস্কোপ, ল্যাব কোট এবং সকল প্রকার আধুনিক মেডিকেল ইন্সট্রুমেন্টস পাচ্ছেন এক ছাদের নিচে।
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <a
                  href="#products-section"
                  className="px-7 py-3.5 rounded-xl bg-[#1e549f] hover:bg-blue-800 text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" /> পণ্যসমূহ ও ছবি দেখুন
                </a>
                <a
                  href="#about"
                  className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-all flex items-center gap-2 text-sm sm:text-base shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MapPin className="w-4 h-4 text-[#e53935]" /> শোরুমের ঠিকানা
                </a>
              </div>

              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> ১০০% অরিজিনাল পণ্য
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#1e549f]" /> সারাদেশে হোম ডেলিভারি
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" /> সার্বক্ষণিক কাস্টমার সাপোর্ট
                </div>
              </div>
            </div>

            {/* Right Column: Physical Showroom Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#1e549f] to-[#e53935] rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
                  <div className="text-center pb-4 border-b border-slate-100">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-50 text-[#1e549f] flex items-center justify-center shadow-inner">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">CPR Medical Mart</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      গুলজার মোড়, চকবাজার, চট্টগ্রাম
                    </p>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <MapPin className="w-5 h-5 text-[#e53935] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[#1e549f]">
                          শোরুমের লোকেশন:
                        </p>
                        <p className="text-slate-700 text-sm mt-0.5 font-medium leading-snug">
                          মতি টাওয়ার (৫ম তলা), গুলজার মোড়, চকবাজার, চট্টগ্রাম।
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          <strong className="text-slate-700">ল্যান্ডমার্ক:</strong> EBL ব্যাংকের ATM বুথের ডান পাশে লিফটের ৪ তলা।
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                      <Clock className="w-5 h-5 text-[#1e549f] shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">খোলা থাকার সময়সূচি:</p>
                        <p className="text-slate-600 text-xs mt-0.5">
                          প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত (শুক্রবার বিকালে খোলা)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">হোয়াটসঅ্যাপ / হটলাইন</p>
                          <p className="font-bold text-emerald-800 text-sm tracking-wide">
                            01805-743666
                          </p>
                        </div>
                      </div>
                      <a
                        href="https://wa.me/8801805743666"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        চ্যাট করুন
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom & Location Info Cards */}
      <section id="about" className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs uppercase tracking-widest text-[#1e549f] font-bold mb-2">
              আমাদের অবস্থান ও পরিচয়
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              আপনার সুবিধার্থে সহজে খুঁজে নিন আমাদের শোরুম
            </h3>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              চিকিৎসক, মেডিকেল শিক্ষার্থী ও স্বাস্থ্যকর্মীদের বিশ্বস্ত আস্থার ঠিকানা—সিপিআর মেডিকেল মার্ট।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1e549f] flex items-center justify-center text-xl mb-4 font-bold shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">ঠিকানা</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                মতি টাওয়ার (৫ম তলা), গুলজার মোড়, চকবাজার, চট্টগ্রাম।
              </p>
              <div className="text-slate-500 text-xs mt-4 bg-white p-3 rounded-xl border border-slate-200">
                <strong className="text-slate-800">ল্যান্ডমার্ক নির্দেশিকা:</strong> মতি টাওয়ারের প্রবেশপথে EBL ব্যাংকের ATM বুথের ডান পাশে লিফটের ৪ তলা।
              </div>
            </div>

            <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-[#e53935] flex items-center justify-center text-xl mb-4 font-bold shadow-sm">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">হটলাইন ও অর্ডার কল</h4>
              <div className="space-y-2 mt-3">
                <a
                  href="tel:01805743666"
                  className="flex items-center gap-2 text-slate-800 font-bold hover:text-[#1e549f] transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-[#1e549f]" /> 01805-743666
                </a>
                <a
                  href="tel:01805743667"
                  className="flex items-center gap-2 text-slate-800 font-bold hover:text-[#1e549f] transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 text-[#1e549f]" /> 01805-743667
                </a>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp এও অর্ডার করা যাবে
              </div>
            </div>

            <div className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-4 font-bold shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">খোলা থাকার সময়সূচি</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                প্রতিদিন সকাল ৯:০০ টা থেকে রাত ৯:০০ টা পর্যন্ত শোরুম খোলা থাকে।
              </p>
              <div className="mt-4 text-xs font-semibold text-[#1e549f] bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-100 inline-block">
                শুক্রবারও খোলা থাকে (জুম্মার পর বিকাল থেকে রাত পর্যন্ত)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="products-section" className="py-14 sm:py-20 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e549f]"></span>
                <span className="text-xs uppercase tracking-widest text-[#1e549f] font-bold">
                  পণ্য ক্যাটালগ ও ছবি গ্যালারি
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                মেডিকেল বুকস, স্ট্যাথোস্কোপ ও ইন্সট্রুমেন্টস
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                সরাসরি পণ্যের আসল ছবি, স্টক স্ট্যাটাস ও বিবরণ দেখে অর্ডার করুন।
              </p>
            </div>

            {/* Search Input & Stock Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="পণ্য বা বই খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f] shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer shadow-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#1e549f] focus:ring-[#1e549f]"
                />
                <span>শুধু স্টকে থাকা পণ্য</span>
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-sm no-scrollbar">
            {[
              { id: 'all', label: 'সকল পণ্য' },
              { id: 'books', label: 'মেডিকেল বুকস' },
              { id: 'instruments', label: 'মেডিকেল ইন্সট্রুমেন্টস' },
              { id: 'apparel', label: 'ল্যাব কোট ও অ্যাপারেল' },
              { id: 'diagnostics', label: 'ডায়াগনস্টিক কিট' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-[#1e549f] text-white shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid with Product Pictures */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-base text-slate-700">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500 mt-1">অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setOnlyInStock(false);
                }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => {
                const isInStock = product.stock === 'in-stock';
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all group overflow-hidden"
                  >
                    <div>
                      {/* Product Picture Display */}
                      <div className="relative h-48 sm:h-52 w-full rounded-xl overflow-hidden mb-4 bg-slate-100 flex items-center justify-center border border-slate-100">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              // If image fails, replace with placeholder icon
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const fallback = (e.currentTarget.parentElement?.querySelector('.icon-fallback') as HTMLElement);
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* Fallback Icon Container (shown if no image or image load error) */}
                        <div
                          className={`icon-fallback w-full h-full bg-blue-50/80 items-center justify-center text-[#1e549f] ${
                            product.image ? 'hidden' : 'flex'
                          }`}
                        >
                          {renderProductIcon(product.icon, 'w-16 h-16')}
                        </div>

                        {/* Badges on Image */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-sm ${
                              isInStock
                                ? 'bg-emerald-600/95 text-white'
                                : 'bg-[#e53935]/95 text-white'
                            }`}
                          >
                            {isInStock ? 'স্টকে আছে' : 'স্টক আউট'}
                          </span>
                          {product.badge && (
                            <span className="bg-[#1e549f]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Category Badge on Image bottom */}
                        <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-slate-800 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md shadow-sm z-10">
                          {product.category === 'books'
                            ? 'বই'
                            : product.category === 'instruments'
                            ? 'ইন্সট্রুমেন্ট'
                            : product.category === 'apparel'
                            ? 'অ্যাপারেল'
                            : 'ডায়াগনস্টিক'}
                        </span>
                      </div>

                      {/* Product Content */}
                      <h4 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-[#1e549f] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Highlights */}
                      {product.features && product.features.length > 0 && (
                        <div className="space-y-1 mb-4">
                          {product.features.slice(0, 2).map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 text-[11px] text-slate-500"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and Buttons */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-xs text-slate-500 block font-medium">মূল্য:</span>
                          <span className="text-xl font-extrabold text-[#1e549f]">
                            ৳ {product.price}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            isInStock
                              ? 'text-emerald-700 bg-emerald-50'
                              : 'text-red-700 bg-red-50'
                          }`}
                        >
                          {isInStock ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveProductModal(product)}
                          className="py-2.5 px-3 rounded-xl bg-[#1e549f] hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> ছবি ও অর্ডার
                        </button>
                        <button
                          onClick={() => handleWhatsAppOrder(product)}
                          className="py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Hotline Strip */}
      <section className="py-14 bg-gradient-to-r from-[#1e549f] via-blue-700 to-sky-700 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            আপনার মেডিকেল জার্নিকে সফল ও সহজ করতে আমরা আছি সাথে
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            যেকোনো মেডিকেল বই, আসল লিটম্যান স্টেথোস্কোপ, ল্যাব কোট বা ডায়াগনস্টিক ইন্সট্রুমেন্টসের ছবি ও তথ্যের জন্য সরাসরি আমাদের নম্বরে যোগাযোগ করুন।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <a
              href="tel:01805743666"
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-white text-[#1e549f] font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <Phone className="w-4 h-4 text-[#1e549f]" /> 01805-743666 কল করুন
            </a>
            <a
              href="https://wa.me/8801805743666"
              target="_blank"
              rel="noreferrer"
              className="px-6 sm:px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp এ মেসেজ দিন
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#111827] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1e549f] flex items-center justify-center text-white shadow-md">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  CPR <span className="text-[#e53935] font-black">MEDICAL MART</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Supporting Every Step of Your Medical Journey. চট্টগ্রাম চকবাজারের চিকিৎসকদের জন্য বিশ্বস্ত শপ।
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/8801805743666"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="tel:01805743666"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#e53935] text-white flex items-center justify-center transition-colors"
                  aria-label="Call Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Exact Location */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e53935]" /> শোরুমের পূর্ণাঙ্গ ঠিকানা
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                <strong className="text-slate-200">মতি টাওয়ার (৫ম তলা),</strong> গুলজার মোড়, চকবাজার, চট্টগ্রাম।
              </p>
              <div className="text-xs text-slate-400 bg-slate-800/90 p-3.5 rounded-xl border border-slate-700/60 leading-relaxed">
                <span className="text-[#e53935] font-bold">ল্যান্ডমার্ক:</span> মতি টাওয়ার ভবনের প্রবেশমুখে Eastern Bank Limited (EBL) এর ATM বুথের ডান পাশে লিফটের ৪ তলা।
              </div>
            </div>

            {/* Column 3: Contact Hotlines */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-base flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1e549f]" /> হটলাইন ও যোগাযোগ
              </h4>
              <div className="space-y-2.5 text-sm">
                <a
                  href="tel:01805743666"
                  className="text-slate-400 flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400" /> 01805-743666 (কল ও WhatsApp)
                </a>
                <a
                  href="tel:01805743667"
                  className="text-slate-400 flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400" /> 01805-743667
                </a>
                <div className="text-slate-400 flex items-center gap-2 text-xs pt-1">
                  <Clock className="w-4 h-4 text-amber-400" /> সকাল ৯:০০ টা - রাত ৯:০০ টা
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <p>&copy; 2026 CPR Medical Mart. All rights reserved.</p>
            <button
              onClick={() => setAdminLoginOpen(true)}
              className="text-slate-400 hover:text-white underline transition-colors"
            >
              এডমিন কন্ট্রোল প্যানেল লগইন (পাসওয়ার্ড: 2926)
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (WhatsApp) */}
      <a
        href="https://wa.me/8801805743666"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 p-3.5 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110 flex items-center gap-2 group"
        title="WhatsApp এ সরাসরি চ্যাট করুন"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden group-hover:inline text-xs font-bold pr-1">WhatsApp Chat</span>
      </a>

      {/* ======================================================== */}
      {/* Product Detail & Direct Order Modal with Big Picture */}
      {/* ======================================================== */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveProductModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              {/* Product Big Picture */}
              {activeProductModal.image ? (
                <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img
                    src={activeProductModal.image}
                    alt={activeProductModal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm ${
                        activeProductModal.stock === 'in-stock'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#e53935] text-white'
                      }`}
                    >
                      {activeProductModal.stock === 'in-stock'
                        ? '● স্টকে আছে (In Stock)'
                        : '✕ স্টক আউট (Stock Out)'}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#1e549f] bg-blue-50 px-3 py-1 rounded-full">
                  {activeProductModal.category === 'books'
                    ? 'মেডিকেল বুকস'
                    : activeProductModal.category === 'instruments'
                    ? 'ইন্সট্রুমেন্টস'
                    : activeProductModal.category === 'apparel'
                    ? 'ল্যাব কোট ও অ্যাপারেল'
                    : 'ডায়াগনস্টিক কিট'}
                </span>
                {!activeProductModal.image && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      activeProductModal.stock === 'in-stock'
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-red-700 bg-red-50'
                    }`}
                  >
                    {activeProductModal.stock === 'in-stock'
                      ? '● স্টকে আছে'
                      : '✕ স্টক আউট'}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {activeProductModal.name}
                </h3>
                <p className="text-2xl font-black text-[#1e549f] mt-1">
                  ৳ {activeProductModal.price}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
                {activeProductModal.description}
              </div>

              {activeProductModal.features && activeProductModal.features.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    প্রধান বৈশিষ্ট্যসমূহ:
                  </p>
                  <div className="space-y-1.5">
                    {activeProductModal.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Order Form */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center justify-between">
                  <span>অর্ডার বা বুকিং ফর্ম:</span>
                  <button
                    type="button"
                    onClick={() => handleWhatsAppOrder(activeProductModal)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp-এ পাঠান
                  </button>
                </h4>

                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                      placeholder="যেমন: ডাঃ রফিকুল ইসলাম"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="tel"
                        required
                        value={orderForm.phone}
                        onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                        placeholder="018XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        পরিমাণ (Quantity)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={orderForm.quantity}
                        onChange={e =>
                          setOrderForm({
                            ...orderForm,
                            quantity: parseInt(e.target.value) || 1
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ডেলিভারি ঠিকানা (অথবা লিখুন: শোরুম পিকআপ)
                    </label>
                    <textarea
                      rows={2}
                      value={orderForm.address}
                      onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                      placeholder="বাড়ি, রোড, এলাকা, জেলা"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      অতিরিক্ত নোট / পছন্দমতো কালার বা সাইজ
                    </label>
                    <input
                      type="text"
                      value={orderForm.notes}
                      onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                      placeholder="যেমন: সাইজ L, অথবা বিশেষ কোনো এডিশন"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e549f]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1e549f] hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> অর্ডার কনফার্ম করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppOrder(activeProductModal)}
                      className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp এর মাধ্যমে অর্ডার পাঠান
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Order Success Confirmation Modal */}
      {/* ======================================================== */}
      {orderSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              অর্ডার সফলভাবে সাবমিট হয়েছে!
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
              <p>
                <strong className="text-slate-800">অর্ডার ট্র্যাকিং আইডি:</strong>{' '}
                <span className="font-mono text-[#1e549f] font-bold">
                  {orderSuccessData.orderId}
                </span>
              </p>
              <p>
                <strong className="text-slate-800">গ্রাহকের নাম:</strong> {orderSuccessData.name}
              </p>
              <p>
                <strong className="text-slate-800">পণ্য:</strong> {orderSuccessData.product}
              </p>
              <p>
                <strong className="text-slate-800">মোবাইল নম্বর:</strong> {orderSuccessData.phone}
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              ধন্যবাদ! খুব শীঘ্রই আমাদের শোরুমের প্রতিনিধি আপনার দেওয়া নম্বরে ফোন বা WhatsApp-এ যোগাযোগ করে ডেলিভারি কনফার্ম করবেন।
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderSuccessData(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#1e549f] text-white font-semibold text-xs hover:bg-blue-800 transition-colors"
              >
                ঠিক আছে
              </button>
              <a
                href={`https://wa.me/8801805743666?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম CPR Medical Mart, আমি ওয়েবসাইটে একটি অর্ডার করেছি (আইডি: ${orderSuccessData.orderId})। আমার নাম ${orderSuccessData.name}।`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp আপডেট
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Admin Login Modal (Password: 2926) */}
      {/* ======================================================== */}
      {adminLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => {
                setAdminLoginOpen(false);
                setLoginError(false);
                setAdminPasswordInput('');
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-50 text-[#1e549f] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">এডমিন লগইন</h3>
              <p className="text-slate-500 text-xs mt-1">
                সিপিআর মেডিকেল মার্ট কন্ট্রোল প্যানেলের পাসওয়ার্ড দিন (ডিফল্ট: <strong>2926</strong>)
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এডমিন সিক্রেট পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasswordInput}
                  onChange={e => {
                    setAdminPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-center text-2xl tracking-widest"
                />
              </div>

              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-semibold">
                  ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন (ডিফল্ট পাসওয়ার্ড: 2926)
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1e549f] hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all"
              >
                লগইন করুন
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  সহায়তা: পাসওয়ার্ড ভুলে গেলে <strong className="text-slate-600">2926</strong> দিয়ে প্রবেশ করুন।
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Admin Dashboard Modal */}
      {/* ======================================================== */}
      {adminDashboardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl relative my-auto">
            {/* Admin Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 rounded-t-2xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#1e549f] font-bold">
                  Management Console
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  CPR Medical Mart - এডমিন ড্যাশবোর্ড
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openProductForm()}
                  className="px-3.5 py-2 bg-[#1e549f] hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> নতুন পণ্য যোগ করুন
                </button>
                <button
                  onClick={() => setAdminDashboardOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Admin Body Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">মোট পণ্য</p>
                  <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {products.length}
                  </h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">স্টকে আছে</p>
                  <h4 className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {products.filter(p => p.stock === 'in-stock').length}
                  </h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">স্টক আউট</p>
                  <h4 className="text-2xl font-extrabold text-[#e53935] mt-1">
                    {products.filter(p => p.stock === 'stock-out').length}
                  </h4>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs text-slate-500 font-medium">ওয়েব অর্ডারসমূহ</p>
                  <h4 className="text-2xl font-extrabold text-[#1e549f] mt-1">
                    {orders.length}
                  </h4>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setAdminTab('products')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors ${
                    adminTab === 'products'
                      ? 'bg-[#1e549f] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> পণ্য তালিকা ও ছবি কন্ট্রোল
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors relative ${
                    adminTab === 'orders'
                      ? 'bg-[#1e549f] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" /> কাস্টমার অর্ডার তালিকা
                  {orders.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-mono">
                      {orders.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab 1: Product Management */}
              {adminTab === 'products' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-sm">
                      সকল পণ্যের তালিকা ও ছবি ({products.length})
                    </h4>
                    <button
                      onClick={handleResetCatalog}
                      className="text-xs text-slate-500 hover:text-[#1e549f] underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> ডিফল্ট ছবি ও তথ্য রিসেট
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3">পণ্যের ছবি ও নাম</th>
                          <th className="p-3">ক্যাটাগরি</th>
                          <th className="p-3">দাম (টাকা)</th>
                          <th className="p-3">স্টক স্ট্যাটাস</th>
                          <th className="p-3 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map(p => {
                          const isInStock = p.stock === 'in-stock';
                          return (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-semibold text-slate-900">
                                <div className="flex items-center gap-3">
                                  {p.image ? (
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0"
                                    />
                                  ) : (
                                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#1e549f] flex items-center justify-center shrink-0 border border-blue-100">
                                      {renderProductIcon(p.icon, 'w-5 h-5')}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm font-semibold">{p.name}</p>
                                    {p.badge && (
                                      <span className="text-[10px] bg-blue-50 text-[#1e549f] px-1.5 py-0.5 rounded font-medium">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-slate-600 text-xs">
                                {p.category === 'books'
                                  ? 'মেডিকেল বুকস'
                                  : p.category === 'instruments'
                                  ? 'ইন্সট্রুমেন্টস'
                                  : p.category === 'apparel'
                                  ? 'ল্যাব কোট'
                                  : 'ডায়াগনস্টিক'}
                              </td>
                              <td className="p-3 font-bold text-[#1e549f]">৳ {p.price}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => toggleStockStatus(p.id)}
                                  className={`px-3 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 ${
                                    isInStock
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                  title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                                >
                                  {isInStock ? '● স্টকে আছে' : '✕ স্টক আউট'}
                                </button>
                              </td>
                              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => openProductForm(p)}
                                  className="px-2.5 py-1.5 bg-blue-50 text-[#1e549f] hover:bg-blue-100 rounded-lg text-xs font-semibold"
                                >
                                  <Edit3 className="w-3.5 h-3.5 inline mr-1" /> এডিট / ছবি
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5 inline mr-1" /> ডিলিট
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders Management */}
              {adminTab === 'orders' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-sm">
                      ওয়েবসাইট থেকে প্রাপ্ত কাস্টমার অর্ডার তালিকা ({orders.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      অর্ডার স্ট্যাটাস আপডেট করুন অথবা সরাসরি কল করুন
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <ClipboardList className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-medium text-sm">এখনো কোনো অর্ডার আসেনি।</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="p-3">অর্ডার আইডি</th>
                            <th className="p-3">গ্রাহক ও মোবাইল</th>
                            <th className="p-3">পণ্য ও পরিমাণ</th>
                            <th className="p-3">ঠিকানা / নোট</th>
                            <th className="p-3">স্ট্যাটাস</th>
                            <th className="p-3 text-right">যোগাযোগ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono font-bold text-xs text-[#1e549f]">
                                {order.id}
                                <span className="block text-[10px] text-slate-400 font-bangla mt-0.5">
                                  {order.createdAt}
                                </span>
                              </td>
                              <td className="p-3">
                                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {order.customerName}
                                </p>
                                <a
                                  href={`tel:${order.phone}`}
                                  className="text-xs font-semibold text-slate-600 hover:text-[#1e549f] flex items-center gap-1 mt-0.5"
                                >
                                  <Phone className="w-3 h-3 text-sky-500" /> {order.phone}
                                </a>
                              </td>
                              <td className="p-3 text-xs">
                                <p className="font-semibold text-slate-800">{order.productName}</p>
                                <p className="text-slate-500 mt-0.5">
                                  পরিমাণ: <strong className="text-slate-700">{order.quantity}</strong> | মূল্য: ৳ {order.price}
                                </p>
                              </td>
                              <td className="p-3 text-xs max-w-xs">
                                <p className="text-slate-700 line-clamp-2">{order.address}</p>
                                {order.notes && (
                                  <p className="text-slate-500 italic mt-0.5 line-clamp-1">
                                    নোট: {order.notes}
                                  </p>
                                )}
                              </td>
                              <td className="p-3 text-xs">
                                <select
                                  value={order.status}
                                  onChange={e =>
                                    handleOrderStatusChange(
                                      order.id,
                                      e.target.value as Order['status']
                                    )
                                  }
                                  className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1e549f] bg-white"
                                >
                                  <option value="Pending">⏳ Pending</option>
                                  <option value="Confirmed">✅ Confirmed</option>
                                  <option value="Delivered">📦 Delivered</option>
                                  <option value="Cancelled">❌ Cancelled</option>
                                </select>
                              </td>
                              <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                <a
                                  href={`tel:${order.phone}`}
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#1e549f] rounded-lg inline-flex"
                                  title="কাস্টমারকে কল করুন"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `আসসালামু আলাইকুম ${order.customerName}, CPR Medical Mart থেকে আপনার অর্ডার (${order.id}) সংক্রান্ত যোগাযোগ করছি।`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg inline-flex"
                                  title="WhatsApp এ মেসেজ দিন"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-flex"
                                  title="অর্ডার মুছুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Add / Edit Product Form Modal with Photo Upload & Presets */}
      {/* ======================================================== */}
      {productFormModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setProductFormModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <span className="text-xs uppercase tracking-wider text-[#1e549f] font-bold">
                Product Catalog Management
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {editingProductId ? 'পণ্য ও ছবি সম্পাদনা করুন' : 'নতুন পণ্য ও ছবি যোগ করুন'}
              </h3>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পণ্যের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={productFormData.name}
                  onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="যেমন: Littmann Classic III Stethoscope"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm"
                />
              </div>

              {/* Product Picture Upload Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  <ImageIcon className="w-4 h-4 inline mr-1 text-[#1e549f]" /> পণ্যের ছবি (Product Picture)
                </label>

                {/* Image Preview if available */}
                {productFormData.image && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-white border border-slate-200 group">
                    <img
                      src={productFormData.image}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProductFormData({ ...productFormData, image: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ছবি সরান
                    </button>
                  </div>
                )}

                {/* File Upload Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-[#1e549f] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-blue-50/50 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#1e549f]" /> ডিভাইস থেকে ছবি আপলোড করুন
                  </button>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <input
                    type="text"
                    value={productFormData.image}
                    onChange={e =>
                      setProductFormData({ ...productFormData, image: e.target.value })
                    }
                    placeholder="অথবা ছবির অনলাইন লিংক (URL) দিন..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#1e549f]"
                  />
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold mb-1.5">
                    তাত্ক্ষণিক নমুনা ছবি নির্বাচন (Presets):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleImagePresets.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setProductFormData({ ...productFormData, image: preset.url })
                        }
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          productFormData.image === preset.url
                            ? 'bg-[#1e549f] text-white border-[#1e549f]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={productFormData.category}
                    onChange={e =>
                      setProductFormData({
                        ...productFormData,
                        category: e.target.value as CategoryType
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm bg-white"
                  >
                    <option value="books">মেডিকেল বুকস</option>
                    <option value="instruments">মেডিকেল ইন্সট্রুমেন্টস</option>
                    <option value="apparel">ল্যাব কোট ও অ্যাপারেল</option>
                    <option value="diagnostics">ডায়াগনস্টিক কিট</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    দাম (টাকা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.price}
                    onChange={e =>
                      setProductFormData({ ...productFormData, price: e.target.value })
                    }
                    placeholder="যেমন: ১,২৫০ অথবা ৬৫০ - ১,৫০০"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    স্টক স্ট্যাটাস *
                  </label>
                  <select
                    value={productFormData.stock}
                    onChange={e =>
                      setProductFormData({
                        ...productFormData,
                        stock: e.target.value as 'in-stock' | 'stock-out'
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm bg-white"
                  >
                    <option value="in-stock">স্টকে আছে (In Stock)</option>
                    <option value="stock-out">স্টক আউট (Stock Out)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ব্যাজ (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={productFormData.badge}
                    onChange={e =>
                      setProductFormData({ ...productFormData, badge: e.target.value })
                    }
                    placeholder="যেমন: জনপ্রিয় / ১০০% অরিজিনাল"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিস্তারিত বিবরণ *
                </label>
                <textarea
                  rows={2}
                  required
                  value={productFormData.description}
                  onChange={e =>
                    setProductFormData({ ...productFormData, description: e.target.value })
                  }
                  placeholder="পণ্যটির বিস্তারিত বিবরণ লিখুন..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রধান বৈশিষ্ট্যসমূহ (প্রতি লাইনে একটি)
                </label>
                <textarea
                  rows={2}
                  value={productFormData.features}
                  onChange={e =>
                    setProductFormData({ ...productFormData, features: e.target.value })
                  }
                  placeholder="বৈশিষ্ট্য ১&#10;বৈশিষ্ট্য ২"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e549f] text-sm"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProductFormModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1e549f] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
