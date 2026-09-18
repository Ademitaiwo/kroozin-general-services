
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navlinks");

  const closeMenu = () => {
    if (nav) {
      nav.classList.remove("open");
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  };

  if (toggle && nav) {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      const clickedInsideMenu = nav.contains(target) || toggle.contains(target);
      if (!clickedInsideMenu) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  document.querySelectorAll("a[href]").forEach(a => {
    a.addEventListener("click", () => {
      closeMenu();
    });
  });

  const year = document.querySelectorAll("[data-year]");
  year.forEach(el => el.textContent = new Date().getFullYear());

  const forms = document.querySelectorAll("form[data-contact-form]");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("[name='name']")?.value || "";
      const service = form.querySelector("[name='service']")?.value || "General enquiry";
      const message = form.querySelector("[name='message']")?.value || "";
      const email = "gbenga.akamo@kroozln.com";
      const subject = encodeURIComponent(`KROOZ'IN Service Request — ${service}`);
      const body = encodeURIComponent(`Name: ${name}\n\nService: ${service}\n\nMessage:\n${message}`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  });
});
