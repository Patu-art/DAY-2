const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

function closeMenu() {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');

  siteNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open =
      navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute(
      'aria-expanded',
      String(!open)
    );

    navToggle.setAttribute(
      'aria-label',
      open
        ? 'Open navigation'
        : 'Close navigation'
    );

    siteNav.classList.toggle(
      'is-open',
      !open
    );

    document.body.classList.toggle(
      'menu-open',
      !open
    );
  });

  navLinks.forEach((link) => {
    link.addEventListener(
      'click',
      closeMenu
    );
  });

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth > 820) {
        closeMenu();
      }
    }
  );
}


/* =================================
   SCROLL PROGRESS
================================= */

const progressBar =
  document.querySelector(
    '.scroll-progress span'
  );

function updateScrollProgress() {
  if (!progressBar) return;

  const maxScroll =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    maxScroll > 0
      ? (window.scrollY / maxScroll) * 100
      : 0;

  progressBar.style.width =
    `${Math.min(
      100,
      Math.max(0, progress)
    )}%`;
}

updateScrollProgress();

window.addEventListener(
  'scroll',
  updateScrollProgress,
  { passive: true }
);

window.addEventListener(
  'resize',
  updateScrollProgress
);


/* =================================
   REVEAL ANIMATIONS
================================= */

const reduceMotion =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

const revealItems =
  document.querySelectorAll('.reveal');

if (
  reduceMotion ||
  !('IntersectionObserver' in window)
) {
  revealItems.forEach((item) => {
    item.classList.add('is-visible');
  });
} else {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            'is-visible'
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin:
          '0px 0px -35px 0px'
      }
    );

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}


/* =================================
   HERO INGREDIENT INTERACTION
================================= */

const heroStage =
  document.querySelector(
    '[data-hero-stage]'
  );

const ingredients =
  document.querySelectorAll(
    '.ingredient[data-drift]'
  );

const finePointer =
  window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;

if (
  heroStage &&
  ingredients.length &&
  finePointer &&
  !reduceMotion
) {
  heroStage.addEventListener(
    'pointermove',
    (event) => {
      const rect =
        heroStage.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      ingredients.forEach((item) => {
        const drift =
          Number(
            item.dataset.drift
          ) || 1;

        item.style.transform = `
          translate3d(
            ${x * 30 * drift}px,
            ${y * 22 * drift}px,
            0
          )
        `;
      });
    }
  );

  heroStage.addEventListener(
    'pointerleave',
    () => {
      ingredients.forEach((item) => {
        item.style.transform =
          'translate3d(0, 0, 0)';
      });
    }
  );
}


/* =================================
   INTERACTIVE DISH LAB
================================= */

const dishRows =
  document.querySelectorAll(
    '.dish-row'
  );

const dishImage =
  document.querySelector(
    '#dish-stage-image'
  );

const dishName =
  document.querySelector(
    '#dish-stage-name'
  );

const dishTag =
  document.querySelector(
    '#dish-stage-tag'
  );

const dishCopy =
  document.querySelector(
    '#dish-stage-copy'
  );

const dishIndex =
  document.querySelector(
    '.dish-stage-index'
  );

function selectDish(row) {
  if (!row) return;

  dishRows.forEach((item) => {
    item.classList.remove(
      'is-active'
    );
  });

  row.classList.add(
    'is-active'
  );

  const nextImage =
    row.dataset.image;

  const nextName =
    row.dataset.name || '';

  const nextTag =
    row.dataset.tag || '';

  const nextCopy =
    row.dataset.copy || '';

  const nextIndex =
    row.dataset.index || '';

  if (
    dishImage &&
    nextImage
  ) {
    dishImage.style.opacity =
      '0.25';

    const preload =
      new Image();

    preload.onload = () => {
      dishImage.src =
        nextImage;

      dishImage.alt =
        `${nextName} at Tasteology`;

      requestAnimationFrame(() => {
        dishImage.style.opacity =
          '1';
      });
    };

    preload.onerror = () => {
      dishImage.style.opacity =
        '1';
    };

    preload.src =
      nextImage;
  }

  if (dishName) {
    dishName.textContent =
      nextName;
  }

  if (dishTag) {
    dishTag.textContent =
      nextTag;
  }

  if (dishCopy) {
    dishCopy.textContent =
      nextCopy;
  }

  if (dishIndex) {
    dishIndex.textContent =
      nextIndex;
  }
}

if (dishImage) {
  dishImage.style.transition =
    'opacity 220ms ease';
}

