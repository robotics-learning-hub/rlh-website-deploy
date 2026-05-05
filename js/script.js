document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     HERO BACKGROUND SLIDER
  ========================= */
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  if (slides.length > 1) {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000);
  }

  /* =========================
     MOBILE HAMBURGER MENU
  ========================= */
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

  /* =========================
     SCHOOL ONBOARDING NOTICE
  ========================= */
  const schoolNotice = document.createElement("aside");
  schoolNotice.className = "school-notice";
  schoolNotice.setAttribute("role", "status");
  schoolNotice.setAttribute("aria-live", "polite");
  schoolNotice.innerHTML = `
    <button type="button" class="school-notice-close" aria-label="Hide notice">x</button>
    <p class="school-notice-kicker">School onboarding now open</p>
    <h3>Bring Robotics, AI & Coding to your learners this term.</h3>
    <p>More schools are joining RLH programs. Give your students the confidence to build, code, and create the future today.</p>
    <a href="contact.html" class="school-notice-link">Bring RLH to your school</a>
  `;
  document.body.appendChild(schoolNotice);

  const showSchoolNotice = () => {
    schoolNotice.classList.add("is-visible");
  };

  const hideSchoolNotice = () => {
    schoolNotice.classList.remove("is-visible");
  };

  setTimeout(() => {
    showSchoolNotice();
    setTimeout(hideSchoolNotice, 9000);
  }, 2200);
  setInterval(() => {
    showSchoolNotice();
    setTimeout(hideSchoolNotice, 9000);
  }, 26000);

  schoolNotice.querySelector(".school-notice-close")?.addEventListener("click", hideSchoolNotice);

  /* =========================
     SCROLL REVEAL ANIMATION
  ========================= */
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach((el) => {
    el.classList.add("hidden-reveal");
  });

  function revealOnScroll() {
    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - 100) {
        element.classList.add("active");
        element.classList.remove("hidden-reveal");
      }
    });
  }

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  /* =========================
     HEADER SHADOW ON SCROLL
  ========================= */
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.style.boxShadow = "0 8px 20px rgba(0,0,0,0.18)";
    } else {
      header.style.boxShadow = "0 4px 15px rgba(0,0,0,0.12)";
    }
  });

  /* =========================
     ANIMATED COUNTERS
  ========================= */
  const counters = document.querySelectorAll(".counter");
  let counterStarted = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = Number(counter.getAttribute("data-target"));
      let count = 0;
      const increment = Math.max(1, Math.ceil(target / 100));

      function updateCounter() {
        count += increment;
        if (count < target) {
          counter.innerText = count + "+";
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target + "+";
        }
      }

      updateCounter();
    });
  }

  function startCountersOnScroll() {
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection || counterStarted) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      runCounters();
      counterStarted = true;
    }
  }

  startCountersOnScroll();
  window.addEventListener("scroll", startCountersOnScroll);

  /* =========================
     CONTACT FORM -> WHATSAPP
  ========================= */
  const form = document.querySelector(".contact-form");
  const messageBox = document.getElementById("form-message");

  function showMessage(text, type) {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.className = "form-message " + type;
  }

  if (form) {
    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn ? submitBtn.querySelector("span") : null;
    const apiEndpoint = form.dataset.apiEndpoint?.trim() || "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector('input[name="Full Name"]')?.value.trim() || "";
      const email = form.querySelector('input[name="Email"]')?.value.trim() || "";
      const phone = form.querySelector('input[name="Phone"]')?.value.trim() || "";
      const inquiry = form.querySelector('select[name="Inquiry Type"]')?.value.trim() || "";
      const message = form.querySelector('textarea[name="Message"]')?.value.trim() || "";

      if (!name || !email || !phone || !inquiry || !message) {
        showMessage("Please fill in all required fields.", "error");
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = apiEndpoint ? "Sending..." : "Opening WhatsApp...";

      const payload = {
        name,
        organization: form.querySelector('input[name="Organization"]')?.value.trim() || "",
        email,
        phone,
        inquiry,
        message
      };

      const openWhatsAppFallback = () => {
        showMessage("Opening WhatsApp so you can send your message directly.", "loading");

        const whatsappMessage = encodeURIComponent(
          `Hello RLH,
Name: ${payload.name}
Organization: ${payload.organization || "N/A"}
Email: ${payload.email}
Phone: ${payload.phone}
Inquiry: ${payload.inquiry}
Message: ${payload.message}`
        );

        window.open(`https://wa.me/256767666693?text=${whatsappMessage}`, "_blank");
        showMessage("WhatsApp opened with your pre-filled message.", "success");

        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = "Send Inquiry";
      };

      if (!apiEndpoint) {
        openWhatsAppFallback();
        return;
      }

      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed");
          }

          form.reset();
          showMessage("Your inquiry was sent successfully. We'll get back to you soon.", "success");
        })
        .catch(() => {
          openWhatsAppFallback();
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = "Send Inquiry";
        });
    });
  }

  /* =========================
     KITS SEARCH FILTER
  ========================= */
  const kitsSearchInput = document.getElementById("kits-search");
  const kitsCards = document.querySelectorAll(".kits-grid .sales-card[data-search]");
  const inventoryItems = document.querySelectorAll(".inventory-item[data-search]");
  const kitsStatus = document.getElementById("kits-search-status");
  const kitsEmptyState = document.getElementById("kits-empty-state");
  const inventoryResult = document.getElementById("inventory-result");
  const inventoryResultImage = document.getElementById("inventory-result-image");
  const inventoryResultName = document.getElementById("inventory-result-name");
  const inventoryResultWas = document.getElementById("inventory-result-was");
  const inventoryResultNow = document.getElementById("inventory-result-now");
  const inventoryResultAdd = document.getElementById("inventory-result-add");
  const inventoryResultNote = document.getElementById("inventory-result-note");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCustomerName = document.getElementById("cart-customer-name");
  const cartCustomerContact = document.getElementById("cart-customer-contact");
  const cartSubmit = document.getElementById("cart-submit");
  const programSelectors = document.querySelectorAll(".program-selector");
  const programDetailName = document.getElementById("program-detail-name");
  const programDetailTag = document.getElementById("program-detail-tag");
  const programDetailDescription = document.getElementById("program-detail-description");
  const programDetailPoints = document.getElementById("program-detail-points");
  const programDetailLink = document.getElementById("program-detail-link");
  const readMoreToggles = document.querySelectorAll(".read-more-toggle");
  let currentSearchResult = null;
  const cart = [];
  const CART_STORAGE_KEY = "rlh_cart";
  const CART_CUSTOMER_STORAGE_KEY = "rlh_cart_customer";
  const CART_ITEM_MIGRATIONS = {
    "Starter Robotics Kit": {
      name: "RLH Explorer Kit",
      priceNow: 190000,
      priceWas: "UGX 250,000",
      image: "images/RLH-explorer-kit.jpg"
    },
    "Arduino Learning Kit": {
      name: "RLH Innovator Kit",
      priceNow: 320000,
      priceWas: "UGX 380,000",
      image: "images/RLH-Innovator-Kit.jpg"
    },
    "School Lab Bundle": {
      name: "RLH Pro Kit",
      priceNow: 570000,
      priceWas: "UGX 650,000",
      image: "images/RLH-pro-kit.jpg"
    }
  };

  const formatCurrency = (value) => `UGX ${Number(value || 0).toLocaleString()}`;

  const findCartItem = (name) => cart.find((item) => item.name === name);

  const saveCartState = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      localStorage.setItem(
        CART_CUSTOMER_STORAGE_KEY,
        JSON.stringify({
          name: cartCustomerName?.value.trim() || "",
          contact: cartCustomerContact?.value.trim() || ""
        })
      );
    } catch (error) {
      console.warn("Unable to save cart state.", error);
    }
  };

  const clearCartState = () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CART_CUSTOMER_STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear cart state.", error);
    }
  };

  const loadCartState = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      const storedCustomer = JSON.parse(localStorage.getItem(CART_CUSTOMER_STORAGE_KEY) || "{}");

      if (Array.isArray(storedCart)) {
        storedCart.forEach((item) => {
          if (item?.name && Number(item?.priceNow) >= 0 && Number(item?.quantity) > 0) {
            const migratedItem = CART_ITEM_MIGRATIONS[item.name] || {};
            const cartItem = {
              name: migratedItem.name || item.name,
              priceNow: Number(migratedItem.priceNow || item.priceNow),
              priceWas: migratedItem.priceWas || item.priceWas || "",
              image: migratedItem.image || item.image || "",
              quantity: Number(item.quantity)
            };
            const existingItem = findCartItem(cartItem.name);

            if (existingItem) {
              existingItem.quantity += cartItem.quantity;
            } else {
              cart.push(cartItem);
            }
          }
        });
      }

      if (cartCustomerName && typeof storedCustomer.name === "string") {
        cartCustomerName.value = storedCustomer.name;
      }

      if (cartCustomerContact && typeof storedCustomer.contact === "string") {
        cartCustomerContact.value = storedCustomer.contact;
      }
    } catch (error) {
      console.warn("Unable to load saved cart state.", error);
    }
  };

  const renderCart = () => {
    if (!cartItemsContainer || !cartTotal) return;

    if (!cart.length) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty. Add a kit or material to begin.</p>';
      cartTotal.textContent = "UGX 0";
      saveCartState();
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
          <span>${item.quantity}</span>
          <button type="button" class="qty-btn" data-action="increase">+</button>
        </div>
        <button type="button" class="remove-btn" data-action="remove">Remove</button>
      </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + (item.priceNow * item.quantity), 0);
    cartTotal.textContent = formatCurrency(total);
    saveCartState();
  };

  const addToCart = (item) => {
    if (!item || !item.name) return;

    const existingItem = findCartItem(item.name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: item.name,
        priceNow: Number(item.priceNow),
        priceWas: item.priceWas,
        image: item.image,
        quantity: 1
      });
    }

    renderCart();
  };

  const extractItemData = (element) => ({
    name: element.dataset.name || element.querySelector("h3, .inventory-name")?.textContent || "Available Item",
    image: element.dataset.image || element.querySelector("img")?.getAttribute("src") || "",
    priceWas: element.dataset.priceWas || "",
    priceNow: Number(element.dataset.priceNumber || 0)
  });

  if (kitsSearchInput && (kitsCards.length || inventoryItems.length)) {
    const runInventorySearch = () => {
      const term = kitsSearchInput.value.trim().toLowerCase();
      let visibleCount = 0;
      let firstMatch = null;

      kitsCards.forEach((card) => {
        const searchText = (card.getAttribute("data-search") || "").toLowerCase();
        const isMatch = !term || searchText.includes(term);

        card.hidden = !isMatch;

        if (isMatch) {
          visibleCount += 1;

          if (!firstMatch) {
            firstMatch = extractItemData(card);
          }
        }
      });

      inventoryItems.forEach((item) => {
        const searchText = (item.getAttribute("data-search") || "").toLowerCase();
        const isMatch = !term || searchText.includes(term);

        item.hidden = !isMatch;

        if (isMatch) {
          visibleCount += 1;

          if (!firstMatch) {
            firstMatch = extractItemData(item);
          }
        }
      });

      if (kitsEmptyState) {
        kitsEmptyState.hidden = visibleCount !== 0;
      }

      if (inventoryResult && inventoryResultImage && inventoryResultName && inventoryResultWas && inventoryResultNow) {
        if (term && firstMatch) {
          currentSearchResult = firstMatch;
          inventoryResult.hidden = false;
          inventoryResultImage.src = firstMatch.image;
          inventoryResultImage.alt = firstMatch.name;
          inventoryResultName.textContent = firstMatch.name;
          inventoryResultWas.textContent = firstMatch.priceWas;
          inventoryResultNow.textContent = formatCurrency(firstMatch.priceNow);
          if (inventoryResultNote) {
            inventoryResultNote.textContent = "Ready to add this item to your cart.";
          }
        } else {
          currentSearchResult = null;
          inventoryResult.hidden = true;
        }
      }

      if (kitsStatus) {
        kitsStatus.textContent = term
          ? `Found ${visibleCount} item${visibleCount === 1 ? "" : "s"} for "${kitsSearchInput.value.trim()}".`
          : "Showing all available kits and materials.";
      }
    };

    kitsSearchInput.addEventListener("input", runInventorySearch);

    inventoryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const itemName = item.querySelector(".inventory-name")?.textContent || "";
        kitsSearchInput.value = itemName;
        runInventorySearch();
      });
    });
  }

  kitsCards.forEach((card) => {
    const addButton = card.querySelector(".add-to-cart-btn");
    if (!addButton) return;

    addButton.addEventListener("click", () => {
      addToCart(extractItemData(card));
    });
  });

  if (inventoryResultAdd) {
    inventoryResultAdd.addEventListener("click", () => {
      if (!currentSearchResult) return;
      addToCart(currentSearchResult);

      if (inventoryResultNote) {
        inventoryResultNote.textContent = `${currentSearchResult.name} added to cart.`;
      }
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      const cartItem = target.closest(".cart-item");
      if (!cartItem) return;

      const itemName = cartItem.getAttribute("data-cart-name");
      const selectedItem = findCartItem(itemName);
      if (!selectedItem) return;

      const action = target.getAttribute("data-action");

      if (action === "increase") {
        selectedItem.quantity += 1;
      } else if (action === "decrease") {
        selectedItem.quantity = Math.max(1, selectedItem.quantity - 1);
      } else if (action === "remove") {
        const itemIndex = cart.findIndex((item) => item.name === itemName);
        if (itemIndex >= 0) {
          cart.splice(itemIndex, 1);
        }
      }

      renderCart();
    });
  }

  if (cartSubmit) {
    cartSubmit.addEventListener("click", () => {
      const customerName = cartCustomerName?.value.trim() || "";
      const customerContact = cartCustomerContact?.value.trim() || "";

      if (!cart.length) {
        alert("Please add at least one item to your cart.");
        return;
      }

      if (!customerName || !customerContact) {
        alert("Please enter your name and contact before submitting your order.");
        return;
      }

      const orderLines = cart.map((item, index) =>
        `${index + 1}. ${item.name} - ${formatCurrency(item.priceNow)} x ${item.quantity} = ${formatCurrency(item.priceNow * item.quantity)}`
      ).join("\n");

      const total = cart.reduce((sum, item) => sum + (item.priceNow * item.quantity), 0);
      const orderMessage = encodeURIComponent(
        `Hello RLH,\nI would like to place this order.\n\nName: ${customerName}\nContact: ${customerContact}\n\nCart:\n${orderLines}\n\nTotal: ${formatCurrency(total)}`
      );

      window.open(`https://wa.me/256767666693?text=${orderMessage}`, "_blank");
      cart.length = 0;
      if (cartCustomerName) cartCustomerName.value = "";
      if (cartCustomerContact) cartCustomerContact.value = "";
      clearCartState();
      renderCart();
    });
  }

  if (cartCustomerName) {
    cartCustomerName.addEventListener("input", saveCartState);
  }

  if (cartCustomerContact) {
    cartCustomerContact.addEventListener("input", saveCartState);
  }

  if (programSelectors.length && programDetailName && programDetailTag && programDetailDescription && programDetailPoints && programDetailLink) {
    const renderProgramDetail = (button) => {
      programSelectors.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      programDetailName.textContent = button.dataset.programName || "";
      programDetailTag.textContent = button.dataset.programTag || "";
      programDetailDescription.textContent = button.dataset.programDescription || "";
      programDetailLink.href = button.dataset.programLink || "contact.html";
      programDetailLink.textContent = button.dataset.programLinkLabel || "Learn More";

      const points = (button.dataset.programPoints || "")
        .split("|")
        .filter(Boolean)
        .map((point) => `<li>${point}</li>`)
        .join("");

      programDetailPoints.innerHTML = points;
    };

    programSelectors.forEach((button) => {
      button.addEventListener("click", () => renderProgramDetail(button));
    });
  }

  readMoreToggles.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".program-card");
      const extraContent = card?.querySelector(".program-extra");
      if (!extraContent) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      extraContent.hidden = isExpanded;
      button.setAttribute("aria-expanded", String(!isExpanded));
      button.textContent = isExpanded ? "Readmore" : "Show Less";
    });
  });

  loadCartState();
  renderCart();
});
