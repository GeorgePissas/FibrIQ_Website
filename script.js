"use strict";

// Keep the navigation available when JavaScript is disabled.
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const mobileLayout = matchMedia("(max-width: 48rem)");

function closeMenu(restoreFocus = false) {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  if (restoreFocus) menuButton.focus();
}

header.classList.add("menu-enhanced");
menuButton.hidden = false;
mobileLayout.addEventListener("change", () => closeMenu());
menuButton.addEventListener("click", () => {
  const opened = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(opened));
});
header.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) closeMenu(true);
});
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !mobileLayout.matches) return;
  const destination = document.querySelector(link.hash);
  closeMenu();
  if (destination) {
    destination.setAttribute("tabindex", "-1");
    destination.focus({ preventScroll: true });
  }
});

// Two views of the original pitch artwork.
const figureSwitch = document.querySelector(".figure-switch");
const bracket = document.querySelector("#hero-bracket");
const bracketCaption = document.querySelector("#bracket-caption");
const bracketViews = {
  fibres: {
    image: "assets/illustrations/bracket-fibres.webp",
    alt: "Lightweight composite bracket with cut-outs, three mounting holes and curved continuous fibre paths.",
    caption: "Continuous fibre trajectories",
  },
  phase: {
    image: "assets/illustrations/bracket-phase-field.webp",
    alt: "Composite bracket with a warm-coloured zone near the upper mounting hole illustrating a localised phase field.",
    caption: "Phase-field fracture illustration",
  },
};

const bracketButtons = [...figureSwitch.querySelectorAll("button")];
figureSwitch.hidden = false;
for (const button of bracketButtons) {
  button.addEventListener("click", () => {
    const view = bracketViews[button.dataset.view];
    bracket.src = view.image;
    bracket.alt = view.alt;
    bracketCaption.textContent = view.caption;
    for (const option of bracketButtons) option.setAttribute("aria-pressed", String(option === button));
  });
}

// Synthetic profiles match the separate peaks in the pitch's illustrative chart.
const angleSlider = document.querySelector("#fibre-angle");
const angleValue = document.querySelector("#angle-value");
const angleGuide = document.querySelector("#angle-guide");
const chartWidth = 451;
const xAt = (angle) => 46 + angle / 90 * chartWidth;
const yAt = (value) => 173 - 148 * value;
const bell = (angle, centre, spread) => Math.exp(-(((angle - centre) / spread) ** 2));
const profiles = [
  { key: "stiffness", value: (angle) => .22 + .68 * bell(angle, 34, 24) + .07 * bell(angle, 78, 9) },
  { key: "fracture", value: (angle) => .16 + .23 * bell(angle, 17, 11) + .74 * bell(angle, 62, 20) },
];

for (const profile of profiles) {
  const curve = document.querySelector(`#${profile.key}-curve`);
  profile.point = document.querySelector(`#${profile.key}-point`);
  const coordinates = Array.from({ length: 91 }, (_, angle) =>
    `${xAt(angle).toFixed(2)} ${yAt(profile.value(angle)).toFixed(2)}`
  );
  curve.setAttribute("d", `M${coordinates.join(" L")}`);
}

function updateAngle() {
  const angle = Number(angleSlider.value);
  const x = xAt(angle);
  angleValue.textContent = `${angle}°`;
  angleSlider.setAttribute("aria-valuetext", `${angle} degrees`);
  angleGuide.setAttribute("d", `M${x} 25V173`);
  for (const profile of profiles) {
    profile.point.setAttribute("cx", x);
    profile.point.setAttribute("cy", yAt(profile.value(angle)));
  }
}

angleSlider.addEventListener("input", updateAngle);
updateAngle();
document.querySelector(".chart-controls").hidden = false;
document.querySelector("#chart-marker").setAttribute("visibility", "visible");

// Without JavaScript, each module link jumps to its full, visible description.
const ecosystem = document.querySelector(".ecosystem");
const modulePanels = [...ecosystem.querySelectorAll(".module-details article")];
const moduleLinks = [...ecosystem.querySelectorAll(".module-node")];
const moduleButtons = moduleLinks.map((link) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = link.className;
  button.dataset.module = link.dataset.module;
  button.setAttribute("aria-controls", `module-${link.dataset.module}`);
  button.append(...link.childNodes);
  link.replaceWith(button);
  return button;
});

function selectModule(key) {
  for (const button of moduleButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.module === key));
  }
  for (const panel of modulePanels) {
    panel.hidden = panel.id !== `module-${key}`;
    panel.inert = panel.hidden;
  }
}

for (const button of moduleButtons) {
  button.addEventListener("click", () => selectModule(button.dataset.module));
}

function selectLinkedModule() {
  const linkedModule = moduleButtons.find((button) => location.hash === `#module-${button.dataset.module}`);
  if (linkedModule) selectModule(linkedModule.dataset.module);
}

ecosystem.classList.add("ecosystem-interactive");
document.querySelector(".module-details").setAttribute("aria-live", "polite");
selectModule("design");
selectLinkedModule();
addEventListener("hashchange", selectLinkedModule);

// Keep the supplied videos silent and user-controlled, with one playing at a time.
const demos = [...document.querySelectorAll(".demo video")];
for (const video of demos) {
  video.addEventListener("play", () => {
    for (const other of demos) {
      if (other !== video && !other.paused) other.pause();
    }
  });
}

function renderTeam(members) {
  const list = document.querySelector("#team-list");
  for (const member of members) {
    if (!member.name?.trim()) continue;
    const article = document.createElement("article");
    const details = document.createElement("div");
    const name = document.createElement("h3");
    article.className = "team-member";
    name.textContent = member.name;
    if (member.portrait?.startsWith("assets/")) {
      const portrait = document.createElement("img");
      portrait.src = member.portrait;
      portrait.alt = "";
      portrait.width = 84;
      portrait.height = 84;
      portrait.loading = "lazy";
      portrait.addEventListener("error", () => portrait.remove());
      article.append(portrait);
    }
    details.append(name);
    if (member.role) {
      const role = document.createElement("p");
      role.className = "team-role";
      role.textContent = member.role;
      details.append(role);
    }
    if (member.bio) {
      const bio = document.createElement("p");
      bio.textContent = member.bio;
      details.append(bio);
    }
    article.append(details);
    list.append(article);
  }
  if (list.childElementCount) {
    list.hidden = false;
    document.querySelector("#team-placeholder").hidden = true;
  }
}

function renderContact(email, socialLinks) {
  const address = email.trim();
  const links = socialLinks.filter((link) => link.label?.trim() && /^https:\/\/[^\s/]+/i.test(link.url));
  if (/^[^\s@?,#]+@[^\s@?,#]+\.[^\s@?,#]+$/.test(address)) {
    links.unshift({ label: "Email FibrIQ", url: `mailto:${encodeURIComponent(address)}` });
  }
  if (!links.length) return;
  for (const container of document.querySelectorAll("[data-contact-links]")) {
    for (const [index, link] of links.entries()) {
      const element = document.createElement("a");
      element.textContent = link.label;
      element.href = link.url;
      if (container.classList.contains("actions")) {
        element.className = index === 0 ? "button button-primary" : "button button-outline";
      }
      container.append(element);
    }
    container.hidden = false;
  }
  document.querySelector("#contact-placeholder").hidden = true;
}

const config = window.FIBRIQ_CONFIG ?? {};
renderTeam(config.team ?? []);
renderContact(config.contactEmail ?? "", config.socialLinks ?? []);
document.querySelector("#copyright-year").textContent = new Date().getFullYear();
