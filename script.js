// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavbarScroll = () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  // ===== MOBILE MENU TOGGLE =====
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger to X
      mobileToggle.classList.toggle('active');
      // Toggle aria-expanded for accessibility
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animations
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add stagger delays to grid items
  document.querySelectorAll('.products-grid .product-card').forEach((card, i) => {
    card.dataset.delay = i * 100;
  });

  document.querySelectorAll('.services-list .service-item').forEach((item, i) => {
    item.dataset.delay = i * 80;
  });

  // Observe all animated elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    counterObserver.observe(statsGrid);
  }

  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 1000) {
          counter.textContent = current.toLocaleString() + '+';
        } else {
          counter.textContent = current + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ===== CONTACT FORM HANDLING =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const inquiry = formData.get('inquiry');
      const message = formData.get('message');

      // Basic validation
      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      // Phone number validation (Indian format)
      const phoneClean = phone.replace(/\s+/g, '');
      if (!/^(\+91)?[6-9]\d{9}$/.test(phoneClean)) {
        alert('Please enter a valid 10-digit Indian phone number.');
        return;
      }

      // Build WhatsApp message as fallback lead capture
      const whatsappMsg = encodeURIComponent(
        `Hello Sir, I'm ${name}.\n` +
        `Phone: ${phone}\n` +
        `Interest: ${inquiry || 'General Inquiry'}\n` +
        `Message: ${message || 'I would like to know more about LIC plans.'}`
      );

      // Show success state
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');

      // Open WhatsApp with the form data after a short delay
      setTimeout(() => {
        window.open(
          `https://wa.me/919423110900?text=${whatsappMsg}`,
          '_blank'
        );
      }, 1500);

      // Reset after 5 seconds
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.classList.remove('show');
      }, 8000);
    });
  }

  // ===== PRODUCT CARD TILT EFFECT =====
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.navbar-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ===== TRUST BANNER PARALLAX =====
  const trustBanner = document.getElementById('trustBanner');
  if (trustBanner) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const bannerTop = trustBanner.offsetTop;
      if (scrolled > bannerTop - window.innerHeight && scrolled < bannerTop + trustBanner.offsetHeight) {
        const speed = (scrolled - bannerTop + window.innerHeight) * 0.03;
        trustBanner.style.backgroundPositionX = `${speed}%`;
      }
    }, { passive: true });
  }

});
