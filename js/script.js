document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  if (slides.length > 1) {
    slides[0].classList.add("active");
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5200);
  }

  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(navbar.classList.contains("active")));
    });

    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navbar.classList.remove("active"));
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((element) => element.classList.add("hidden-reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          entry.target.classList.remove("hidden-reveal");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  const counters = document.querySelectorAll(".counter");
  const statsSection = document.querySelector(".stats-section");

  const runCounters = () => {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      const suffix = counter.dataset.suffix || "+";
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  if (statsSection && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runCounters();
          counterObserver.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    counterObserver.observe(statsSection);
  }

  document.querySelectorAll(".read-more-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".program-card, .readmore-card");
      const extraContent = card?.querySelector(".program-extra, .readmore-extra");
      if (!extraContent) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      card.classList.toggle("is-open", !isExpanded);
      button.setAttribute("aria-expanded", String(!isExpanded));
      button.textContent = isExpanded ? "View details" : "Show less";
    });
  });

  const setPathwayState = (card, isOpen) => {
    if (!card) return;
    card.classList.toggle("is-open", isOpen);
    card.querySelectorAll(".pathway-toggle").forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (toggle.dataset.toggleLabel) {
        toggle.textContent = isOpen ? "Show Less" : toggle.dataset.toggleLabel;
      }
    });
  };

  document.querySelectorAll(".pathway-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".pathway-journey-card");
      if (!card) return;

      setPathwayState(card, !card.classList.contains("is-open"));
    });
  });

  const openHashedPathway = () => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(`${hash}.pathway-journey-card`) : null;
    if (!target) return;

    const navEntry = performance.getEntriesByType("navigation")[0];
    if (navEntry?.type === "reload") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    setPathwayState(target, true);
    setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  openHashedPathway();

  const programSelectors = document.querySelectorAll(".program-selector");
  const programDetailName = document.getElementById("program-detail-name");
  const programDetailTag = document.getElementById("program-detail-tag");
  const programDetailDescription = document.getElementById("program-detail-description");
  const programDetailPoints = document.getElementById("program-detail-points");
  const programDetailLink = document.getElementById("program-detail-link");

  if (programSelectors.length && programDetailName && programDetailTag && programDetailDescription && programDetailPoints && programDetailLink) {
    const renderProgramDetail = (button) => {
      programSelectors.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      programDetailName.textContent = button.dataset.programName || "";
      programDetailTag.textContent = button.dataset.programTag || "";
      programDetailDescription.textContent = button.dataset.programDescription || "";
      programDetailLink.href = button.dataset.programLink || "contact.html";
      programDetailLink.textContent = button.dataset.programLinkLabel || "Enroll Now";
      programDetailPoints.innerHTML = (button.dataset.programPoints || "")
        .split("|")
        .filter(Boolean)
        .map((point) => `<li>${point}</li>`)
        .join("");
    };

    programSelectors.forEach((button) => {
      button.addEventListener("click", () => renderProgramDetail(button));
    });
  }

  const contactForm = document.querySelector(".contact-form");
  const messageBox = document.getElementById("form-message");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const values = Object.fromEntries(formData.entries());
      const requiredFields = ["Full Name", "Email", "Phone", "Inquiry Type", "Message"];
      const missingField = requiredFields.find((field) => !String(values[field] || "").trim());

      if (missingField) {
        if (messageBox) {
          messageBox.textContent = "Please complete all required fields.";
          messageBox.className = "form-message error";
        }
        return;
      }

      const whatsappMessage = encodeURIComponent(
        `Hello RLH,\nName: ${values["Full Name"]}\nOrganization: ${values.Organization || "N/A"}\nEmail: ${values.Email}\nPhone: ${values.Phone}\nInquiry: ${values["Inquiry Type"]}\nMessage: ${values.Message}`
      );

      if (messageBox) {
        messageBox.textContent = "Opening WhatsApp with your inquiry.";
        messageBox.className = "form-message success";
      }

      window.open(`https://wa.me/256767666693?text=${whatsappMessage}`, "_blank");
    });
  }

  const kitsSearchInput = document.getElementById("kits-search");
  const kitsCards = document.querySelectorAll(".kits-grid .sales-card[data-search]");
  const inventoryItems = document.querySelectorAll(".inventory-item[data-search]");
  const inventoryPreviewImage = document.getElementById("inventory-preview-image");
  const inventoryPreviewName = document.getElementById("inventory-preview-name");
  const inventoryPreviewDescription = document.getElementById("inventory-preview-description");
  const inventoryPreviewPrice = document.getElementById("inventory-preview-price");
  const inventoryAddButton = document.getElementById("inventory-add-btn");
  const kitsStatus = document.getElementById("kits-search-status");
  const kitsEmptyState = document.getElementById("kits-empty-state");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCustomerName = document.getElementById("cart-customer-name");
  const cartCustomerContact = document.getElementById("cart-customer-contact");
  const cartSubmit = document.getElementById("cart-submit");
  const cartFeedback = document.getElementById("cart-feedback");
  const cart = [];

  const formatCurrency = (value) => `UGX ${Number(value || 0).toLocaleString()}`;
  const extractItemData = (element) => ({
    name: element.dataset.name || element.querySelector("h3, .inventory-name")?.textContent || "RLH Kit",
    priceNow: Number(element.dataset.priceNumber || 0),
    image: element.dataset.image || element.querySelector("img")?.getAttribute("src") || "",
    description: element.dataset.description || element.querySelector("p, .inventory-note")?.textContent || ""
  });

  let selectedInventoryItem = inventoryItems.length ? extractItemData(inventoryItems[0]) : null;

  const renderInventoryPreview = (item) => {
    if (!item || !inventoryPreviewName || !inventoryPreviewPrice) return;

    selectedInventoryItem = item;
    if (inventoryPreviewImage && item.image) {
      inventoryPreviewImage.src = item.image;
      inventoryPreviewImage.alt = item.name;
    }
    inventoryPreviewName.textContent = item.name;
    if (inventoryPreviewDescription) inventoryPreviewDescription.textContent = item.description;
    inventoryPreviewPrice.textContent = formatCurrency(item.priceNow);
  };

  const renderCart = () => {
    if (!cartItemsContainer || !cartTotal) return;

    if (!cart.length) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty. Add a kit or material to begin.</p>';
      cartTotal.textContent = "UGX 0";
      return;
    }

    cartItemsContainer.innerHTML = cart.map((item) => `
      <div class="cart-item" data-cart-name="${item.name}">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.priceNow)} each</div>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="qty-btn" data-action="decrease">-</button>
          <strong>${item.quantity}</strong>
          <button type="button" class="qty-btn" data-action="increase">+</button>
        </div>
        <button type="button" class="remove-btn" data-action="remove">Remove</button>
      </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.priceNow * item.quantity, 0);
    cartTotal.textContent = formatCurrency(total);
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    renderCart();
  };

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const item = extractItemData(button.closest("[data-name]"));
      addToCart(item);
      button.classList.add("is-added");
      button.textContent = "Added to Cart";
      if (cartFeedback) cartFeedback.textContent = `${item.name} was successfully added to your cart.`;
      setTimeout(() => {
        button.classList.remove("is-added");
        button.textContent = "Add to Cart";
      }, 1500);
    });
  });

  inventoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const cartItem = extractItemData(item);
      inventoryItems.forEach((entry) => entry.classList.remove("is-active"));
      item.classList.add("is-active");
      renderInventoryPreview(cartItem);
    });
  });

  if (inventoryItems.length) {
    inventoryItems[0].classList.add("is-active");
    renderInventoryPreview(selectedInventoryItem);
  }

  if (inventoryAddButton) {
    inventoryAddButton.addEventListener("click", () => {
      if (!selectedInventoryItem) return;
      addToCart(selectedInventoryItem);
      inventoryAddButton.classList.add("is-added");
      if (cartFeedback) cartFeedback.textContent = `${selectedInventoryItem.name} was successfully added to your cart.`;
      setTimeout(() => inventoryAddButton.classList.remove("is-added"), 1200);
    });
  }

  if (kitsSearchInput) {
    kitsSearchInput.addEventListener("input", () => {
      const term = kitsSearchInput.value.trim().toLowerCase();
      let visibleCount = 0;

      [...kitsCards, ...inventoryItems].forEach((item) => {
        const isMatch = !term || (item.dataset.search || "").toLowerCase().includes(term);
        item.hidden = !isMatch;
        if (isMatch) visibleCount += 1;
      });

      if (kitsStatus) {
        kitsStatus.textContent = term
          ? `Found ${visibleCount} matching item${visibleCount === 1 ? "" : "s"}.`
          : "Showing all available kits and materials.";
      }

      if (kitsEmptyState) {
        kitsEmptyState.hidden = visibleCount > 0;
      }
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      const cartItem = target.closest(".cart-item");
      const action = target.dataset.action;
      if (!cartItem || !action) return;

      const item = cart.find((cartEntry) => cartEntry.name === cartItem.dataset.cartName);
      if (!item) return;

      if (action === "increase") item.quantity += 1;
      if (action === "decrease") item.quantity = Math.max(1, item.quantity - 1);
      if (action === "remove") cart.splice(cart.indexOf(item), 1);
      renderCart();
    });
  }

  if (cartSubmit) {
    cartSubmit.addEventListener("click", () => {
      const name = cartCustomerName?.value.trim() || "";
      const contact = cartCustomerContact?.value.trim() || "";

      if (!cart.length) {
        alert("Please add at least one item to your cart.");
        return;
      }

      if (!name || !contact) {
        alert("Please enter your name and contact before submitting.");
        return;
      }

      const lines = cart.map((item, index) =>
        `${index + 1}. ${item.name} - ${formatCurrency(item.priceNow)} x ${item.quantity} = ${formatCurrency(item.priceNow * item.quantity)}`
      ).join("\n");
      const total = cart.reduce((sum, item) => sum + item.priceNow * item.quantity, 0);
      const message = encodeURIComponent(`Hello RLH,\nI would like to place this order.\n\nName: ${name}\nContact: ${contact}\n\n${lines}\n\nTotal: ${formatCurrency(total)}`);

      window.open(`https://wa.me/256767666693?text=${message}`, "_blank");
      cart.length = 0;
      renderCart();
    });
  }

  renderCart();
});
