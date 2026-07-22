const fs = require('fs');
const path = require('path');

const appFilePath = path.join('c:', 'Users', 'Cesar', 'Desktop', 'Work', 'Etzashoppe', 'src', 'App.tsx');
let content = fs.readFileSync(appFilePath, 'utf8');

// Redesigned return block
const redesignedReturn = `  return (
    <div className="min-h-screen bg-bg-primary flex flex-col noise-overlay">
      
      {/* HEADER COMPONENT */}
      <Header 
        currentPage={currentPage} 
        cartCount={cart.length} 
        wishlistCount={wishlist.length}
        onNavigate={handleNavigate} 
      />

      {/* MAIN CONTENT PORT PORTION WITH TRANSITIONS */}
      <main className="flex-grow w-full pt-16">
        <AnimatePresence mode="wait">
          
          {/* A. HOMEPAGE */}
          {currentPage === 'home' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full flex flex-col gap-16 pb-16"
              id="homepage-view"
            >
              {/* Full-bleed Hero Section */}
              <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-bg-deep select-none">
                {/* Background Image with Scrim */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/src/assets/images/hero_fullbleed.png"
                    alt="ETZ A Shoppe flatlay vintage garments"
                    className="w-full h-full object-cover scale-102 filter brightness-[0.4] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-accent-warm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-block">
                    Tabogon's Curated Secondhand Finds
                  </span>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl text-white font-extrabold tracking-tight leading-[1.05] max-w-4xl mx-auto text-balance">
                    Good clothes. Already lived in. Still got plenty left to give.
                  </h1>
                  <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-normal text-balance">
                    Hand-checked secondhand garments from Loong, Tabogon, Cebu. Checked, washed, and sorted by hand before they reach you.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center items-center">
                    <button
                      onClick={() => handleNavigate('shop', 'all')}
                      className="w-full sm:w-auto bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-md border-none"
                    >
                      <span>Shop latest arrivals</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleNavigate('how-it-works')}
                      className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 active:scale-[0.98] cursor-pointer backdrop-blur-sm"
                    >
                      How it works
                    </button>
                  </div>
                </div>
              </div>

              {/* Contained content wrapper */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-24">
                {/* Why Shop Here Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Our Promise</span>
                    <h2 className="font-heading text-3xl sm:text-4xl text-text-primary tracking-tight font-extrabold leading-tight text-balance">
                      You know exactly what you are getting
                    </h2>
                    <p className="text-[15px] text-text-secondary leading-relaxed max-w-md text-balance">
                      Every item is inspected under high-intensity light for holes, stains, and wear, then flat-measured in inches so it fits right.
                    </p>
                  </div>
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                      <div className="w-10 h-10 rounded-full bg-accent/8 flex items-center justify-center text-accent">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-lg text-text-primary font-bold">100% Hand-Checked</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        No dusty piles or surprise stains. If an item has a minor wear detail, we describe it honestly in the condition notes.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                      <div className="w-10 h-10 rounded-full bg-accent/8 flex items-center justify-center text-accent">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-lg text-text-primary font-bold">Honest Sizing Details</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Vintage and secondhand tags lie. We measure each piece flat so you can match it against your own clothes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shop By Category Bento Grid */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border pb-6">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Collections</span>
                      <h2 className="font-heading text-3xl font-extrabold text-text-primary tracking-tight">
                        Find your size, your style
                      </h2>
                    </div>
                    <button
                      onClick={() => handleNavigate('shop', 'all')}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1 group cursor-pointer border-none bg-transparent"
                    >
                      <span>View all collections</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bento 1: Large Men's card spanning 2 columns */}
                    <div
                      onClick={() => handleNavigate('shop', 'mens')}
                      className="md:col-span-2 group cursor-pointer bg-white border border-border rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative aspect-[16/9] md:aspect-[21/9] bg-[#EBE9E3] overflow-hidden">
                        <img
                          src="/src/assets/images/mens_vintage_jacket_1783176811459.jpg"
                          alt="Men's collection"
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white space-y-1">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-accent-warm">01 // Curated</span>
                          <h4 className="font-heading text-2xl font-bold text-white">Men's Collection</h4>
                          <p className="text-xs text-white/70">Vintage jackets, corduroy pieces, button-ups & denim</p>
                        </div>
                      </div>
                    </div>

                    {/* Bento 2: Women's vertical card */}
                    <div
                      onClick={() => handleNavigate('shop', 'womens')}
                      className="group cursor-pointer bg-white border border-border rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative aspect-[16/9] md:aspect-auto md:h-full bg-[#EBE9E3] overflow-hidden">
                        <img
                          src="/src/assets/images/womens_floral_dress_1783176824055.jpg"
                          alt="Women's collection"
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white space-y-1">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-accent-warm">02 // Clean</span>
                          <h4 className="font-heading text-2xl font-bold text-white">Women's Section</h4>
                          <p className="text-xs text-white/70">Flax linen dresses, skirts & casual tops</p>
                        </div>
                      </div>
                    </div>

                    {/* Bento 3: Kids card */}
                    <div
                      onClick={() => handleNavigate('shop', 'kids')}
                      className="group cursor-pointer bg-white border border-border rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative aspect-[16/9] bg-[#EBE9E3] overflow-hidden">
                        <img
                          src="/src/assets/images/kids_denim_overalls_1783176838795.jpg"
                          alt="Kids clothing"
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white space-y-1">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-accent-warm">03 // Durable</span>
                          <h4 className="font-heading text-xl font-bold text-white">Kids' Clothing</h4>
                          <p className="text-xs text-white/70">Comfortable overalls & playwear</p>
                        </div>
                      </div>
                    </div>

                    {/* Bento 4: Accessories card spanning 2 columns */}
                    <div
                      onClick={() => handleNavigate('shop', 'accessories')}
                      className="md:col-span-2 group cursor-pointer bg-white border border-border rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative aspect-[16/9] bg-[#EBE9E3] overflow-hidden">
                        <img
                          src="/src/assets/images/vintage_leather_bag_1783176854555.jpg"
                          alt="Accessories"
                          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white space-y-1">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-accent-warm">04 // Timeless</span>
                          <h4 className="font-heading text-xl font-bold text-white">Accessories</h4>
                          <p className="text-xs text-white/70">Woven totes, leather messenger satchels & straw bags</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How It Works Section */}
                <div className="bg-surface-tint border border-border p-8 sm:p-12 rounded-3xl space-y-8">
                  <div className="max-w-xl space-y-2">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Process</span>
                    <h3 className="font-heading text-2xl sm:text-3xl text-text-primary tracking-tight font-extrabold">Ordering is completely direct</h3>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      No third-party processors or automatic credit card billing. Everything is personal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                      <span className="font-mono text-xs font-bold text-accent">01 // REQUEST</span>
                      <h4 className="font-heading text-base font-bold text-text-primary">Add items & Checkout</h4>
                      <p className="text-xs text-text-secondary leading-normal">
                        Since everything is 1-of-1, add your piece to the cart and submit your details. You pay ₱0 upfront.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                      <span className="font-mono text-xs font-bold text-accent">02 // CONFIRM</span>
                      <h4 className="font-heading text-base font-bold text-text-primary">Owner checks & texts</h4>
                      <p className="text-xs text-text-secondary leading-normal">
                        We verify availability and message you personally via SMS or Messenger to coordinate your order.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border space-y-3">
                      <span className="font-mono text-xs font-bold text-accent">03 // HANDOVER</span>
                      <h4 className="font-heading text-base font-bold text-text-primary">GCash or Cash on pickup</h4>
                      <p className="text-xs text-text-secondary leading-normal">
                        Pay securely via GCash transfer or cash when picking up in Loong, Tabogon. We also arrange Cebu shipping.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recently Viewed Items */}
                {renderRecentlyViewedSection()}

                {/* Location and Closing CTA */}
                <div className="bg-bg-deep text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 select-none shadow-[0_10px_30px_rgba(45,106,79,0.15)] border-none">
                  <div className="space-y-3 max-w-xl text-center md:text-left">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-accent-warm">Loong, Tabogon, Cebu</span>
                    <h3 className="font-heading text-2xl sm:text-3xl text-white font-bold tracking-tight">Pickup locally or shipped straight to you</h3>
                    <p className="text-xs text-white/80 leading-relaxed font-normal">
                      Save on shipping fees by picking up your clean garments in Tabogon! Or we can arrange courier delivery across nearby Cebu towns.
                    </p>
                  </div>
                  <button
                    onClick={() => handleNavigate('shop', 'all')}
                    className="w-full md:w-auto bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-8 py-3.5 rounded-full shrink-0 cursor-pointer transition-all duration-300 active:scale-[0.98] shadow-md border-none"
                  >
                    Start shopping
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* B. SHOP PAGE CATALOG */}
          {currentPage === 'shop' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8"
              id="shop-view"
            >
              {activeProduct ? (
                <ProductDetail 
                  product={activeProduct} 
                  onBack={() => setSelectedProductId(null)} 
                  onAddToCart={handleAddToCart}
                  isInCart={cart.some(item => item.product.id === activeProduct.id)}
                  isSaved={wishlist.includes(activeProduct.id)}
                  onToggleSave={() => handleToggleWishlist(activeProduct.id)}
                />
              ) : (
                <div className="space-y-8">
                  {/* Shop Intro Area */}
                  <div className="border-b border-border pb-6 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                      <Sparkles className="w-4 h-4" />
                      <span>Curated & Clean Inventory</span>
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-text-primary capitalize">
                      {activeCategoryFilter === 'all' ? 'All Finds' : \`\${activeCategoryFilter}'s Collection\`}
                    </h1>
                    <p className="text-[14px] text-text-secondary max-w-2xl">
                      New vintage and secondhand clothes hand-checked and added every week. Use the filters below to find your perfect size or condition.
                    </p>
                  </div>

                  {/* Filter Toolbar controls */}
                  <div className="bg-white border border-border p-4.5 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    {/* Left: Category tabs */}
                    <div className="flex flex-wrap gap-1.5">
                      {(['all', 'mens', 'womens', 'kids', 'accessories'] as const).map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCategoryFilter(cat)}
                          className={\`text-xs px-4 py-2 font-semibold rounded-lg transition-colors cursor-pointer capitalize border-none \${
                            activeCategoryFilter === cat
                              ? 'bg-[#2D6A4F] text-white shadow-xs'
                              : 'bg-surface-tint text-text-primary hover:bg-[#EBE9E3]'
                          }\`}
                          id={\`filter-tab-\${cat}\`}
                        >
                          {cat === 'all' ? 'Show All' : cat === 'mens' ? "Men's" : cat === 'womens' ? "Women's" : cat}
                        </button>
                      ))}
                    </div>

                    {/* Right: Condition & Size Dropdowns */}
                    <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto mt-4 lg:mt-0">
                      {/* Condition Filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Grade:</span>
                        <select
                          value={activeConditionFilter}
                          onChange={(e) => setActiveConditionFilter(e.target.value)}
                          className="bg-white border border-border rounded-lg text-xs px-3 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                          id="select-filter-condition"
                        >
                          {uniqueConditions.map((cond, idx) => (
                            <option key={idx} value={cond}>
                              {cond === 'all' ? 'All Grades' : cond}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sizing Filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Size:</span>
                        <select
                          value={activeSizeFilter}
                          onChange={(e) => setActiveSizeFilter(e.target.value)}
                          className="bg-white border border-border rounded-lg text-xs px-3 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                          id="select-filter-size"
                        >
                          {uniqueSizes.map((sz, idx) => (
                            <option key={idx} value={sz}>
                              {sz === 'all' ? 'All Sizes' : sz === 'kids' ? 'Kids Sizes' : sz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT SHOP BY SIZE SELECTOR */}
                  <div className="bg-white border border-border p-5 rounded-2xl space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
                      <span className="text-[11px] font-mono tracking-wider font-bold text-text-secondary uppercase">Shop by Size:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map((sz, idx) => {
                        const isActive = activeSizeFilter === sz;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveSizeFilter(sz)}
                            className={\`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border-none \${
                              isActive 
                                ? 'bg-[#2D6A4F] text-white ring-2 ring-[#2D6A4F]/10 shadow-xs font-bold' 
                                : 'bg-white border border-border text-text-primary hover:bg-surface-tint'
                            }\`}
                            id={\`size-pill-\${sz}\`}
                          >
                            {sz === 'all' ? 'All Sizes' : sz === 'kids' ? 'Kids Sizes' : \`Size \${sz}\`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active filters summary */}
                  {(activeConditionFilter !== 'all' || activeSizeFilter !== 'all' || activeCategoryFilter !== 'all') && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-text-secondary">Active filters:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {activeCategoryFilter !== 'all' && (
                          <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium capitalize">
                            Category: {activeCategoryFilter}
                          </span>
                        )}
                        {activeConditionFilter !== 'all' && (
                          <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium">
                            Grade: {activeConditionFilter}
                          </span>
                        )}
                        {activeSizeFilter !== 'all' && (
                          <span className="bg-surface-tint text-text-primary px-2.5 py-0.5 rounded border border-border font-medium">
                            Size: {activeSizeFilter}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setActiveCategoryFilter('all');
                            setActiveConditionFilter('all');
                            setActiveSizeFilter('all');
                          }}
                          className="text-accent underline font-bold cursor-pointer hover:text-accent-hover transition-colors border-none bg-transparent"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Product Grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="bg-white border border-border py-20 text-center rounded-2xl">
                      <AlertCircle className="w-12 h-12 text-[#6B6B65]/35 mx-auto mb-3" />
                      <p className="font-heading text-lg font-bold text-text-primary">No matching garments found</p>
                      <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                        Every single piece at ETZ A Shoppe is one-of-one. Try clearing your filters or checking other categories for fresh arrivals!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={handleProductClick}
                          isSaved={wishlist.includes(product.id)}
                          onToggleSave={handleToggleWishlist}
                        />
                      ))}
                    </div>
                  )}

                  {/* Recently Viewed Items */}
                  {renderRecentlyViewedSection()}
                </div>
              )}
            </motion.div>
          )}

          {/* WISHLIST PAGE */}
          {currentPage === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8"
              id="wishlist-view"
            >
              <div className="border-b border-border pb-6 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Heart className="w-4 h-4 fill-[#2D6A4F] text-[#2D6A4F]" />
                  <span>Your Saved Finds</span>
                </div>
                <h1 className="font-heading text-3xl font-bold text-text-primary">
                  Wishlist & Saved Items
                </h1>
                <p className="text-[14px] text-text-secondary max-w-2xl">
                  Keep track of items you love. Since everything at ETZ A Shoppe is a 1-of-1 unique clothing find, you can save items here and easily review them or add them to your cart!
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div className="bg-white border border-border py-20 text-center rounded-2xl max-w-3xl mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <Heart className="w-12 h-12 text-[#6B6B65]/35 mx-auto mb-3" />
                  <p className="font-heading text-lg font-bold text-text-primary">Your wishlist is currently empty</p>
                  <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                    Browse our clean, hand-checked catalog of secondhand garments and click the heart icon to save things for later!
                  </p>
                  <button
                    onClick={() => handleNavigate('shop', 'all')}
                    className="mt-6 bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-2.5 rounded-full text-xs transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5 active:scale-[0.98] uppercase tracking-wider border-none"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products
                      .filter(p => wishlist.includes(p.id))
                      .map((product) => (
                        <div key={product.id} className="relative flex flex-col h-full bg-white border border-border rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                          <div className="flex-grow">
                            <ProductCard
                              product={product}
                              onClick={handleProductClick}
                              isSaved={true}
                              onToggleSave={handleToggleWishlist}
                            />
                          </div>
                          {!product.isSold && (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="mt-3 w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] border-none"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => handleNavigate('shop', 'all')}
                      className="border border-border hover:bg-surface-tint text-text-primary font-semibold px-6 py-2.5 rounded-full text-xs transition-all cursor-pointer bg-white active:scale-[0.98]"
                    >
                      Return to Shop
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* C. HOW IT WORKS PAGE */}
          {currentPage === 'how-it-works' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 py-10 w-full space-y-12"
              id="how-it-works-view"
            >
              <div className="border-b border-border pb-6 text-center space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">How Ordering Works</h1>
                <p className="text-[14px] text-text-secondary max-w-xl mx-auto">
                  Transparent, direct, and straightforward. We don't utilize third-party checkout servers. Everything is handled personally with the owner in Tabogon.
                </p>
              </div>

              {/* Numbered Steps List */}
              <div className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-border">
                <div className="relative border-l border-border ml-4 pl-6 space-y-10 py-2">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-[37px] top-0 bg-[#D4A853] text-[#1C1C1A] w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
                      1
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Browse and Add to Cart</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Every secondhand piece is carefully checked and unique (1-of-1). If you see something you love, select your size and add it to your shopping cart before someone else snags it!
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-[37px] top-0 bg-[#2D6A4F] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
                      2
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Fill Out Checkout Form</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Enter your name, preferred delivery address or Tabogon pickup option, and phone number. **We collect ₱0 upfront, and we never ask for your card details.**
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-[37px] top-0 bg-[#1C1C1A] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
                      3
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Owner Review & Confirmation</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Once submitted, our owner reviews your requested garments and reaches out to you within a day via phone, email, or Facebook. We confirm that the one-of-one item is sanitized and ready.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className="absolute -left-[37px] top-0 bg-[#D4A853] text-[#1C1C1A] w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
                      4
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Secure Direct Payment</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      We finalize the checkout total together. You pay simply via **GCash transfer** directly to our store number, or pay **Cash on Pickup/Delivery** if picking up locally in Loong.
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <span className="absolute -left-[37px] top-0 bg-[#2D6A4F] text-white w-6 h-6 rounded-full flex items-center justify-center font-heading text-xs font-bold shadow-xs">
                      5
                    </span>
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1">Dispatch or Local Handover</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Pick up your neatly sorted package from our storefront in Loong, Tabogon, or wait comfortably at home for our islandwide delivery run. Hand-checked thrift fashion made easy!
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Accordion block */}
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-bold text-text-primary text-center">Frequently Asked Questions</h2>
                <div className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-text-primary">Are all these clothes secondhand?</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Yes! Every piece in ETZ A Shoppe is a curated secondhand, vintage, or pre-loved garment. We sort through bales by hand so you only see the finest, cleanest pieces.
                    </p>
                  </div>
                  <hr className="border-border" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-text-primary">Can I reserve an item before checkout?</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      We operate strictly on a first-come, first-served basis. Submitting an order on the site reserves the item for you for 24 hours while we establish contact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => handleNavigate('shop', 'all')}
                  className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-8 py-3 rounded-full transition-all cursor-pointer shadow-sm active:scale-[0.98] border-none"
                >
                  Start Browsing All Finds
                </button>
              </div>
            </motion.div>
          )}

          {/* D. ABOUT OUR STORY PAGE */}
          {currentPage === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 py-10 w-full space-y-10"
              id="about-view"
            >
              <div className="border-b border-border pb-6 text-center space-y-2">
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">Our Story</h1>
                <p className="text-xs text-accent uppercase font-bold tracking-widest">A thrift shop that started with one closet</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
                  <p>
                    ETZ A Shoppe started in Loong, Tabogon in 2022, sorting and reselling quality secondhand clothes to neighbors who wanted beautiful, durable garments without the exhausting guesswork.
                  </p>
                  <p>
                    Unlike generic ukay-ukay stalls where you have to spend hours digging through unsorted piles or dealing with dusty clothing, we do all the hard work for you. Every item is washed, sanitized, ironed, measured, and photographed.
                  </p>
                  <p>
                    We believe thrift fashion should feel curated, personal, and clean. That's why we describe any minor flaws in detail so there are zero surprises when your package arrives.
                  </p>
                  <p className="font-bold text-accent">
                    - ETZ A Shoppe, Tabogon, Cebu
                  </p>
                </div>

                <div className="aspect-4/3 rounded-2xl overflow-hidden border border-border bg-[#EBE9E3] shadow-sm">
                  <img
                    src="/src/assets/images/womens_floral_dress_1783176824055.jpg"
                    alt="Linen floral dress cottagecore aesthetic"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Local Trust banner */}
              <div className="bg-white border border-border p-8 rounded-2xl text-center space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <span className="font-heading text-xl font-bold text-accent block">Islandwide Cebu Delivery & Local Pickups</span>
                <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
                  We are based in Loong, Tabogon. You are always welcome to pick up your orders locally at our storefront, or we can coordinate affordable delivery through Cebu local courier services.
                </p>
              </div>
            </motion.div>
          )}

          {/* E. FAQ PAGE */}
          {currentPage === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto px-4 py-10 w-full space-y-8"
              id="faq-view"
            >
              <div className="border-b border-border pb-6 text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold text-text-primary">Common Questions</h1>
                <p className="text-[14px] text-text-secondary">Everything you should know about condition grades, GCash payments, and deliveries.</p>
              </div>

              <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                {/* Q1 */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base font-bold text-accent flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
                    <span>What do condition grades mean?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
                    We grade every single piece using three specific labels:
                    <br />
                    • <strong>Like New:</strong> Pristine condition with no visible wear, fading, or damage. Feels brand new.
                    <br />
                    • <strong>Gently Loved:</strong> Very clean, minor fabric softening from previous wash, but highly durable with zero tears.
                    <br />
                    • <strong>Well-Loved:</strong> Comfortably worn with charming character. Minor repairs or slight fading may exist, but described honestly.
                  </p>
                </div>

                <hr className="border-border" />

                {/* Q2 */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base font-bold text-accent flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
                    <span>How does sizing work?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
                    Secondhand tags vary wildy by brand. To keep things honest, we lay each garment flat and measure the exact chest, length, and waist dimensions. We list these dimensions in the description box of each item page.
                  </p>
                </div>

                <hr className="border-border" />

                {/* Q3 */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base font-bold text-accent flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
                    <span>Do you accept returns or exchanges?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
                    Since our items are unique, single-piece secondhand clothes, we cannot accept returns or exchanges. We recommend checking the listed measurement notes thoroughly before ordering.
                  </p>
                </div>

                <hr className="border-border" />

                {/* Q4 */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base font-bold text-accent flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
                    <span>What payment methods do you accept?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
                    We accept <strong>GCash mobile transfer</strong> directly to our store number. We also accept cash payments on local pickup or delivery inside Loong, Tabogon.
                  </p>
                </div>

                <hr className="border-border" />

                {/* Q5 */}
                <div className="space-y-1.5">
                  <h3 className="font-heading text-base font-bold text-accent flex items-center gap-2">
                    <HelpCircle className="w-4.5 h-4.5 text-accent shrink-0" />
                    <span>Where do you deliver, and how much?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-7">
                    We deliver across Tabogon and neighboring towns in Cebu. Shipping rates typically depend on distance and are organized directly over the phone or messenger. Local pickup at Loong, Tabogon is completely free!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* F. CONTACT PAGE */}
          {currentPage === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 py-10 w-full space-y-10"
              id="contact-view"
            >
              <div className="border-b border-border pb-6 text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold text-text-primary">Get in Touch</h1>
                <p className="text-[14px] text-text-secondary">Questions about size, condition, or a pending order? Message us directly!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Contact form */}
                <div className="md:col-span-7 bg-white border border-border p-6 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <h3 className="font-heading text-lg font-bold text-accent">Send us a direct message</h3>
                  
                  {contactSubmitted ? (
                    <div className="bg-accent/8 border border-accent/20 p-6 rounded-xl text-center space-y-2">
                      <Check className="w-8 h-8 text-accent mx-auto" />
                      <strong className="text-sm font-bold text-text-primary block">Message Sent</strong>
                      <p className="text-xs text-text-secondary">We will read your feedback and contact you at your email address within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Maria Clara"
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="e.g. maria@gmail.com"
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">Your Message</label>
                        <textarea
                          required
                          rows={4}
                          value={contactMsgText}
                          onChange={(e) => setContactMsgText(e.target.value)}
                          placeholder="I am looking for denim overalls or wondering about order details..."
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer active:scale-[0.98] border-none"
                      >
                        Send message
                      </button>
                    </form>
                  )}
                </div>

                {/* Direct info */}
                <div className="md:col-span-5 bg-surface-tint border border-border p-6 rounded-2xl space-y-6">
                  <h3 className="font-heading text-lg font-bold text-accent">Direct Store Info</h3>
                  
                  <div className="space-y-4 text-xs sm:text-sm text-text-primary">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Email</strong>
                        <a href={\`mailto:\${shopEmail}\`} className="hover:underline text-accent font-medium">{shopEmail}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Phone Number</strong>
                        <a href={\`tel:\${shopPhone}\`} className="hover:underline text-accent font-medium">{shopPhone}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">GCash Receiver</strong>
                        <span className="font-mono font-bold text-accent">{shopGcash}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase text-text-secondary font-mono tracking-wider font-bold">Location</strong>
                        <span>Loong, Tabogon, Cebu</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  <p className="text-xs text-text-secondary leading-relaxed italic">
                    We operate directly and personally. Reach out via email or phone call anytime!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* G. CART PAGE */}
          {currentPage === 'cart' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 py-10 w-full space-y-8"
              id="cart-view"
            >
              <div className="border-b border-border pb-4">
                <h1 className="font-heading text-3xl font-bold text-text-primary">Your Cart</h1>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-mono font-bold">Review sorted items before placing order</p>
              </div>

              {cart.length === 0 ? (
                <div className="bg-white border border-border py-20 text-center rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <ShoppingBag className="w-12 h-12 text-[#6B6B65]/35 mx-auto" />
                  <p className="font-heading text-lg font-bold text-text-primary">Your cart is currently empty</p>
                  <p className="text-xs text-text-secondary max-w-sm mx-auto">
                    Take a look at our freshly listed secondhand clothes and secure your favorite piece today!
                  </p>
                  <button
                    onClick={() => handleNavigate('shop', 'all')}
                    className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all cursor-pointer active:scale-[0.98] border-none"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Cart List Items */}
                  <div className="lg:col-span-8 space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="bg-white border border-border p-4 rounded-2xl flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-20 object-cover rounded-lg border border-border shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <h4 className="font-heading text-base font-bold text-text-primary leading-tight">{item.product.name}</h4>
                            <div className="flex gap-2 items-center flex-wrap text-xs text-text-secondary font-sans">
                              <span>Size: <strong className="font-mono text-text-primary font-bold">{item.product.size.split('(')[0].trim()}</strong></span>
                              <span>•</span>
                              <span className="text-accent font-semibold">{item.product.condition}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-2">
                          <div className="text-base font-bold text-text-primary font-mono">₱{item.product.price.toLocaleString()}</div>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="text-xs text-red-600 hover:underline cursor-pointer font-medium active:scale-95"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary card */}
                  <div className="lg:col-span-4 bg-surface-tint border border-border p-6 rounded-2xl space-y-6">
                    <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Order Summary</h3>
                    
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between text-text-secondary">
                        <span>Subtotal</span>
                        <span className="font-mono">₱{cart.reduce((acc, item) => acc + item.product.price, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-text-secondary">
                        <span>Tabogon Delivery</span>
                        <span className="italic text-xs font-semibold text-accent">Arranged with owner</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between font-bold text-text-primary text-base">
                        <span>Total:</span>
                        <span className="text-lg text-accent font-mono">₱{cart.reduce((acc, item) => acc + item.product.price, 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl text-[11px] text-text-secondary leading-relaxed border border-border">
                      * Delivery fees and payment transfers are finalized directly once we call or message you.
                    </div>

                    <button
                      onClick={() => handleNavigate('checkout')}
                      className="w-full bg-[#2D6A4F] hover:bg-[#245840] text-white font-bold py-3 px-4 rounded-xl text-center text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer block active:scale-[0.98] border-none"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* H. CHECKOUT FORM PAGE */}
          {currentPage === 'checkout' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8"
              id="checkout-view"
            >
              <div className="border-b border-border pb-4">
                <h1 className="font-heading text-3xl font-bold text-text-primary">Place Order Request</h1>
                <p className="text-xs text-text-secondary uppercase tracking-widest font-mono font-bold">Almost Done - No Online Payment Required</p>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-10 bg-white border border-border rounded-2xl shadow-sm">
                  <p className="text-sm">Please add items to cart first before checking out.</p>
                  <button onClick={() => handleNavigate('shop', 'all')} className="mt-4 bg-[#2D6A4F] text-white px-4 py-2 rounded-full text-xs border-none">
                    Go to shop
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Checkout Form */}
                  <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white border border-border p-6 rounded-3xl space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Your Contact & Shipping Info</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Juan dela Cruz"
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Mobile Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0912 345 6789"
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. juan@gmail.com"
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Preferred Follow-up Contact *</label>
                        <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                            <input
                              type="radio"
                              name="contact"
                              checked={contactMethod === 'phone'}
                              onChange={() => setContactMethod('phone')}
                              className="text-accent focus:ring-accent"
                            />
                            <span>SMS / Phone Call</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                            <input
                              type="radio"
                              name="contact"
                              checked={contactMethod === 'email'}
                              onChange={() => setContactMethod('email')}
                              className="text-accent focus:ring-accent"
                            />
                            <span>Email</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-text-primary">
                            <input
                              type="radio"
                              name="contact"
                              checked={contactMethod === 'facebook'}
                              onChange={() => setContactMethod('facebook')}
                              className="text-accent focus:ring-accent"
                            />
                            <span>Messenger</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Delivery or Pickup Method *</label>
                        <div className="flex gap-6 pt-1">
                          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-accent">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryMethod === 'delivery'}
                              onChange={() => setDeliveryMethod('delivery')}
                              className="text-accent focus:ring-accent"
                            />
                            <span>Islandwide Delivery</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-accent">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryMethod === 'pickup'}
                              onChange={() => setDeliveryMethod('pickup')}
                              className="text-accent focus:ring-accent"
                            />
                            <span>Local Pickup in Tabogon</span>
                          </label>
                        </div>
                      </div>

                      {deliveryMethod === 'delivery' && (
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Detailed Shipping Address *</label>
                          <textarea
                            required
                            rows={2}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street, Barangay, City/Town, Cebu, Philippines"
                            className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                          />
                        </div>
                      )}

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-mono tracking-wider font-bold text-text-secondary uppercase block">Optional Note (sizing questions / flaws check)</label>
                        <textarea
                          rows={2}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="e.g. Please let me know if the waist can stretch, or I confirm the condition..."
                          className="w-full bg-surface-tint-alt border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleNavigate('cart')}
                        className="text-xs font-bold text-accent hover:underline active:scale-95 transition-transform border-none bg-transparent"
                      >
                        Return to Cart
                      </button>
                      <button
                        type="submit"
                        className="bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-[0.98] border-none"
                        id="btn-place-order"
                      >
                        Place Order (₱0 Upfront)
                      </button>
                    </div>
                  </form>

                  {/* Sidebar summary */}
                  <div className="lg:col-span-5 bg-surface-tint border border-border p-6 rounded-3xl space-y-4">
                    <h3 className="font-heading text-lg font-bold text-accent border-b border-border pb-2">Order Summary</h3>
                    
                    <div className="divide-y divide-border space-y-2">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between py-2 text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-12 object-cover rounded border border-border"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <strong className="text-text-primary block leading-tight">{item.product.name}</strong>
                              <span className="text-[10px] text-text-secondary font-mono">({item.product.size.split('(')[0].trim()})</span>
                            </div>
                          </div>
                          <span className="font-bold text-text-primary font-mono">₱{item.product.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold text-text-primary">
                      <span>Items Subtotal:</span>
                      <span className="text-lg text-accent font-mono">₱{cart.reduce((acc, item) => acc + item.product.price, 0).toLocaleString()}</span>
                    </div>

                    <div className="bg-white border border-border p-4 rounded-xl text-xs text-text-secondary leading-relaxed space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                      <span className="font-bold text-[#2D6A4F] block uppercase tracking-wider text-[10px] font-mono">What Happens Next?</span>
                      <p>1. Order is logged in our owner portal instantly.</p>
                      <p>2. Owner checks the piece and texts/messages you within 24 hours.</p>
                      <p>3. Finalize GCash/Cash payment and physical handover/shipping. Zero card data collected!</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* I. ORDER CONFIRMATION PAGE */}
          {currentPage === 'order-confirmation' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto px-4 py-10 w-full"
            >
              <div className="bg-white border border-border p-8 sm:p-12 rounded-3xl space-y-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-accent/8 flex items-center justify-center text-accent mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h1 className="font-heading text-3xl font-bold text-text-primary">Got Your Order!</h1>
                  <p className="text-xs sm:text-[14px] text-text-secondary max-w-md mx-auto leading-relaxed">
                    We've successfully received your thrift clothing request. We will message or call you within a day to confirm the details and sort out payment and delivery.
                  </p>
                </div>

                {lastSubmittedOrder && (
                  <div className="bg-surface-tint p-5 rounded-2xl border border-border space-y-3 text-left">
                    <div className="flex justify-between border-b border-border pb-2 text-xs font-mono font-bold uppercase text-[#2D6A4F]">
                      <span>ORDER ID: {lastSubmittedOrder.id}</span>
                      <span>{lastSubmittedOrder.dateCreated}</span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-text-primary">
                      <div>Customer: <strong>{lastSubmittedOrder.customerName}</strong></div>
                      <div>Phone Number: <strong className="font-mono">{lastSubmittedOrder.customerPhone}</strong></div>
                      <div>Email Address: <strong>{lastSubmittedOrder.customerEmail}</strong></div>
                      <div className="capitalize">Pickup/Delivery Method: <strong>{lastSubmittedOrder.deliveryMethod}</strong></div>
                    </div>

                    <div className="pt-2 border-t border-border divide-y divide-border/60">
                      {lastSubmittedOrder.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 text-xs">
                          <span>{it.productName} ({it.size.split('(')[0].trim()})</span>
                          <span className="font-semibold text-text-primary font-mono">₱{it.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text-primary">
                      <span>Grand Total:</span>
                      <span className="text-base text-accent font-mono">₱{lastSubmittedOrder.subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="bg-accent/5 p-4.5 rounded-xl border border-accent/10 text-xs text-text-secondary leading-relaxed text-left space-y-1.5">
                  <strong className="text-text-primary block font-heading text-sm mb-0.5">Direct GCash Payment Reminder</strong>
                  <p>
                    Payment is arranged directly with us — **GCash transfer** directly to **{shopGcash}** or Cash on pickup/delivery once we've confirmed your order details. No automatic card charges!
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => handleNavigate('shop', 'all')}
                    className="w-full sm:w-auto bg-[#2D6A4F] hover:bg-[#245840] text-white font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98] border-none"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => handleNavigate('faq')}
                    className="w-full sm:w-auto border border-border hover:bg-surface-tint text-text-primary font-semibold px-6 py-3 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Read delivery FAQs
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* J. PRIVACY POLICY */}
          {currentPage === 'privacy' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-3xl mx-auto px-4 py-10 w-full"
            >
              <div className="bg-white border border-border p-8 sm:p-10 rounded-2xl space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-accent">Privacy Policy</h1>
                <p className="text-xs text-text-secondary italic border-b border-border pb-3">Last updated: July 2026</p>
                
                <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <p>
                    At ETZ A Shoppe, we care about your personal details. We collect basic e-commerce transaction data at checkout and on contact forms (specifically: your full name, email, delivery address, and phone number).
                  </p>
                  <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">How We Use This Data</h4>
                  <p>
                    We utilize your contact details solely to verify your order, communicate direct GCash or Cash delivery specifications, and coordinate physical handover in Loong, Tabogon. We do not sell, rent, or distribute your email or phone numbers to third-party databases or marketing organizations.
                  </p>
                  <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Data Privacy Act (DPA) Compliance</h4>
                  <p>
                    This template adheres to baseline user guidelines in accordance with the Philippine Data Privacy Act of 2012 (R.A. 10173). You are always welcome to contact our owner directly to ask for your submitted logs to be deleted from our system.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* K. TERMS OF SERVICE */}
          {currentPage === 'terms' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="max-w-3xl mx-auto px-4 py-10 w-full"
            >
              <div className="bg-white border border-border p-8 sm:p-10 rounded-2xl space-y-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-accent">Terms of Service</h1>
                <p className="text-xs text-text-secondary italic border-b border-border pb-3">Last updated: July 2026</p>
                
                <div className="space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <p>
                    Welcome to ETZ A Shoppe. By utilizing our online catalog to browse and submit pre-loved apparel requests, you agree to the following terms:
                  </p>
                  <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Secondhand Condition & Disclosures</h4>
                  <p>
                    Every single item is hand-sorted and sold strictly as-is. We do our absolute best to describe any visible wear, small snags, or repairs in the product description. Sizing tags are indicative only; exact measurements in inches are provided to ensure a correct fit.
                  </p>
                  <h4 className="font-bold text-text-primary mt-4 uppercase text-xs tracking-wider">Order Acceptance and Payment</h4>
                  <p>
                    Submitting an order on this site constitutes a request to purchase, not a guaranteed transaction. Because garments are typically single-quantity, a piece may sell out locally. Payment must be finalized via direct GCash transfer or cash upon pickup within 24 hours of owner contact.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* L. ADMIN OWNER PANEL */}
          {currentPage === 'admin' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
              id="admin-view"
            >
              <AdminPanel
                products={products}
                orders={orders}
                contactMessages={contactMessages}
                shopEmail={shopEmail}
                shopPhone={shopPhone}
                shopFacebook={shopFacebook}
                shopGcash={shopGcash}
                onUpdateProduct={handleUpdateProduct}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateSettings={handleUpdateSettings}
                onResetDatabase={handleResetDatabase}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER COMPONENT */}
      <Footer 
        onNavigate={handleNavigate} 
        shopEmail={shopEmail} 
        shopPhone={shopPhone} 
        shopFacebook={shopFacebook} 
      />

    </div>
  );
}`;

fs.writeFileSync(appFilePath, content.substring(0, content.indexOf('  return (')) + redesignedReturn + '\n');
console.log('Successfully updated App.tsx return block!');
