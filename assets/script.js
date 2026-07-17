// =========================================================
// NIRMANYA — shared site behaviour
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  /* ---------- Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
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
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  /* ---------- Shop: quantity steppers + add-to-cart ---------- */
  document.querySelectorAll(".qty-control").forEach(control => {
    const display = control.querySelector("span");
    let qty = 1;
    control.querySelector(".qty-minus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      display.textContent = qty;
    });
    control.querySelector(".qty-plus").addEventListener("click", () => {
      qty = Math.min(10, qty + 1);
      display.textContent = qty;
    });
    control.dataset.qty = qty;
    control.querySelector(".qty-plus").addEventListener("click", () => control.dataset.qty = qty);
    control.querySelector(".qty-minus").addEventListener("click", () => control.dataset.qty = qty);
  });

  document.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.addToCart;
      const card = btn.closest(".shop-detail, .product-card");
      const qtyEl = card ? card.querySelector(".qty-control span") : null;
      const qty = qtyEl ? qtyEl.textContent : 1;
      window.showToast(`Added ${qty} × ${name} to your bag`);
    });
  });

  /* ---------- Contact form (client-side only demo) ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { el: form.querySelector("#name"), test: v => v.trim().length > 1 },
        { el: form.querySelector("#email"), test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
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

});
