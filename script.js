(() => {
  const header = document.querySelector('[data-elevate]');
  const nav = document.querySelector('[data-nav]');
  const navBtn = document.querySelector('[data-navbtn]');
  const links = Array.from(document.querySelectorAll('.nav__link'));

  const setElevated = () => {
    if (!header) return;
    header.classList.toggle('is-elevated', window.scrollY > 6);
  };

  const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    links.forEach((a) => {
      const href = a.getAttribute('href');
      a.classList.toggle('is-active', href === filename);
    });
  };

  const closeNav = () => {
    if (!nav || !navBtn) return;
    nav.classList.remove('is-open');
    navBtn.setAttribute('aria-expanded', 'false');
  };

  const toggleNav = () => {
    if (!nav || !navBtn) return;
    const open = nav.classList.toggle('is-open');
    navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  // Onboarding Accordion Logic
  const initAccordion = () => {
    const accordionItems = document.querySelectorAll('.accordion__item');
    const mainImg = document.getElementById('onboarding-main-img');

    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      
      trigger.addEventListener('click', () => {
        // 1. Update Image
        const newSrc = item.getAttribute('data-image');
        if (mainImg && newSrc && mainImg.src !== newSrc) {
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 300);
        }

        // 2. Toggle Accordion
        const isActive = item.classList.contains('is-active');
        
        // Close others
        accordionItems.forEach(otherItem => {
          otherItem.classList.remove('is-active');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('is-active');
        } else {
          // Keep at least one open if desired, or allow closing all
          // item.classList.add('is-active'); 
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    initAccordion();
  });

  window.addEventListener('scroll', () => {
    setElevated();
    setActiveLink();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) closeNav();
  });

  if (navBtn) navBtn.addEventListener('click', toggleNav);

  links.forEach((a) => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 720) closeNav();
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav || !navBtn) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (nav.contains(target) || navBtn.contains(target)) return;
    closeNav();
  });

  setElevated();
  setActiveLink();
})();
