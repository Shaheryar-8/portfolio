// Portfolio interactivity: mobile menu, markup inspector, project filter,
// active nav link, and contact form validation.
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupMarkupInspector();
  setupProjectFilter();
  setupActiveNavLink();
  setupContactForm();

  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Mobile menu ---------- */
function setupMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after picking a link, or when Escape is pressed.
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- Markup inspector ---------- */
// Labels page elements with their tag name so visitors can see the HTML structure.
function setupMarkupInspector() {
  const toggle = document.getElementById("markup-toggle");
  const status = document.getElementById("markup-status");
  const selector = [
    "main > section", "aside", "h1", "h2", "h3", "p", "figure",
    "dl", "form", "footer", ".button", ".filters", ".project-list",
  ].join(", ");

  document.querySelectorAll(selector).forEach((el) => {
    el.dataset.tag = el.tagName.toLowerCase();
  });

  toggle.addEventListener("change", () => {
    document.body.classList.toggle("show-markup", toggle.checked);
    status.textContent = toggle.checked
      ? "Markup shown: each outline is labelled with its HTML tag"
      : "Markup hidden";
  });
}

/* ---------- Project filter ---------- */
function setupProjectFilter() {
  const buttons = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  const emptyMessage = document.querySelector(".filter-empty");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((b) => {
        const active = b === button;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      let visible = 0;
      projects.forEach((project) => {
        const match = filter === "all" || project.dataset.category === filter;
        project.hidden = !match;
        if (match) visible++;
      });

      emptyMessage.hidden = visible > 0;
    });
  });
}

/* ---------- Highlight the nav link for the section on screen ---------- */
function setupActiveNavLink() {
  const links = document.querySelectorAll(".site-nav a");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const current = link.getAttribute("href") === `#${entry.target.id}`;
          if (current) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) observer.observe(section);
  });
}

/* ---------- Contact form validation ---------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const message = document.getElementById("message");
  const charCount = document.getElementById("char-count");
  const MIN_MESSAGE = 20;

  const rules = {
    name: (value) => (value.trim().length >= 2 ? "" : "Enter your name (at least 2 letters)."),
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter an email like name@example.com.",
    message: (value) =>
      value.trim().length >= MIN_MESSAGE
        ? ""
        : `Describe your project in at least ${MIN_MESSAGE} characters.`,
  };

  const validateField = (field) => {
    const error = rules[field.name](field.value);
    document.getElementById(`${field.name}-error`).textContent = error;
    field.setAttribute("aria-invalid", error ? "true" : "false");
    return !error;
  };

  message.addEventListener("input", () => {
    charCount.textContent = message.value.trim().length;
  });

  // Check each field when the visitor leaves it, and re-check while they fix it.
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    const fields = [...form.querySelectorAll("input, textarea")];
    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // This is a static site with no server, so open the visitor's email app with the message filled in.
    const name = form.elements.name.value.trim();
    const subject = encodeURIComponent(`Project enquiry from ${name}`);
    const body = encodeURIComponent(`${message.value.trim()}\n\n${name}\n${form.elements.email.value.trim()}`);
    window.location.href = `mailto:muhammadshaheryar408@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = `Thanks, ${name.split(" ")[0]}. Your email app should open with your message ready to send.`;
    form.reset();
    charCount.textContent = "0";
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
  });
}
