# Design System: Editorial Sophistication for Mindtheos

## 1. Overview & Creative North Star: "The Intellectual Sanctuary"

This design system moves beyond the utility of a standard employee tool and positions itself as **The Intellectual Sanctuary**. For Mindtheos, we are not just building an app; we are crafting a focused, high-end digital environment that mirrors the clarity of a well-organized mind.

The "template" look is intentionally discarded in favor of **Asymmetric Balance** and **Atmospheric Depth**. By utilizing high-contrast typography scales and overlapping surface layers, we create a layout that feels curated and editorial. We lean into the "Brain" icon's complexity by using clean, expansive white space paired with deep, authoritative navy, ensuring the interface feels both human-centric and technologically advanced.

---

## 2. Colors: Tonal Authority

The palette is anchored in a high-contrast relationship between `primary` (#00216e) and `surface` (#f9f9f9). We utilize Material-inspired tonal tiers to define hierarchy without visual clutter.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. 
*   *Implementation:* Use `surface-container-low` for large background sections and `surface-container-lowest` for cards to create separation.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers. 
*   **Level 0 (Base):** `surface` (#f9f9f9)
*   **Level 1 (Sectioning):** `surface-container-low` (#f3f3f4)
*   **Level 2 (Interaction):** `surface-container-lowest` (#ffffff) — Reserved for primary interactive cards.
*   **Level 3 (Highlight):** `surface-bright` (#f9f9f9)

### The "Glass & Gradient" Rule
To elevate the app from "standard" to "signature," use semi-transparent `surface` colors with a 20px backdrop-blur for floating navigation or header elements. Use subtle linear gradients transitioning from `primary_container` (#0033a0) to `primary` (#00216e) for hero buttons to give them a three-dimensional, premium weight.

---

## 3. Typography: The Editorial Voice

We utilize **Inter** to bridge the gap between technical precision and readability. The hierarchy is intentionally dramatic to guide the eye through dense information.

*   **Display (Editorial Hero):** `display-sm` (2.25rem) is used for personal greetings (e.g., "Good morning, Alex") to create a welcoming, high-end feel.
*   **Headlines & Titles:** `headline-sm` (1.5rem) and `title-md` (1.125rem) provide the structural "bones" of the app.
*   **The Utility Layer:** `label-md` (0.75rem) and `label-sm` (0.6875rem) are for micro-copy. Despite their small size, we maintain high contrast using `on_surface` (#1a1c1c) to ensure accessibility.
*   **Body:** `body-md` (0.875rem) handles the bulk of employee data, optimized for readability with a generous line-height.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are largely replaced by **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` (White) card sitting on a `surface-container-low` (Pale Grey) background creates a natural lift.
*   **Ambient Shadows:** Where a "floating" effect is required (e.g., a Bottom Sheet), use a shadow with a 40px blur and 4% opacity, tinted with `#00216e` (the primary color) rather than black.
*   **The "Ghost Border" Fallback:** If a container requires further definition in high-glare environments, use the `outline_variant` token at **15% opacity**. Never use 100% opaque lines.
*   **Glassmorphism:** Use `surface_container_lowest` at 80% opacity with a `blur(12px)` for the top navigation bar. This allows content to bleed through softly as the user scrolls, creating a sense of continuity.

---

## 5. Components: Refined Interaction

### Buttons
*   **Primary:** `primary_container` (#0033a0) background, `on_primary` (White) text. Radius: `15px`.
*   **Secondary:** `secondary_container` background, `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. `on_surface` text with no container, utilizing `4.5` spacing for the hit area.

### Input Fields
*   **Surface:** `surface_container_low`. 
*   **Radius:** `15px`.
*   **State:** On focus, transition the background to `surface_container_lowest` and apply a "Ghost Border" of `primary` at 20% opacity.

### Cards & Lists
*   **Constraint:** Zero divider lines. 
*   **Method:** Use `2.5` (0.5rem) to `4` (0.9rem) spacing scales to separate list items. For complex lists, alternate background colors between `surface` and `surface_container_low`.

### Specialized App Components
*   **The Pulse Chip:** A small, semi-transparent chip (e.g., for "Pending" status) using `tertiary_container` with a 2px inner glow to indicate urgency without looking "alarming."
*   **Brain-Pattern Overlays:** Use a low-opacity (2%) SVG pattern of the logo's neural lines as a background texture on `primary` headers to add depth.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., wider left padding than right on certain display elements) to create an editorial, magazine-like feel.
*   **Do** prioritize `16` (3.5rem) spacing between major functional groups to let the design "breathe."
*   **Do** use `surface_tint` for subtle highlights on active navigation states.

### Don't
*   **Don't** use pure black #000000. Use `on_surface` (#1a1c1c) for all "black" text to maintain the premium navy undertone.
*   **Don't** use the 15px radius on everything. Keep it for containers, but use `full` (pill shape) for status chips to create visual variety.
*   **Don't** use standard "drop shadows" that look like heavy mud. If it looks "dirty," the opacity is too high.