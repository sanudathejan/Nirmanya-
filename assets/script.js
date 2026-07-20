// =========================================================
// NIRMANYA — Clean Beauty, Local Roots
// Shared site behaviour v2.0
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector("#nav-toggle");
  const nav    = document.querySelector("#main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      // Animate hamburger spans
      const spans = toggle.querySelectorAll("span");
      if (isOpen) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity   = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "";
        spans[1].style.opacity   = "";
        spans[2].style.transform = "";
      }
    });
    // Close on link click
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        const spans = toggle.querySelectorAll("span");
        spans[0].style.transform = "";
        spans[1].style.opacity   = "";
        spans[2].style.transform = "";
      });
    });
    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        const spans = toggle.querySelectorAll("span");
        spans[0].style.transform = "";
        spans[1].style.opacity   = "";
        spans[2].style.transform = "";
      }
    });
  }

  /* ---------- Header scroll effect ---------- */
  const header = document.querySelector("#site-header");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll-reveal with stagger ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------- Toast helper ---------- */
  window.showToast = function (message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        <span class="toast-msg"></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector(".toast-msg").textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  };

  /* ---------- Shop: quantity steppers ---------- */
  document.querySelectorAll(".qty-control").forEach(control => {
    const display = control.querySelector("span");
    let qty = 1;
    control.querySelector(".qty-minus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      display.textContent = qty;
      control.dataset.qty = qty;
    });
    control.querySelector(".qty-plus").addEventListener("click", () => {
      qty = Math.min(10, qty + 1);
      display.textContent = qty;
      control.dataset.qty = qty;
    });
    control.dataset.qty = qty;
  });

  /* ---------- Add-to-cart buttons ---------- */
  document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.addToCart;
      const card = btn.closest(".shop-detail, .product-card");
      const qtyEl = card ? card.querySelector(".qty-control span") : null;
      const qty   = qtyEl ? qtyEl.textContent : 1;
      window.showToast(`Added ${qty} × ${name} to your bag`);
      // Brief pulse animation on button
      btn.style.transform = "scale(0.96)";
      setTimeout(() => { btn.style.transform = ""; }, 180);
    });
  });

  /* ---------- Contact form (client-side demo) ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      const fields = [
        { el: form.querySelector("#name"),    test: v => v.trim().length > 1 },
        { el: form.querySelector("#email"),   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { el: form.querySelector("#message"), test: v => v.trim().length > 5 },
      ];
      fields.forEach(f => {
        if (!f.el) return;
        const group = f.el.closest(".form-group");
        if (!f.test(f.el.value)) {
          group.classList.add("error");
          valid = false;
        } else {
          group.classList.remove("error");
        }
      });
      if (!valid) return;
      const successBox = document.querySelector("#form-success");
      form.reset();
      if (successBox) {
        successBox.classList.add("show");
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    // Clear error on input
    form.querySelectorAll("input, textarea").forEach(el => {
      el.addEventListener("input", () => {
        const group = el.closest(".form-group");
        if (group) group.classList.remove("error");
      });
    });
  }

  /* ---------- Active nav link highlighting ---------- */
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Product card image hover parallax (subtle) ---------- */
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${y * 4}deg`);
      card.style.setProperty("--tilt-y", `${-x * 4}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

});
