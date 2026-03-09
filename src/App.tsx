import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  Instagram, 
  Search, 
  Filter, 
  ChevronRight, 
  Info, 
  Clock, 
  DollarSign, 
  Tag, 
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
  Menu,
  Mail,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  FileText,
  MessageSquare,
  Copy,
  Package,
  Star,
  User,
  HelpCircle,
  Scale
} from 'lucide-react';
import { Product } from './types';

const INSTAGRAM_ID = 'julie_wood09';
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ3pUP5QyfZ2gs850GuJbQ-dwWU5kxsVTTZ8Ylmu9LsPJHGkdRwo0yOuUqMuiy6L3DdIl6zzNEOuVIo/pub?gid=817069434&single=true&output=csv';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 14 : 20);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as any[];
            
            if (data.length === 0) {
              setError('No products found in the sheet.');
              setLoading(false);
              return;
            }

            const cleaned = data.map((row, index) => ({
              status: row.status || row.Status || '',
              seller_name: row.seller_name || row['Seller Name'] || '',
              keywords: row.keywords || row.Keywords || '',
              productpictures: row.productpictures || row['Product Pictures'] || '',
              store_name: row.store_name || row['Store Name'] || '',
              'Asin/link': row['Asin/link'] || row.Asin || row.Link || '',
              Price: row.Price || row.price || '',
              Opd: row.Opd || row.opd || '',
              Commission: row.Commission || row.commission || '',
              instructions: row.instructions || row.Instructions || '',
              Refundtiming: row.Refundtiming || row['Refund Timing'] || '',
              product_number: row.product_number || row['Product Number'] || `PN-${index}`,
              Category: row.Category || row.category || 'General',
            })).filter(p => p.keywords || p.store_name);

            setProducts(cleaned);
            setLoading(false);
          },
          error: (err: any) => {
            console.error('CSV Parsing Error:', err);
            setError('Failed to parse product data.');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to fetch products from the sheet.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.Category).filter(Boolean))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        (p.keywords?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.store_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.product_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || p.Category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleOrder = (product: Product) => {
    // Open Instagram chat directly
    window.open(`https://ig.me/m/${INSTAGRAM_ID}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-zinc-900 animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">Loading professional catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-zinc-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl">
                R
              </div>
              <span className="font-display font-bold text-xl tracking-tight">ReviewPerk</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Catalog
              </button>
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => setShowPolicies(true)}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Policies
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <a 
                href={`https://www.instagram.com/${INSTAGRAM_ID}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all"
              >
                <Instagram size={18} />
                <span>Follow Us</span>
              </a>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-900 bg-zinc-100 rounded-xl"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <button 
                  onClick={() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                >
                  Catalog
                </button>
                <button 
                  onClick={() => {
                    setShowHowItWorks(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => {
                    setShowPolicies(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                >
                  Policies
                </button>
                <button 
                  onClick={() => {
                    setShowContact(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                >
                  Contact Us
                </button>
                <div className="pt-4 border-t border-zinc-100">
                  <a 
                    href={`https://www.instagram.com/${INSTAGRAM_ID}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold shadow-lg shadow-zinc-900/20"
                  >
                    <Instagram size={20} />
                    Follow on Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-zinc-900 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#ffffff33_0%,_transparent_50%)]" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
              >
                Premium Review <br />
                <span className="text-zinc-400">Marketing Solutions</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-zinc-400 mb-8 max-w-xl"
              >
                Discover high-quality products, professional sellers, and transparent refund policies. Get FREE products in exchange for reviews.. Join our community of smart shoppers today.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <button 
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-zinc-900 rounded-full font-bold hover:bg-zinc-100 transition-all flex items-center gap-2"
                >
                  Explore Catalog <ArrowRight size={20} />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="py-16 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-display font-bold mb-2">Product Catalog</h2>
                <p className="text-zinc-500">Browse our active campaigns and start earning.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto min-w-0">
                <div className="relative shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products, keywords..."
                    className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 min-w-0 flex-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-zinc-900 text-white' 
                          : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.product_number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                      <img 
                        src={product.productpictures || `https://picsum.photos/seed/${product.product_number}/400/300`} 
                        alt={product.keywords}
                        className="w-full h-full object-contain transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          {product.Category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className={`px-3 py-1 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${
                          product.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-zinc-500'
                        }`}>
                          {product.status || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-zinc-900 line-clamp-1">{product.keywords}</h3>
                        <span className="text-xs font-mono text-zinc-400">#{product.product_number}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag size={14} className="text-zinc-400" />
                        <span className="text-sm text-zinc-500">{product.store_name}</span>
                      </div>

                      <div className="mb-6">
                        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                          <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">Price</p>
                          <p className="font-display font-bold text-zinc-900">${product.Price}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex items-start gap-3">
                          <Clock size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-zinc-400 uppercase font-bold">Refund Timing</p>
                            <p className="text-sm text-zinc-600 leading-tight">{product.Refundtiming}</p>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-full py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                      >
                        View Details <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1));
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-zinc-400 transition-all"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  
                  <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none pb-1 sm:pb-0">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Only show a few page numbers around current page if there are many
                      if (
                        totalPages > 7 && 
                        page !== 1 && 
                        page !== totalPages && 
                        Math.abs(page - currentPage) > 1
                      ) {
                        if (page === 2 || page === totalPages - 1) return <span key={page} className="px-1 text-zinc-400">...</span>;
                        return null;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            currentPage === page 
                              ? 'bg-zinc-900 text-white' 
                              : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1));
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2 rounded-xl border border-zinc-200 bg-white text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-zinc-400 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-full mb-4">
                  <Search size={32} className="text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-zinc-500">Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer" className="bg-white border-t border-zinc-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg">
                  R
                </div>
                <span className="font-display font-bold text-lg tracking-tight">ReviewPerk</span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-6">
                The most trusted platform for review marketing. We connect high-quality brands with professional reviewers to build authentic growth.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><button onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-zinc-500 hover:text-zinc-900">Catalog</button></li>
                <li><button onClick={() => setShowHowItWorks(true)} className="text-sm text-zinc-500 hover:text-zinc-900">How it Works</button></li>
                <li><button onClick={() => setShowPolicies(true)} className="text-sm text-zinc-500 hover:text-zinc-900">Buyer Policies</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setShowContact(true)} className="text-sm text-zinc-500 hover:text-zinc-900">Contact Us</button></li>
                <li><button onClick={() => setShowPrivacy(true)} className="text-sm text-zinc-500 hover:text-zinc-900">Privacy Policy</button></li>
                <li><button onClick={() => setShowTerms(true)} className="text-sm text-zinc-500 hover:text-zinc-900">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-400">© 2024 ReviewPerk. All rights reserved.</p>
           
          </div>
        </div>
      </footer>

      {/* How it Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowItWorks(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <HelpCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-display font-bold">How it Works</h2>
                </div>
                <button 
                  onClick={() => setShowHowItWorks(false)}
                  className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="relative grid grid-cols-1 md:grid-cols-5 gap-12">
                  {/* Connecting Line (Desktop) */}
                  <div className="hidden md:block absolute top-8 left-[10%] w-[80%] h-0.5 bg-zinc-100 z-0" />

                  {[
                    {
                      step: 1,
                      title: "Select & Message",
                      desc: "Browse our catalog, pick your favorite product, and message us on Instagram with the product details.",
                      icon: <MessageSquare size={24} />,
                      color: "bg-blue-500"
                    },
                    {
                      step: 2,
                      title: "Check Availability",
                      desc: "We instantly verify if the product is available for review and provide you with the specific instructions.",
                      icon: <CheckCircle2 size={24} />,
                      color: "bg-emerald-500"
                    },
                    {
                      step: 3,
                      title: "Purchase Product",
                      desc: "Follow our search instructions to find the correct store and purchase the product at full price.",
                      icon: <ShoppingBag size={24} />,
                      color: "bg-amber-500"
                    },
                    {
                      step: 4,
                      title: "Review Product",
                      desc: "After receiving and testing the product, leave an honest review with photos/videos after 5-7 days.",
                      icon: <Star size={24} />,
                      color: "bg-purple-500"
                    },
                    {
                      step: 5,
                      title: "PayPal Refund",
                      desc: "Once your review is verified, we process your full refund via PayPal within 24 to 72 hours.",
                      icon: <CreditCard size={24} />,
                      color: "bg-zinc-900"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="relative flex flex-col items-center text-center group z-10">
                      <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {item.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-zinc-50 rounded-full flex items-center justify-center text-xs font-bold text-zinc-900 shadow-sm z-20">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-16 p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck size={32} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Safe & Secure Platform</h4>
                    <p className="text-zinc-500 leading-relaxed">
                      We ensure that all our sellers are verified and our refund process is transparent. Your satisfaction and trust are our top priorities.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowHowItWorks(false);
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all whitespace-nowrap"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Policies Modal */}
      <AnimatePresence>
        {showPolicies && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPolicies(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <Scale size={24} />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Buyer Policy & Instructions</h2>
                </div>
                <button 
                  onClick={() => setShowPolicies(false)}
                  className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: "1",
                      title: "Purchase Limit",
                      icon: <Package className="text-blue-500" size={20} />,
                      content: "Each buyer can purchase only 1 item from a store unless stated otherwise."
                    },
                    {
                      id: "2",
                      title: "Product Search Rule",
                      icon: <Search className="text-amber-500" size={20} />,
                      content: "Buyers must search the product using the given keyword. Do not search using the ASIN or product link. Always confirm the correct store."
                    },
                    {
                      id: "3",
                      title: "Review Guidelines",
                      icon: <Star className="text-purple-500" size={20} />,
                      content: "Reviews should be at least 3–4 lines. Pictures or videos are preferred. Submit your review 5–7 days after receiving the product."
                    },
                    {
                      id: "4",
                      title: "Refund Policy",
                      icon: <CreditCard className="text-emerald-500" size={20} />,
                      content: "Refund processed within 1–3 business days after verification (excluding weekends/holidays). Some sellers may take 7–10 days."
                    },
                    {
                      id: "5",
                      title: "Returns & Changes",
                      icon: <AlertCircle className="text-red-500" size={20} />,
                      content: "Returning products or deleting reviews after refund request may affect your eligibility and processing."
                    },
                    {
                      id: "6",
                      title: "Payment Rules",
                      icon: <DollarSign className="text-zinc-900" size={20} />,
                      content: "Do not use coupons, gift cards, or Amazon balance unless explicitly mentioned. Complete order exactly as instructed."
                    },
                    {
                      id: "7",
                      title: "Order Submission",
                      icon: <FileText className="text-indigo-500" size={20} />,
                      content: "After purchase, fill the form with: PayPal email, Product screenshot, and Order screenshot. Late submissions delay refunds."
                    },
                    {
                      id: "8",
                      title: "Important Notice",
                      icon: <ShieldCheck className="text-zinc-900" size={20} />,
                      content: "Any fraud or misuse may result in order cancellation or blocked account. We maintain a fair community for everyone."
                    }
                  ].map((policy) => (
                    <div key={policy.id} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                          {policy.icon}
                        </div>
                        <h3 className="font-bold text-zinc-900">{policy.id}. {policy.title}</h3>
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed">
                        {policy.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="text-amber-600 shrink-0 mt-1" size={20} />
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Failure to follow these instructions may result in delayed refunds or account suspension. Please read carefully before proceeding with any order.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContact(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <Mail size={24} />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Contact Us</h2>
                </div>
                <button 
                  onClick={() => setShowContact(false)}
                  className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="text-center">
                  <p className="text-zinc-500 mb-8">
                    Have questions or need support? Reach out to us through our official channels.
                  </p>
                  
                  <div className="space-y-4">
                    <a 
                      href={`https://www.instagram.com/${INSTAGRAM_ID}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/20"
                    >
                      <Instagram size={20} />
                      Message on Instagram
                    </a>
                    
                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={18} className="text-zinc-400" />
                        <h4 className="font-bold text-sm">Support Hours</h4>
                      </div>
                      <p className="text-sm text-zinc-500">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacy(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={24} />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Privacy Policy</h2>
                </div>
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto prose prose-zinc max-w-none">
                <h3 className="text-xl font-bold mb-4">1. Information We Collect</h3>
                <p className="text-zinc-500 mb-6">
                  We collect information you provide directly to us, such as when you contact us via Instagram or provide details for refund processing (e.g., PayPal email, order screenshots).
                </p>
                
                <h3 className="text-xl font-bold mb-4">2. How We Use Your Information</h3>
                <p className="text-zinc-500 mb-6">
                  We use the information we collect to:
                  <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Process and verify your refund requests.</li>
                    <li>Communicate with you about products and orders.</li>
                    <li>Ensure compliance with our buyer policies.</li>
                    <li>Improve our platform and services.</li>
                  </ul>
                </p>

                <h3 className="text-xl font-bold mb-4">3. Data Security</h3>
                <p className="text-zinc-500 mb-6">
                  We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.
                </p>

                <h3 className="text-xl font-bold mb-4">4. Third-Party Services</h3>
                <p className="text-zinc-500 mb-6">
                  Our platform may contain links to third-party websites (e.g., Instagram, PayPal). We are not responsible for the privacy practices of these third parties.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTerms(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-2xl font-display font-bold">Terms of Service</h2>
                </div>
                <button 
                  onClick={() => setShowTerms(false)}
                  className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto prose prose-zinc max-w-none">
                <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
                <p className="text-zinc-500 mb-6">
                  By accessing or using ReviewPerk, you agree to be bound by these Terms of Service and our Buyer Policies.
                </p>
                
                <h3 className="text-xl font-bold mb-4">2. User Conduct</h3>
                <p className="text-zinc-500 mb-6">
                  You agree to use the platform only for lawful purposes and in accordance with our instructions. Any fraudulent activity or misuse will result in immediate suspension.
                </p>

                <h3 className="text-xl font-bold mb-4">3. Refund Disclaimer</h3>
                <p className="text-zinc-500 mb-6">
                  Refunds are subject to verification of reviews and compliance with seller instructions. We reserve the right to deny refunds if policies are violated.
                </p>

                <h3 className="text-xl font-bold mb-4">4. Limitation of Liability</h3>
                <p className="text-zinc-500 mb-6">
                  ReviewPerk is a marketing platform. We are not responsible for product quality or shipping issues, which are the responsibility of the respective sellers.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 hover:bg-white transition-all shadow-sm"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-zinc-100">
                <img 
                  src={selectedProduct.productpictures || `https://picsum.photos/seed/${selectedProduct.product_number}/800/600`} 
                  alt={selectedProduct.keywords}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                <div className="absolute bottom-6 left-6 md:hidden">
                  <h2 className="text-2xl font-display font-bold text-white mb-1">{selectedProduct.keywords}</h2>
                  <p className="text-zinc-300 text-sm">{selectedProduct.store_name}</p>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="hidden md:block mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {selectedProduct.Category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">#{selectedProduct.product_number}</span>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-zinc-900 mb-2">{selectedProduct.keywords}</h2>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <ShoppingBag size={16} />
                    <span className="font-medium">{selectedProduct.store_name}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1 tracking-wider">Price</p>
                  <p className="text-2xl font-display font-bold text-zinc-900">${selectedProduct.Price}</p>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Info size={18} className="text-zinc-900" />
                      </div>
                      <h4 className="font-bold text-sm">Instructions</h4>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {selectedProduct.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0">
                      <Clock size={20} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-bold">Refund Timing</p>
                      <p className="text-sm font-medium text-zinc-900">{selectedProduct.Refundtiming}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 relative group">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold mb-2 tracking-wider">Order Message (Copy this)</p>
                    <div className="bg-white p-3 rounded-xl border border-zinc-100 text-sm text-zinc-600 font-mono leading-relaxed break-words">
                      Hi, I want to order:<br />
                      Product: {selectedProduct.keywords}<br />
                      Number: {selectedProduct.product_number}<br />
                      Store: {selectedProduct.store_name}
                    </div>
                    <button 
                      onClick={() => {
                        const msg = `Hi, I want to order:\nProduct: ${selectedProduct.keywords}\nNumber: ${selectedProduct.product_number}\nStore: ${selectedProduct.store_name}`;
                        navigator.clipboard.writeText(msg);
                        alert('Message copied to clipboard!');
                      }}
                      className="mt-2 w-full py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={14} /> Copy Message
                    </button>
                  </div>

                  <button 
                    onClick={() => handleOrder(selectedProduct)}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-900/20"
                  >
                    <Instagram size={20} />
                    Order via Instagram
                  </button>
                  <p className="text-center text-[10px] text-zinc-400 font-medium">
                    By clicking, you will be redirected to @{INSTAGRAM_ID} to complete your order.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