dishRows.forEach((row) => {
  row.addEventListener(
    'click',
    () => selectDish(row)
  );

  if (finePointer) {
    row.addEventListener(
      'mouseenter',
      () => selectDish(row)
    );
  }
});


/* =================================
   PHOTO JOURNAL LIGHTBOX
================================= */

const galleryItems = [
  ...document.querySelectorAll(
    '[data-gallery]'
  )
];

const lightbox =
  document.querySelector(
    '#lightbox'
  );

const lightboxImage =
  document.querySelector(
    '#lightbox-image'
  );

const lightboxCaption =
  document.querySelector(
    '#lightbox-caption'
  );

const lightboxClose =
  document.querySelector(
    '.lightbox-close'
  );

const lightboxPrev =
  document.querySelector(
    '.lightbox-prev'
  );

const lightboxNext =
  document.querySelector(
    '.lightbox-next'
  );

let activeGalleryIndex = 0;

function updateLightbox(index) {
  if (
    !galleryItems.length ||
    !lightboxImage ||
    !lightboxCaption
  ) {
    return;
  }

  activeGalleryIndex =
    (
      index +
      galleryItems.length
    ) %
    galleryItems.length;

  const item =
    galleryItems[
      activeGalleryIndex
    ];

  const image =
    item.querySelector('img');

  const label =
    item.querySelector('span');

  if (!image) return;

  lightboxImage.src =
    image.currentSrc ||
    image.src;

  lightboxImage.alt =
    image.alt;

  lightboxCaption.textContent =
    label?.textContent ||
    image.alt;
}

if (
  lightbox &&
  typeof lightbox.showModal ===
    'function'
) {
  galleryItems.forEach(
    (item, index) => {
      item.addEventListener(
        'click',
        () => {
          updateLightbox(index);
          lightbox.showModal();
        }
      );
    }
  );

  lightboxClose?.addEventListener(
    'click',
    () => {
      lightbox.close();
    }
  );

  lightboxPrev?.addEventListener(
    'click',
    () => {
      updateLightbox(
        activeGalleryIndex - 1
      );
    }
  );

  lightboxNext?.addEventListener(
    'click',
    () => {
      updateLightbox(
        activeGalleryIndex + 1
      );
    }
  );

  lightbox.addEventListener(
    'click',
    (event) => {
      if (
        event.target === lightbox
      ) {
        lightbox.close();
      }
    }
  );

  lightbox.addEventListener(
    'keydown',
    (event) => {
      if (
        event.key ===
        'ArrowLeft'
      ) {
        updateLightbox(
          activeGalleryIndex - 1
        );
      }

      if (
        event.key ===
        'ArrowRight'
      ) {
        updateLightbox(
          activeGalleryIndex + 1
        );
      }
    }
  );
}


/* =================================
   3D MOMENTS CAROUSEL
================================= */

const carousel =
  document.querySelector(
    '#moments-carousel'
  );

