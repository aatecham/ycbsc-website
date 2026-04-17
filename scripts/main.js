const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#siteNav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");
const galleryTriggers = document.querySelectorAll(".gallery-trigger");

if (lightbox && lightboxImg && lightboxClose && galleryTriggers.length) {
  galleryTriggers.forEach((button) => {
    button.addEventListener("click", () => {
      const imageSrc = button.getAttribute("data-image");
      const altText = button.getAttribute("data-alt") || "Gallery image";
      if (!imageSrc) return;

      lightboxImg.setAttribute("src", imageSrc);
      lightboxImg.setAttribute("alt", altText);
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.setAttribute("src", "");
    document.body.style.overflow = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.getAttribute("aria-hidden") === "false") {
      closeLightbox();
    }
  });
}

const contactForm = document.querySelector("#contactForm");
const submitNotice = document.querySelector("#submitNotice");

if (contactForm && submitNotice) {
  contactForm.addEventListener("submit", () => {
    submitNotice.textContent =
      "Submitting your enquiry. If this takes longer than expected, please email the club directly.";
  });
}

const formatNewsDate = (isoDate) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getSortedNews = () => {
  if (!Array.isArray(window.NEWS_ITEMS)) return [];
  return [...window.NEWS_ITEMS].sort((a, b) => new Date(b.date) - new Date(a.date));
};

const renderNewsItems = (targetElement, items, options = {}) => {
  const showFullContent = Boolean(options.showFullContent);
  const useExpandableCards = Boolean(options.useExpandableCards);
  targetElement.innerHTML = "";
  items.forEach((item) => {
    const fullParagraphs = Array.isArray(item.content) ? item.content : [];
    const shouldExpand = useExpandableCards && fullParagraphs.length > 0;
    const article = document.createElement("article");
    article.className = "card news-item";
    const appendNewsImage = (container) => {
      if (!item.image) return;
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt || item.title || "News image";
      image.className = "news-image";
      image.loading = "lazy";
      container.appendChild(image);
    };

    if (shouldExpand) {
      const details = document.createElement("details");
      details.className = "news-expand";

      const summaryRow = document.createElement("summary");
      summaryRow.className = "news-expand-summary";
      summaryRow.innerHTML = `
        <h3>${item.title || "News Update"}</h3>
        <p class="news-date">${formatNewsDate(item.date)}</p>
      `;
      details.appendChild(summaryRow);

      if (item.summary) {
        const summaryText = document.createElement("p");
        summaryText.textContent = item.summary;
        details.appendChild(summaryText);
      }

      appendNewsImage(details);

      fullParagraphs.forEach((paragraphText) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText;
        details.appendChild(paragraph);
      });

      article.appendChild(details);
    } else {
      const heading = document.createElement("h3");
      heading.textContent = item.title || "News Update";

      const date = document.createElement("p");
      date.className = "news-date";
      date.textContent = formatNewsDate(item.date);

      article.appendChild(heading);
      article.appendChild(date);

      if (item.summary) {
        const summary = document.createElement("p");
        summary.textContent = item.summary;
        article.appendChild(summary);
      }

      appendNewsImage(article);

      if (showFullContent) {
        fullParagraphs.forEach((paragraphText) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = paragraphText;
          article.appendChild(paragraph);
        });
      }
    }

    targetElement.appendChild(article);
  });
};

const latestNewsList = document.querySelector("#latestNewsList");
if (latestNewsList) {
  const latestFive = getSortedNews().slice(0, 5);
  renderNewsItems(latestNewsList, latestFive, { useExpandableCards: true });
}

const allNewsList = document.querySelector("#allNewsList");
if (allNewsList) {
  const allNews = getSortedNews();
  renderNewsItems(allNewsList, allNews, { showFullContent: true });
}
