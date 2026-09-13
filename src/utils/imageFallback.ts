const externalImagePattern = /^https?:\/\//i;

function pickTheme(label: string) {
  const text = label.toLowerCase();

  if (text.includes("logo") || text.includes("agrisage")) {
    return {
      title: "AgriSage",
      icon: "leaf",
      start: "#155f22",
      end: "#49a66a",
      bg: "#f0f8ef",
    };
  }

  if (text.includes("trần") || text.includes("nguyễn") || text.includes("lê ") || text.includes("phạm") || text.includes("avatar")) {
    return {
      title: "Hồ sơ",
      icon: "person",
      start: "#1f5133",
      end: "#82b366",
      bg: "#f4f8f2",
    };
  }

  if (text.includes("thuốc") || text.includes("ridomil") || text.includes("nativo") || text.includes("bvtv") || text.includes("nấm")) {
    return {
      title: "BVTV",
      icon: "bottle",
      start: "#156c45",
      end: "#78b95b",
      bg: "#f2faf3",
    };
  }

  if (text.includes("phân") || text.includes("npk") || text.includes("humic") || text.includes("hữu cơ")) {
    return {
      title: "Phân bón",
      icon: "bag",
      start: "#2c6e37",
      end: "#b8c957",
      bg: "#fbfbef",
    };
  }

  if (text.includes("hạt") || text.includes("giống") || text.includes("cây giống")) {
    return {
      title: "Hạt giống",
      icon: "seed",
      start: "#377b35",
      end: "#d2a24a",
      bg: "#fff8ea",
    };
  }

  if (text.includes("tưới") || text.includes("thiết bị")) {
    return {
      title: "Thiết bị",
      icon: "drop",
      start: "#176c5e",
      end: "#52a3b3",
      bg: "#eef9fa",
    };
  }

  if (text.includes("vườn") || text.includes("sầu riêng") || text.includes("nông") || text.includes("canh tác") || text.includes("năng suất")) {
    return {
      title: "Nông nghiệp",
      icon: "field",
      start: "#1c6d37",
      end: "#8fbf4d",
      bg: "#f1f8ef",
    };
  }

  return {
    title: "AgriSage",
    icon: "field",
    start: "#155f22",
    end: "#76a84b",
    bg: "#f5faf2",
  };
}

function iconMarkup(icon: string) {
  if (icon === "person") {
    return `
      <circle cx="128" cy="106" r="38" fill="white" opacity=".92"/>
      <path d="M62 214c10-45 41-70 66-70s56 25 66 70" fill="white" opacity=".92"/>
    `;
  }

  if (icon === "bottle") {
    return `
      <rect x="92" y="48" width="72" height="28" rx="8" fill="white" opacity=".92"/>
      <rect x="82" y="70" width="92" height="132" rx="22" fill="white" opacity=".92"/>
      <path d="M96 124h64M96 148h64" stroke="#155f22" stroke-width="10" stroke-linecap="round" opacity=".65"/>
    `;
  }

  if (icon === "bag") {
    return `
      <path d="M78 84h100l18 122H60L78 84z" fill="white" opacity=".94"/>
      <path d="M98 84c4-23 17-36 30-36s26 13 30 36" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" opacity=".9"/>
      <path d="M96 134h64M106 160h44" stroke="#155f22" stroke-width="10" stroke-linecap="round" opacity=".65"/>
    `;
  }

  if (icon === "seed") {
    return `
      <path d="M128 194c-7-50 4-96 44-124 24 55 6 106-44 124z" fill="white" opacity=".94"/>
      <path d="M128 194c-4-45-24-78-70-100-12 56 18 96 70 100z" fill="white" opacity=".78"/>
      <path d="M128 194c4-40 14-76 36-112" stroke="#155f22" stroke-width="9" stroke-linecap="round" opacity=".55"/>
    `;
  }

  if (icon === "drop") {
    return `
      <path d="M128 42c39 50 68 88 68 124 0 38-30 66-68 66s-68-28-68-66c0-36 29-74 68-124z" fill="white" opacity=".92"/>
      <path d="M100 176c10 16 26 24 48 20" fill="none" stroke="#155f22" stroke-width="10" stroke-linecap="round" opacity=".45"/>
    `;
  }

  if (icon === "leaf") {
    return `
      <path d="M56 142c56-86 134-78 160-78-2 66-46 124-116 124-17 0-31-3-44-10z" fill="white" opacity=".94"/>
      <path d="M76 166c36-30 72-50 116-74" stroke="#155f22" stroke-width="11" stroke-linecap="round" opacity=".55"/>
      <path d="M102 134c-15-30-38-49-68-58 2 55 26 86 68 94z" fill="white" opacity=".78"/>
    `;
  }

  return `
    <path d="M16 188c40-34 77-50 112-50s72 16 112 50v52H16z" fill="white" opacity=".3"/>
    <path d="M16 176c38-24 75-36 112-36s74 12 112 36" fill="none" stroke="white" stroke-width="12" stroke-linecap="round" opacity=".7"/>
    <path d="M58 138c8-36 31-64 70-84 39 20 62 48 70 84" fill="none" stroke="white" stroke-width="14" stroke-linecap="round" opacity=".85"/>
    <circle cx="128" cy="78" r="18" fill="white" opacity=".9"/>
  `;
}

export function getFallbackImage(label = "AgriSage") {
  const theme = pickTheme(label);
  const title = theme.title.replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="512" height="512">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${theme.start}"/>
          <stop offset="1" stop-color="${theme.end}"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${theme.bg}"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="26" fill="url(#ground)"/>
      <circle cx="206" cy="42" r="66" fill="url(#g)" opacity=".13"/>
      <circle cx="58" cy="218" r="92" fill="url(#g)" opacity=".12"/>
      <circle cx="128" cy="128" r="96" fill="url(#g)"/>
      ${iconMarkup(theme.icon)}
      <text x="128" y="236" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="${theme.start}">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyLocalImage(img: HTMLImageElement) {
  const currentSrc = img.getAttribute("src") || "";
  if (!externalImagePattern.test(currentSrc) || img.dataset.localFallback === "true") {
    return;
  }

  img.dataset.originalSrc = currentSrc;
  img.dataset.localFallback = "true";
  img.src = getFallbackImage(img.alt || img.getAttribute("aria-label") || "AgriSage");
}

export function installImageFallbacks() {
  const applyAll = (root: ParentNode = document) => {
    root.querySelectorAll("img").forEach((img) => applyLocalImage(img as HTMLImageElement));
  };

  applyAll();

  window.addEventListener(
    "error",
    (event) => {
      const target = event.target;
      if (target instanceof HTMLImageElement) {
        target.src = getFallbackImage(target.alt || "AgriSage");
        target.dataset.localFallback = "true";
      }
    },
    true,
  );

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          applyLocalImage(node);
        } else if (node instanceof HTMLElement) {
          applyAll(node);
        }
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}