if (carousel) {

  const slides = [
    ...carousel.querySelectorAll(
      '[data-carousel-slide]'
    )
  ];

  const prevButton =
    carousel.querySelector(
      '.carousel-prev'
    );

  const nextButton =
    carousel.querySelector(
      '.carousel-next'
    );

  const dotsContainer =
    carousel.querySelector(
      '.carousel-dots'
    );

  let activeIndex = 0;

  let autoTimer = null;

  const AUTO_DELAY = 4500;


  /* -------------------------
     CREATE DOTS
  ------------------------- */

  const dots = slides.map(
    (_, index) => {

      const button =
        document.createElement(
          'button'
        );

      button.type = 'button';

      button.className =
        'carousel-dot';

      button.setAttribute(
        'aria-label',
        `Go to image ${index + 1}`
      );

      button.addEventListener(
        'click',
        () => {

          activeIndex = index;

          updateCarousel();

          restartAutoPlay();

        }
      );

      dotsContainer.appendChild(
        button
      );

      return button;

    }
  );


  /* -------------------------
     POSITION SLIDES
  ------------------------- */

  function updateCarousel() {

    const total =
      slides.length;

    slides.forEach(
      (slide, index) => {

        slide.classList.remove(
          'is-active',
          'is-prev',
          'is-next',
          'is-far-prev',
          'is-far-next'
        );


        let offset =
          index - activeIndex;


        if (
          offset >
          total / 2
        ) {
          offset -= total;
        }


        if (
          offset <
          -total / 2
        ) {
          offset += total;
        }


        if (offset === 0) {

          slide.classList.add(
            'is-active'
          );

        } else if (
          offset === -1
        ) {

          slide.classList.add(
            'is-prev'
          );

        } else if (
          offset === 1
        ) {

          slide.classList.add(
            'is-next'
          );

        } else if (
          offset < -1
        ) {

          slide.classList.add(
            'is-far-prev'
          );

        } else {

          slide.classList.add(
            'is-far-next'
          );

        }


        slide.setAttribute(
          'aria-current',
          offset === 0
            ? 'true'
            : 'false'
        );

      }
    );


    dots.forEach(
      (dot, index) => {

        dot.classList.toggle(
          'is-active',
          index === activeIndex
        );

      }
    );

  }


  /* -------------------------
     NEXT / PREVIOUS
  ------------------------- */

  function nextSlide() {

    activeIndex =
      (
        activeIndex + 1
      ) % slides.length;

    updateCarousel();

  }


  function previousSlide() {

    activeIndex =
      (
        activeIndex -
        1 +
        slides.length
      ) % slides.length;

    updateCarousel();

  }


  nextButton.addEventListener(
    'click',
    () => {

      nextSlide();

      restartAutoPlay();

    }
  );


  prevButton.addEventListener(
    'click',
    () => {

      previousSlide();

      restartAutoPlay();

    }
  );


  /* -------------------------
     CLICK SIDE IMAGE
  ------------------------- */

  slides.forEach(
    (slide, index) => {

      slide.addEventListener(
        'click',
        () => {

          if (
            index === activeIndex
          ) {
            return;
          }

          activeIndex = index;

          updateCarousel();

          restartAutoPlay();

        }
      );

    }
  );


  /* -------------------------
     AUTO PLAY
  ------------------------- */

  function startAutoPlay() {

    stopAutoPlay();

    autoTimer =
      window.setInterval(
        nextSlide,
        AUTO_DELAY
      );

  }


  function stopAutoPlay() {

    if (autoTimer) {

      clearInterval(
        autoTimer
      );

      autoTimer = null;

    }

  }


  function restartAutoPlay() {

    stopAutoPlay();

    startAutoPlay();

  }


  carousel.addEventListener(
    'mouseenter',
    stopAutoPlay
  );


  carousel.addEventListener(
    'mouseleave',
    startAutoPlay
  );


  carousel.addEventListener(
    'focusin',
    stopAutoPlay
  );


  carousel.addEventListener(
    'focusout',
    () => {

      setTimeout(
        () => {

          if (
            !carousel.contains(
              document.activeElement
            )
          ) {

            startAutoPlay();

          }

        },
        0
      );

    }
  );


  /* -------------------------
     MOBILE SWIPE
  ------------------------- */

  let touchStartX = 0;


  carousel.addEventListener(
    'touchstart',
    (event) => {

      touchStartX =
        event.changedTouches[0]
          .clientX;

    },
    {
      passive: true
    }
  );


  carousel.addEventListener(
    'touchend',
    (event) => {

      const touchEndX =
        event.changedTouches[0]
          .clientX;

      const difference =
        touchStartX -
        touchEndX;


      if (
        Math.abs(
          difference
        ) < 45
      ) {
        return;
      }


      if (
        difference > 0
      ) {

        nextSlide();

      } else {

        previousSlide();

      }


      restartAutoPlay();

    },
    {
      passive: true
    }
  );


  /* -------------------------
     INITIALIZE
  ------------------------- */

  updateCarousel();

  startAutoPlay();

}

/* =================================
   VIDEO TIMELINE
================================= */

timelineRows.forEach((row) => {
  row.addEventListener(
    'click',
    async () => {
      timelineRows.forEach(
        (item) => {
          item.classList.remove(
            'is-active'
          );
        }
      );

      row.classList.add(
        'is-active'
      );

      if (
        !reel ||
        !reelAvailable
      ) {
        return;
      }

      const requestedTime =
        Number(
          row.dataset.time
        );

      const safeTime =
        Number.isFinite(
          requestedTime
        )
          ? Math.max(
              0,
              requestedTime
            )
          : 0;

      if (
        Number.isFinite(
          reel.duration
        ) &&
        reel.duration > 0
      ) {
        reel.currentTime =
          Math.min(
            safeTime,
            Math.max(
              0,
              reel.duration -
                0.1
            )
          );
      } else {
        reel.currentTime =
          safeTime;
      }

      try {
        await reel.play();
      } catch (error) {
        console.warn(
          'Timeline preview could not autoplay:',
          error
        );
      }
    }
  );
});