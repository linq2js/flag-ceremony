# Badge Design Reference

Implemented badge designs for Flag Ceremony app. Total: **6 badge types** × **4 themes**.

## Customizable Elements

| Element                | Description                             | Dynamic |
| ---------------------- | --------------------------------------- | ------- |
| **Photo placeholder**  | Circular area for user profile photo    | ✅      |
| **Display name**       | User's name text                        | ✅      |
| **Ceremonies count**   | Total completed ceremonies (e.g., "26") | ✅      |
| **Current streak**     | Days in a row (e.g., "7")               | ✅      |
| **Longest streak**     | Best streak ever (e.g., "14")           | ✅      |
| **Ranking percentile** | Top X% (e.g., "Top 5%")                 | ✅      |
| **Theme colors**       | Background, accent, text colors         | ✅      |
| **Badge type**         | Layout and visual style                 | ✅      |

---

## Theme Color Palettes

### Classic (Dark Red)

- Background: Dark crimson gradient `#2a0a0a` → `#1a0606` → `#0f0303`
- Accent: Gold `#fbbf24`
- Text: White `#ffffff`
- Secondary: White 60% `rgba(255,255,255,0.6)`

### Sunrise (Light Orange)

- Background: Warm gradient `#ffedd5` → `#fed7aa` → `#fdba74`
- Accent: Orange `#ea580c`
- Text: Dark stone `#1c1917`
- Secondary: Dark 60%

### Night (Dark Blue)

- Background: Navy gradient `#1e293b` → `#0f172a` → `#020617`
- Accent: Gold `#fbbf24`
- Text: Light slate `#f8fafc`
- Secondary: Slate 50%

### Military (Dark Olive)

- Background: Stone gradient `#292524` → `#1c1917` → `#0c0a09`
- Accent: Lime green `#a3e635`
- Text: Stone light `#fafaf9`
- Secondary: Stone 60%

---

## Badge Types (6 Implemented)

### 1. Minimalist Badge (1:1 Square)

**Size:** 1080×1080 px | **Scale factor:** 300px at 1x

![Reference](./images/minimalist-badge.png)

**Layout:**

- Circular photo placeholder at top (72px, 2px accent border)
- User name below photo (bold, 16px)
- Large ceremony count number (56px, accent color, bold)
- "ceremonies" label below (12px, secondary color)
- Stats row: 🔥 current streak | ⚡ best streak
- Footer: "FLAG CEREMONY" + 🇻🇳 flag

**Style:**

- Rounded corners (16px)
- Clean sans-serif typography
- Minimal decoration
- Focus on whitespace and hierarchy

---

### 2. Achievement Badge (1:1 Square)

**Size:** 1080×1080 px | **Scale factor:** 300px at 1x

![Reference](./images/achievement-badge.png)

**Layout:**

- Red/gold ribbon stripe at top (Vietnamese flag colors)
- Circular medal background with radial gradient glow
- Circular photo in medal center (64px, tier-colored border)
- Three stars ⭐⭐⭐ below photo
- User name
- Bordered box: tier emoji + count + "CEREMONIES"
- Stats row: 🔥 streak + ⚡ best streak
- Tier label pill: "─── GOLD PATRIOT ───"

**Tier System:**
| Count | Tier | Emoji | Color |
|-------|------|-------|-------|
| 0-9 | STARTER | ⭐ | Gold |
| 10-49 | BRONZE | 🥉 | Amber |
| 50-99 | SILVER | 🥈 | Slate |
| 100+ | GOLD | 🥇 | Golden |

---

### 3. Streak Badge (1:1 Square)

**Size:** 1080×1080 px | **Scale factor:** 300px at 1x

![Reference](./images/streak-badge.png)

**Layout:**

