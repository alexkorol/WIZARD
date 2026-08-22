/*
 * Read-only browser probe used for WIZARD-SURGE-004.
 * Run after the page load event at DPR 1 and either 1280x800 or 375x900.
 */
window.__wizardTypographySpacingProbe = function () {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" &&
      style.visibility !== "hidden" &&
      rect.width > 0 &&
      rect.height > 0;
  };

  const styleOf = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      className: typeof element.className === "string"
        ? element.className.trim().slice(0, 120) || null
        : null,
      text: (element.innerText || element.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 100),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      textTransform: style.textTransform,
      margin: [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft],
      padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
      gap: [style.rowGap, style.columnGap],
      width: Number(rect.width.toFixed(2)),
      height: Number(rect.height.toFixed(2)),
    };
  };

  const pick = (selector) => styleOf(
    [...document.querySelectorAll(selector)].find(visible),
  );
  const tally = (values) => [...values.reduce(
    (map, value) => map.set(value, (map.get(value) || 0) + 1),
    new Map(),
  )].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const textElements = [...document.querySelectorAll("body *")].filter(
    (element) => visible(element) &&
      (element.innerText || "").trim() &&
      [...element.children].every((child) => !(child.innerText || "").trim()),
  );

  const spacing = [];
  const spacingProperties = [
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "marginTop", "marginRight", "marginBottom", "marginLeft",
    "rowGap", "columnGap",
  ];
  for (const element of [...document.querySelectorAll("body *")].filter(visible)) {
    const style = getComputedStyle(element);
    for (const property of spacingProperties) {
      const raw = style[property];
      const value = Number(String(raw).replace("px", ""));
      if (Number.isFinite(value) && value > 0 && value <= 160) spacing.push(raw);
    }
  }

  return {
    title: document.title,
    url: location.pathname,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    overflow: {
      htmlClientWidth: document.documentElement.clientWidth,
      htmlScrollWidth: document.documentElement.scrollWidth,
      bodyClientWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
    },
    representatives: {
      body: styleOf(document.body),
      header: pick("header"),
      main: pick("main"),
      h1: pick("h1"),
      h2: pick("h2"),
      bodyCopy: pick("p"),
      label: pick("label"),
      control: pick("button,select,input,a[href]"),
      panel: pick("aside,[class*='panel'],section,article,[class*='card']"),
    },
    fontFamilies: tally(textElements.map((element) => getComputedStyle(element).fontFamily)).slice(0, 8),
    fontSizes: tally(textElements.map((element) => getComputedStyle(element).fontSize)).slice(0, 14),
    lineHeights: tally(textElements.map((element) => getComputedStyle(element).lineHeight)).slice(0, 10),
    letterSpacings: tally(textElements.map((element) => getComputedStyle(element).letterSpacing)).slice(0, 10),
    spacingValues: tally(spacing).slice(0, 18),
  };
};
