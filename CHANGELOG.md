# 🧿 Vault Platform Changelog

A record of major changes and feature progression for The Vault platform.

---

## [1.2.0] – 2025-05-19

### ✨ Added
- ENIC.0 hover-based chat bubble with progression-based commentary
- Glow Level Tester Pylon for visualizing all glow stages manually
- State Map + Debug Log template for stable team development

### 🔧 Fixed
- Widget overflow and layout stretching
- Removed duplicate commentary bubble from bottom of screen
- Cleaned up glow class injection with Tailwind-compatible mapping

### 🔄 Changed
- GlowLevel is now derived from userXP, no longer manually set
- Commentary system uses `glowLevel` fallback when nothing is hovered

---

## [1.1.0] – 2025-05-16

### ✨ Added
- Pylon Console UI with toggle + hover tracking
- Drag-and-drop SortablePylonWrapper system
- Timepiece evolution-based glow sync logic

### 🔧 Fixed
- Audio Test Pylon layout overlap
- Hover sync between console and widgets

---

## [1.0.0] – 2025-05-12

### 🚀 Initial Release
- Dashboard layout and Vault widget grid
- Token, XP Tracker, Reputation, Audio Control, and Announcements pylons
- Foundational glowLevel visual feedback system 