- Ring of 12 fire emojis 🔥 arranged in circle around border
- Circular photo in center (80px, 4px orange border)
- User name below photo
- Featured streak box (orange glow border):
  - 🔥 [NUMBER] 🔥 arrangement
  - Large streak number (44px, orange #f97316)
  - "DAYS STREAK!" label
- "Total: XX ceremonies" secondary text
- ⚡ "Best streak: X days"
- Footer: "FLAG CEREMONY" + 🇻🇳

**Style:**

- Fire/flame motif throughout
- Orange accent (#f97316) for streak elements
- Energetic, motivational feel

---

### 4. Social Badge (9:16 Vertical)

**Size:** 1080×1920 px | **Scale factor:** 200×355px at 1x

![Reference](./images/social-badge.png)

**Layout:**

- Top accent bar (half red, half gold - flag colors)
- Header: 🇻🇳 "FLAG CEREMONY" 🇻🇳
- Large circular photo (80px, accent border)
- User name (bold)
- Main stat box (accent glow): 🏆 + count + "CEREMONIES"
- Two stat boxes side by side: 🔥 current | ⚡ best
- Ranking badge if applicable: 👑 "Top X%"
- Footer divider + "flag-ceremony.app"

**Style:**

- Optimized for Instagram/TikTok stories
- Vertical format for mobile sharing
- Bold typography, easy to read

---

### 5. Patriot Card (16:10 Horizontal)

**Size:** 1600×1000 px | **Scale factor:** 340×212px at 1x

![Reference](./images/patriot-card.png)

**Layout:**

- Two-panel design (darker left, gradient right)
- **Left panel (~35%):**
  - Rectangular photo (72px, rounded corners)
  - Name below photo
  - "Member since: XXXX" (optional)
- **Right panel (~65%):**
  - 🇻🇳 "PATRIOT CERTIFICATE" header
  - Stats grid:
    - 🏆 Large ceremony count (prominent)
    - 🔥 Current streak: X Days
    - ⚡ Longest streak: X Days
    - 👑 Ranking: Top X%
  - Footer: www.flag-ceremony.app

**Style:**

- Official ID card aesthetic
- Government certificate feel (formal but modern)

---

### 6. Certificate (4:3 Horizontal)

**Size:** 1600×1200 px | **Scale factor:** 360×270px at 1x

![Reference](./images/certificate-badge.png)

**Layout:**

- Double ornate border (gold accent)
- Header: 🇻🇳 "CERTIFICATE OF DEDICATION" 🇻🇳
- Decorative gold line
- "This certifies that"
- [USER NAME] in elegant italic style
- "has demonstrated exceptional patriotism"
- Achievement box: count + "Flag Ceremonies Completed"
- Stats: 🔥 current | ⚡ longest
- Bottom row: Date | Signature line | Official seal 🏆
- Footer: "Flag Ceremony App"

**Style:**

- Formal diploma/certificate aesthetic
- Elegant serif-style elements
- Gold foil effect on borders
- Official, prestigious feel

---

## Component Files

```
src/components/share/badges/
├── types.ts           # BadgeProps interface
├── index.ts           # Exports all badges
├── MinimalistBadge.tsx
├── AchievementBadge.tsx
├── StreakBadge.tsx
├── SocialBadge.tsx
├── PatriotBadge.tsx
└── CertificateBadge.tsx
```

---

## AI Image Generation Prompts

For generating new design variations:

### Midjourney Example:

```
Modern achievement badge for mobile app, 1:1 square,
dark crimson gradient background #2a0a0a to #0f0303,
gold medal design with ribbon at top,
circular photo placeholder with gold border,
tier system badges (bronze/silver/gold),
Vietnamese flag colors accent,
clean sans-serif typography,
--ar 1:1 --v 6
```

### Design System Tokens:

```css
/* Colors */
--classic-bg: #1a0606;
--classic-accent: #fbbf24;
--sunrise-bg: #fff7ed;
--sunrise-accent: #ea580c;
--night-bg: #0f172a;
--night-accent: #fbbf24;
--military-bg: #1c1917;
--military-accent: #a3e635;

/* Typography */
--font-weight-bold: 700;
--font-weight-extra-bold: 800;
--border-radius-sm: 8px;
--border-radius-md: 16px;
--border-radius-lg: 20px;
```
