/* =========================================
   PROJECTS.JS
========================================= */

function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

function closeMobile() {
  document.getElementById("mobileMenu").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     NAV SCROLL
  ========================================= */

  const nav = document.getElementById("navbar");

  const onScroll = () => {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }
  };

  onScroll();

  window.addEventListener("scroll", onScroll, {
    passive: true,
  });

  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const revealEls = document.querySelectorAll(".reveal");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealEls.forEach((el) => io.observe(el));

  /* =========================================
     LIGHTBOX
  ========================================= */

  const items = Array.from(document.querySelectorAll(".masonry-item"));

  if (items.length) {
    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";

    lightbox.innerHTML = `
      <div class="lightbox-close" aria-label="Close">
        <svg viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </div>

      <div class="lightbox-prev" aria-label="Previous">
        <svg viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </div>

      <div class="lightbox-next" aria-label="Next">
        <svg viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>

      <div class="lightbox-frame">
        <img src="" alt="" />
        <div class="lightbox-caption"></div>
      </div>
    `;

    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector("img");

    const lbCaption = lightbox.querySelector(".lightbox-caption");

    let current = 0;

    function openAt(index) {
      current = ((index % items.length) + items.length) % items.length;

      const el = items[current];

      const img = el.querySelector("img");

      lbImg.src = img.src;

      lbImg.alt = img.alt || "";

      lbCaption.textContent = img.alt || "";

      lightbox.classList.add("open");
    }

    items.forEach((el, index) => {
      el.addEventListener("click", () => {
        openAt(index);
      });
    });

    /* Close */

    lightbox.querySelector(".lightbox-close").addEventListener("click", () => {
      lightbox.classList.remove("open");
    });

    /* Click outside */

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("open");
      }
    });

    /* Prev */

    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => {
      openAt(current - 1);
    });

    /* Next */

    lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
      openAt(current + 1);
    });

    /* Keyboard */

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;

      if (e.key === "Escape") {
        lightbox.classList.remove("open");
      }

      if (e.key === "ArrowLeft") {
        openAt(current - 1);
      }

      if (e.key === "ArrowRight") {
        openAt(current + 1);
      }
    });
  }
});
/* =========================================
   STATS COUNTER
========================================= */

const counters = document.querySelectorAll(".stat-num");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;

      const target = +counter.dataset.target;

      const numberSpan = counter.querySelector("span");

      let current = 0;

      const increment = target / 60;

      const updateCounter = () => {
        current += increment;

        if (current < target) {
          numberSpan.textContent = Math.floor(current);

          requestAnimationFrame(updateCounter);
        } else {
          numberSpan.textContent = target;
        }
      };

      updateCounter();

      counterObserver.unobserve(counter);
    });
  },
  {
    threshold: 0.5,
  },
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

/* =========================================
   CONTACT FORM
========================================= */

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.querySelector(".form-submit");
const btnText = document.querySelector(".btn-text");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  /* Loading state */

  submitBtn.classList.add("loading");
  btnText.textContent = "Sending...";
  status.textContent = "";

  try {
    const response = await fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      form.reset();
      status.textContent =
        "Inquiry received. I’ll get back to you within 24–48 hours.";
      status.className = "form-status success";

      btnText.textContent = "Inquiry Sent";
    } else {
      status.textContent = "Something went wrong. Please try again.";
      status.className = "form-status error";
      btnText.textContent = "Try Again";
    }
  } catch (error) {
    status.textContent = "Network error. Please try again.";
    status.className = "form-status error";
    btnText.textContent = "Try Again";
  }

  /* Reset button */

  submitBtn.classList.remove("loading");

  setTimeout(() => {
    btnText.textContent = "Send Inquiry";
  }, 2500);
});
