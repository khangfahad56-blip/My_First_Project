// Interactive Application Logic for Fahad Jewellery Website

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cart & Wishlist State
  let cartCount = 0;
  let wishlistCount = 0;
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
  }

  // Add to Bag buttons
  document.querySelectorAll('.btn-add-to-bag').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      cartCount++;
      if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.classList.remove('hidden');
      }
      const productName = button.getAttribute('data-name') || 'Item';
      showToast(`Added "${productName}" to your Shopping Bag.`);
    });
  });

  // Wishlist buttons
  document.querySelectorAll('.btn-wishlist').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isLiked = button.classList.contains('text-red-500');
      if (isLiked) {
        button.classList.remove('text-red-500');
        button.classList.add('text-muted-gray');
        wishlistCount = Math.max(0, wishlistCount - 1);
      } else {
        button.classList.remove('text-muted-gray');
        button.classList.add('text-red-500');
        wishlistCount++;
        showToast('Saved to your Wishlist.');
      }
      if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
        if (wishlistCount > 0) wishlistBadge.classList.remove('hidden');
        else wishlistBadge.classList.add('hidden');
      }
    });
  });

  // 2. Product Tab Filtering
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab styles
      tabButtons.forEach(b => {
        b.classList.remove('bg-navy-deep', 'text-pearl-white', 'shadow-luxury-sm');
        b.classList.add('bg-transparent', 'text-onyx', 'hover:bg-ivory-surface');
      });
      btn.classList.remove('bg-transparent', 'text-onyx', 'hover:bg-ivory-surface');
      btn.classList.add('bg-navy-deep', 'text-pearl-white', 'shadow-luxury-sm');

      const filter = btn.getAttribute('data-category');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.classList.add('animate-fade-in');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 3. Quick View Modal
  const modal = document.getElementById('quick-view-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalMetal = document.getElementById('modal-metal');
  const modalAddBtn = document.getElementById('modal-add-btn');

  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      if (!card || !modal) return;

      const name = card.getAttribute('data-name');
      const price = card.getAttribute('data-price');
      const img = card.getAttribute('data-img');
      const metal = card.getAttribute('data-metal');
      const desc = card.getAttribute('data-desc');

      if (modalImg) modalImg.src = img;
      if (modalTitle) modalTitle.textContent = name;
      if (modalPrice) modalPrice.textContent = price;
      if (modalMetal) modalMetal.textContent = metal;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalAddBtn) {
        modalAddBtn.onclick = () => {
          cartCount++;
          if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.classList.remove('hidden');
          }
          showToast(`Added "${name}" to your Shopping Bag.`);
          modal.classList.add('hidden');
        };
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }

  // 4. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 5. Sticky Header Effect
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('shadow-luxury-md', 'bg-pearl-white/95', 'backdrop-blur-md');
    } else {
      header.classList.remove('shadow-luxury-md', 'bg-pearl-white/95', 'backdrop-blur-md');
    }
  });
});
