// assets/js/app.js – Fahad Jewellery Interactive JavaScript (Phase 2)
document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. Mobile Menu Toggle ───────────────────────────────
  const mobileBtn  = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  // ─── 2. Sticky Header Shrink on Scroll ───────────────────
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('shadow-luxury-md', 'bg-opacity-95');
    } else {
      header.classList.remove('shadow-luxury-md', 'bg-opacity-95');
    }
  });

  // ─── 3. Product Category Tab Filter ──────────────────────
  const tabBtns      = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('bg-navy-deep', 'text-pearl-white');
        b.classList.add('bg-transparent', 'text-onyx');
      });
      btn.classList.add('bg-navy-deep', 'text-pearl-white');
      btn.classList.remove('bg-transparent', 'text-onyx');

      const filter = btn.getAttribute('data-category');
      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── 4. Homepage Service Cards Viewport Scroll Alignment ──
  document.querySelectorAll('.service-card-scroll').forEach(card => {
    card.addEventListener('click', function (e) {
      const targetId = card.getAttribute('data-target');
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('ring-2', 'ring-gold-accent', 'transition-all', 'duration-500');
        setTimeout(() => {
          targetEl.classList.remove('ring-2', 'ring-gold-accent');
        }, 2000);
      }
    });
  });

  // ─── 5. Enquiry / Quick View Modal ───────────────────────
  const modal      = document.getElementById('enquiry-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-product-name');

  document.querySelectorAll('.btn-enquire').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!modal) return;
      const name = btn.getAttribute('data-name') || 'Product';
      if (modalTitle) modalTitle.textContent = name;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    });
  }

  // ─── 6. Toast Notification Helper ────────────────────────
  window.showToast = function(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const msg   = document.getElementById('toast-message');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.style.transform  = 'translateY(0)';
    toast.style.opacity    = '1';
    setTimeout(() => {
      toast.style.transform  = 'translateY(5rem)';
      toast.style.opacity    = '0';
    }, duration);
  };

  // ─── 7. Contact / Enquiry Form AJAX Submit ────────────────
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type=submit]');
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(enquiryForm);
      try {
        const res  = await fetch('/fahad_jewellery/handlers/enquiry.php', { method: 'POST', body: formData });
        const json = await res.json();
        if (json.success) {
          enquiryForm.reset();
          showToast('Thank you! Gul Nawaz Khan will contact you shortly.');
          if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
          }
        } else {
          showToast(json.message || 'Something went wrong. Please call us directly.');
        }
      } catch {
        showToast('Connection error. Please call 0333-9013157.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Send Enquiry';
        }
      }
    });
  }

  // ─── 8. Animate elements on scroll ───────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.observe-animate').forEach(el => observer.observe(el));

});
