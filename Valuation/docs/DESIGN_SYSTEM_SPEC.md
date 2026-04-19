# Epiidosis Valuation Portal — Complete UI/UX & Design System Specification

## 1️⃣ GLOBAL DESIGN FOUNDATION

### A. Color Palette
Type | Hex | Usage
--- | --- | ---
Primary Gradient (Royal Blue) | linear-gradient(135deg, #002B7F 0%, #007BFF 45%, #00CFFF 100%) | Hero sections, buttons, highlight banners
Accent Gradient (Sea Blue Glow) | linear-gradient(90deg, #00C6FF 0%, #0072FF 100%) | Hover states, CTAs, chart overlays
Surface White | #FFFFFF | Primary page background (70% of sections)
Off White / Mist | #F8FAFF | Background of cards and section dividers
Text Primary | #0F172A | Headings, strong body text
Text Secondary | #334155 | Paragraphs, footnotes
Success Green | #00D97E | AI success, validation
Error Red | #F87171 | Validation errors
Shadow Blue | rgba(0, 64, 255, 0.1) | Card shadows
Glass Overlay | rgba(255,255,255,0.05) | Transparency layers in hero/gradient sections

### B. Typography
Element | Font | Weight | Size | Example
--- | --- | --- | --- | ---
Headings (H1-H3) | Raleway | 700 | 36–52px | “AI-Driven Business & Asset Valuation Portal”
Body Text | Inter | 400–500 | 16–18px | Paragraphs, inputs, forms
Button Text | Raleway | 600 | 16px | Uppercase or small caps
Labels / Inputs | Inter | 500 | 14px | Muted gray text
Numerical Data | Roboto Mono | 500 | 16px | Charts, metrics, reports

All typography is anti-aliased with CSS property:

font-smooth: always;
-webkit-font-smoothing: antialiased;

### C. Layout & Section Rules
- Max Width: 1440px, content width 1180px centered.
- Grid System: 12-column CSS grid with 24px gutter.
- Section Padding: 120px top-bottom (hero), 80px normal.
- Container Margins: auto for central alignment.
- Responsive: fluid scaling with breakpoints for 1280, 1024, 768, 480.

## 2️⃣ COMPONENT DESIGN INSTRUCTIONS

### 1. Hero Section
Purpose: Capture attention, communicate value proposition.

Layout
- Background: animated gradient overlay
  background: radial-gradient(ellipse at 30% 30%, #0033A0 0%, #001A50 50%, #000C28 100%);
- Overlay animation (Framer Motion or Canvas):
  - Wave curves with slow oscillation (symbolic of financial flow).
  - Subtle glow dots (10–20px blur) that move slowly upward.

Elements
Component | Description | Behavior
--- | --- | ---
Heading | Large white gradient text (text-fill gradient using background-clip) | Fade-in + slide-up
Subtext | Max width 700px, lighter color #CFE9FF | Fade-up delay 0.2s
CTA Buttons | Dual: Primary (gradient fill), Secondary (outline white) | Hover → light bloom + upward movement
Hero Illustration | Right aligned (optional) — animated financial waveform or AI network mesh | Framer Motion scale pulse

Shadow / Depth
- box-shadow: 0 20px 60px rgba(0, 128, 255, 0.25);
- backdrop-filter: blur(20px);

### 2. Info Cards (About Section / Features)
Layout
- 3 cards per row, equal height, rounded 2xl corners.
- Background: White with blue-tinted shadow.
- On hover → gradient outline glow.

CSS Style
```
background: #FFFFFF;
border-radius: 20px;
box-shadow: 0 4px 20px rgba(0, 102, 255, 0.08);
transition: all 0.3s ease;
```

Hover Effect:
```
transform: translateY(-4px);
box-shadow: 0 8px 25px rgba(0, 102, 255, 0.15);
```

Elements
- Icon (Lucide or Feather) inside 50px gradient circle.
- Title (blue text), description (gray secondary).
- Optional “Learn More” link with underline animation.

### 3. How It Works (4-Step Cards)
Structure
- 4 horizontal cards with numbered step icons.
- Alternate background colors (white → light blue).

Visuals
- Use a diagonal connector line or dotted flow pattern.
- Animated step reveal (slide-in left to right).

Hover Effect
- Each step lifts and slightly rotates (Framer Motion tilt, 2°–3°).

### 4. Pricing Section
Layout
- 2 main pricing cards centered.
- Left: Free Valuation (outlined).
- Right: Certified Valuation (filled).

Design
Type | Background | Shadow | Hover
--- | --- | --- | ---
Free | White | light gray | subtle scale
Paid | Gradient Blue | glow shadow | strong lift

```
box-shadow: 0 8px 30px rgba(0, 140, 255, 0.2);
border-radius: 16px;
```

Elements
- Price typography large (48px).
- “Includes” section with icons and green ticks.
- CTA: rounded-pill button.

### 5. CTA Banner
Design
- Full-width dark blue gradient (#002A78 → #006BFF).
- Animated radial shimmer overlay.
- White heading and button with glowing borders.

Interaction
- Button hover → background fade to pure white + blue text.
- Optional animated background elements:
  - Subtle moving light streaks (using Framer Motion keyframes).

### 6. Footer
Layout
- White background with thin top border.
- Two columns: links + copyright.
- Subtle shadow separation:
  box-shadow: 0 -1px 0 rgba(0,0,0,0.05);

Typography
- Light gray text #64748B.
- Hover links → gradient text underline.

## 3️⃣ INTERACTIVE ELEMENTS
Component | Effect | Implementation
--- | --- | ---
Buttons | Soft pulse on hover + shadow bloom | Framer Motion + CSS gradient transitions
Cards | Tilt effect + gradient outline on hover | Framer Motion whileHover
Charts | Animate on scroll | Recharts with Animate=true
Forms | Floating labels + field glow on focus | Tailwind + motion.div transitions
Sections | Fade-up scroll reveal | whileInView with threshold 0.3
Hero Background | Wave / particle motion | react-three-fiber or SVG motion paths
Parallax Scroll | Layered background movement | Framer Motion useScroll transform

## 4️⃣ PAGE STRUCTURE INSTRUCTION SUMMARY
Page | Section | Dominant Color | Special Effects
--- | --- | --- | ---
Landing Page | Hero (Gradient), About (White), How It Works (Alt), Pricing (Gradient), CTA (Deep Blue) | 70% White, 30% Gradient | Animated background, card hovers, CTA glow
About Page | Hero (Overlay), Methodology (White), Compliance (Icons), Team (Profiles), CTA | 70% White | Parallax gradient header
Valuation Types | Alternating Blue/White | Charts + Iconography | Fade-in cards
Pricing Page | Dual Pricing, FAQ Accordion | Blue + White | Accordion animation
Reports Page | PDF preview on white background | Blue title bar | PDF.js zoom + shimmer loader
Partner Portal | Gradient header, white dashboard cards | Blue + glass overlay | Dynamic shadows
Dashboard (User) | White cards with blue shadows | 80% white | Live chart animation

## 5️⃣ MICROINTERACTIONS & MOTION
Type | Motion Behavior | Example
--- | --- | ---
Page Load | Fade-in + rise (20px, 0.6s) | All sections
Scroll Reveal | Slide-up (Framer Motion whileInView) | Cards, sections
Hover Glow | Brighten gradient + scale 1.03 | Buttons, icons
Background Particles | Slow drift (randomized keyframes) | Hero section
Gradient Shimmer | Linear gradient mask animates left-to-right | CTA background
Chart Transition | Line growth / Pie expansion (0.8s easeOut) | Dashboard
Input Focus | Blue border glow + floating label | Forms

## 6️⃣ REACT COMPONENT TREE GUIDELINES
```
/components
 ├── HeroSection/
 │   ├── AnimatedBackground.jsx (Framer Motion)
 │   ├── HeroTextBlock.jsx
 │   ├── CTAButtons.jsx
 │
 ├── InfoCards/
 │   ├── InfoCard.jsx
 │   ├── CardGrid.jsx
 │
 ├── Pricing/
 │   ├── PricingCard.jsx
 │   ├── ComparisonTable.jsx
 │
 ├── CTA/
 │   ├── GradientBanner.jsx
 │
 ├── Footer/
 │   ├── FooterLinks.jsx
 │
 └── Shared/
     ├── AnimatedSection.jsx
     ├── ParallaxLayer.jsx
     ├── ChartWidget.jsx
     ├── FloatingParticles.jsx
```

## 7️⃣ IMPLEMENTATION DIRECTIVES FOR WIND SURF
- Do not use default Tailwind colors.
- Always use custom variables (define in /styles/globals.css).
- Every major section must have alternating white / gradient background. (70% white, 30% royal-blue gradient).
- Use shadows & gradients over solid fills. (e.g., cards should appear as floating layers, not flat boxes).
- Add parallax backgrounds for hero & CTA sections.
- Use Framer Motion useScroll transform with opacity fade.
- Charts and infographics should animate once on scroll-in view.
- Keep spacing and typography identical across all pages.
- Use Tailwind theme extension:
```
extend: {
  fontFamily: {
    raleway: ['Raleway', 'sans-serif'],
    inter: ['Inter', 'sans-serif'],
  },
  boxShadow: {
    blue: '0 8px 25px rgba(0, 140, 255, 0.15)',
  },
}
```
