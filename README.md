# Steady — Calm Control for Chaotic Days 🌊

> **Steady** is a production-ready, mobile-first daily focus priority web app designed for anyone with unpredictable, high-pressure schedules (students, medical professionals, executives, freelancers, working parents).

---

## 🎯 Core Mission & Features

Steady eliminates decision fatigue by isolating the **ONE "Top Priority Now"** action item based on energy levels, available time windows, and shift contexts, rather than relying on rigid hour-by-hour calendar blocks.

- 🌿 **Tactile Neumorphic Design**: Built on a strict 60-30-10 Soft UI color architecture with dual extruded/inset shadows.
- 🚀 **Dynamic Priority Engine**: Automatically ranks pending tasks based on urgency, duration, and user energy matching.
- 💾 **Client-First Persistence**: IndexedDB + LocalStorage sync ensuring 100% offline data privacy on the user's device.
- 📦 **JSON Backup Export & Import**: 1-tap download and restoration of complete user backups.
- ⚡ **Thinking Orbs**: Embedded canvas animations (`working`, `searching`, `solving`, `weaving`, `composing`) on key action buttons and analytics cards.

---

## 📱 10 Screen Modules

1. **Onboarding Welcome**: Brand mark, tagline, features preview, product tour modal.
2. **Role & Area Setup**: Custom name input, role selection, custom domain/area write-in form.
3. **Planning Preferences**: Segmented controls for predictability, focus goals, and suggestion style.
4. **Home / Today / Now**: Hero Priority Card ("Top Priority Now"), *"Why this now?"* rationale drawer, **Add Task Modal**, secondary options stack, momentum meter, and clean empty state.
5. **Task Breakdown**: Micro-step checklist, custom step insertion, and 1-tap **Auto-Split Modal** (decomposing complex tasks into 5-minute steps).
6. **Focus Mode**: Minimal full-screen UI, 240px circular progress countdown timer, pause/resume, and **Interruption Logger Quick Sheet** (*Urgent work*, *Not enough clarity*, *Lost focus*).
7. **Projects Hub**: Domain filter chips, milestone progress lines, **New Project Modal**, project deletion, linked task creation, and empty state.
8. **Resources Hub**: Real-time search, type filters (*Verified*, *Guide*, *Notes*, *Summary*, *Article*, *Book*, *Video*), **Tailored Add Resource Modals**, bookmark toggle, task attachment modal, and empty state.
9. **Daily Review**: 3 reflective prompt cards, 1-5 stress level slider, auto-save state, and insight unlock trigger.
10. **Weekly Insights**: Dynamic analytics computed live from recorded focus sessions, distraction logs, and task completion metrics. `thinking-orbs` animated state cards, time distribution chart, and 1-tap recommendation buttons.

---

## 🎨 Design Tokens (60-30-10 Palette)

- **60% Base Neutrals**: `#EAEFF5` (Light) / `#1E2126` (Dark)
- **30% Secondary Tones**: `#2D343C` (Light) / `#DCE2E9` (Dark)
- **10% Accent Teal**: `#3A6B7C` (Light) / `#6FA3B3` (Dark) — reserved for trust & action CTAs
- **Typography**: Zodiak (Display serif) + General Sans (Body & controls, 16px min)

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js 18+
- npm 9+

### Quick Start
```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Type-check & build for production
npm run build
```

---

## 📤 Pushing to Your Remote Repository (GitHub / GitLab)

To push this repository to GitHub or GitLab:

```bash
# 1. Rename default branch to main (optional)
git branch -M main

# 2. Add your remote GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/steady-app.git

# 3. Push initial release to remote
git push -u origin main
```
