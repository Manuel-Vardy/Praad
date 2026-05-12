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
        }
      });
    });
  };

  // News Dynamic Loading Logic
  const initNews = () => {
    const container = document.getElementById('news-container');
    if (!container || typeof newsData === 'undefined') return;

    const renderGrid = () => {
      const hero = document.querySelector('.news-hero');
      if (hero) hero.style.display = 'block';

      let html = '<div class="news-grid">';
      newsData.forEach(article => {
        html += `
          <a href="?article=${article.id}" class="news-card" data-id="${article.id}">
            <div class="news-card__img-wrap">
              <img src="${article.image}" alt="${article.title}" />
            </div>
            <div class="news-card__body">
              <div class="news-card__meta">
                <span>${article.date}</span>
              </div>
              <h2 class="news-card__title">${article.title}</h2>
              <p class="news-card__excerpt">${article.excerpt}</p>
              <div class="news-card__footer">
                <span>Read Full Article</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </div>
          </a>
        `;
      });
      html += '</div>';
      container.innerHTML = html;

      // Add click listeners for dynamic loading
      const cards = container.querySelectorAll('.news-card');
      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const id = card.getAttribute('data-id');
          history.pushState({ articleId: id }, '', `?article=${id}`);
          renderArticle(id);
          window.scrollTo(0, 0);
        });
      });
    };

    const renderArticle = (id) => {
      const article = newsData.find(a => a.id === id);
      const hero = document.querySelector('.news-hero');
      
      if (!article) {
        if (hero) hero.style.display = 'block';
        renderGrid();
        return;
      }

      if (hero) hero.style.display = 'none';

      const relatedArticles = newsData
        .filter(a => a.id !== id)
        .slice(0, 3);

      container.innerHTML = `
        <div class="news-article-layout">
          <article class="news-article">
            <header class="news-article__header">
              <h1 class="news-article__title">${article.title}</h1>
              <div class="news-article__meta">
                <div class="news-article__meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>${article.date}</span>
                </div>
                <div class="news-article__meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  <span>${article.readTime}</span>
                </div>
              </div>
            </header>

            <div class="news-article__featured-img">
              <img src="${article.image}" alt="${article.title}" />
            </div>

            <div class="news-article__content">
              ${article.content}
            </div>
            
            <div style="margin-top: 60px;">
              <a href="news.html" class="btn--explore" id="back-to-news" style="padding: 14px 32px;">Back to News</a>
            </div>
          </article>

          <aside class="news-sidebar">
            <h3 class="news-sidebar__title">Related Stories</h3>
            <div class="news-sidebar__list">
              ${relatedArticles.map(rel => `
                <a href="?article=${rel.id}" class="related-card" data-id="${rel.id}">
                  <div class="related-card__img">
                    <img src="${rel.image}" alt="${rel.title}" />
                  </div>
                  <div class="related-card__body">
                    <span class="related-card__date">${rel.date}</span>
                    <h4 class="related-card__title">${rel.title}</h4>
                  </div>
                </a>
              `).join('')}
            </div>
          </aside>
        </div>
      `;

      // Re-add listeners for related cards
      const relatedCards = container.querySelectorAll('.related-card');
      relatedCards.forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const relId = card.getAttribute('data-id');
          history.pushState({ articleId: relId }, '', `?article=${relId}`);
          renderArticle(relId);
          window.scrollTo(0, 0);
        });
      });

      const backBtn = document.getElementById('back-to-news');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          history.pushState({}, '', 'news.html');
          renderGrid();
          window.scrollTo(0, 0);
        });
      }
    };

    // Initial Load
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('article');
    if (articleId) {
      renderArticle(articleId);
    } else {
      renderGrid();
    }

    // Handle Back/Forward Browser Buttons
    window.addEventListener('popstate', (e) => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        renderArticle(articleId);
      } else {
        renderGrid();
      }
    });
  };

  // News Carousel Logic (Homepage)
  const initNewsCarousel = () => {
    const track = document.getElementById('news-carousel-track');
    const prevBtn = document.getElementById('news-prev');
    const nextBtn = document.getElementById('news-next');
    
    if (!track || typeof newsData === 'undefined') return;

    // Render slides
    let html = '';
    newsData.forEach(article => {
      html += `
        <div class="news-carousel__slide">
          <a href="news.html?article=${article.id}" class="news-card">
            <div class="news-card__img-wrap">
              <img src="${article.image}" alt="${article.title}" />
            </div>
            <div class="news-card__body">
              <div class="news-card__meta">
                <span>${article.date}</span>
              </div>
              <h2 class="news-card__title">${article.title}</h2>
              <p class="news-card__excerpt">${article.excerpt}</p>
            </div>
          </a>
        </div>
      `;
    });
    track.innerHTML = html;

    // Carousel functionality
    let index = 0;
    const slides = track.querySelectorAll('.news-carousel__slide');
    if (!slides.length) return;

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth + 30; // slide width + gap
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      
      if (prevBtn) prevBtn.style.opacity = index === 0 ? '0.3' : '1';
      if (nextBtn) {
        const visibleSlides = window.innerWidth > 1100 ? 3 : (window.innerWidth > 720 ? 2 : 1);
        nextBtn.style.opacity = index >= slides.length - visibleSlides ? '0.3' : '1';
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const visibleSlides = window.innerWidth > 1100 ? 3 : (window.innerWidth > 720 ? 2 : 1);
        if (index < slides.length - visibleSlides) {
          index++;
          updateCarousel();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (index > 0) {
          index--;
          updateCarousel();
        }
      });
    }

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  };

  function initNewsHero() {
    const track = document.getElementById('news-hero-track');
    const dotsContainer = document.getElementById('hero-dots');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (!track || !newsData || newsData.length === 0) return;

    // Use latest 5 articles for the hero
    const heroArticles = newsData.slice(0, 5);
    let currentIndex = 0;

    // Render slides
    track.innerHTML = heroArticles.map((article, index) => `
      <div class="news-hero__slide" data-id="${article.id}">
        <img src="${article.image}" alt="${article.title}" class="news-hero__img">
        <div class="news-hero__overlay">
          <div class="news-hero__content">
            <h3 class="news-hero__title">${article.title}</h3>
            <div class="news-hero__date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${article.date}
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Render dots
    dotsContainer.innerHTML = heroArticles.map((_, i) => `
      <div class="news-hero__dot ${i === 0 ? 'is-active' : ''}" data-index="${i}"></div>
    `).join('');

    const slides = track.querySelectorAll('.news-hero__slide');
    const dots = dotsContainer.querySelectorAll('.news-hero__dot');

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % heroArticles.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + heroArticles.length) % heroArticles.length;
      updateCarousel();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateCarousel();
      });
    });

    // Handle slide click to open article
    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const id = slide.dataset.id;
        window.history.pushState({ articleId: id }, '', `?article=${id}`);
        initNews();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Auto play
    setInterval(() => {
      currentIndex = (currentIndex + 1) % heroArticles.length;
      updateCarousel();
    }, 6000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    initNews();
    initNewsHero();
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
