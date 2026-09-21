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

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const open = nav.classList.toggle("open");

      toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      const clickedInsideMenu =
        nav.contains(target) || toggle.contains(target);

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

  // Close mobile menu when a link is clicked
  document.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Update copyright year
  const year = document.querySelectorAll("[data-year]");

  year.forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Quote/contact forms
  const forms = document.querySelectorAll("form[data-contact-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      const formData = new FormData(form);

      const data = {
        name: formData.get("name"),
        company: formData.get("company"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        service: formData.get("service"),
        message: formData.get("message")
      };

      if (!data.name || !data.email || !data.message) {
        alert("Please fill in your name, email and message.");
        return;
      }

      try {
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }

        const response = await fetch(
          "https://kroozin-general-services.onrender.com/api/quotes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to send your request."
          );
        }

        alert(
          "Thank you! Your quote request has been received. KROOZ'IN will get back to you shortly."
        );

        form.reset();
      } catch (error) {
        console.error("Quote request error:", error);

        alert(
          "Sorry, we could not send your request right now. Please try again or contact KROOZ'IN directly."
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Prepare Quote Request →";
        }
      }
    });
  });
});