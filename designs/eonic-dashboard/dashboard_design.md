# Eonic Vault Dashboard Design

## Layout Structure

The new Eonic Vault dashboard will follow the layout structure specified in the user's mockup while maintaining the visual style of the pink/purple reference dashboard.

### Overall Layout

```
+------------------------------------------+
|  L |                                   |U|
|  O |  +-------------+  +-------------+ |S|
|  G |  |             |  |             | |E|
|  O |  |   PROFILE   |  |  CHATROOM   | |R|
|    |  |             |  |             | | |
|  & |  +-------------+  +-------------+ | |
|    |                                   | |
|  N |  +---------------------------+    | |
|  A |  |                           |    | |
|  V |  |     EONIC HOLDINGS        |    | |
|    |  |                           |    | |
|    |  +---------------------------+    | |
|    |                                   | |
|    |  +---------------------------+    | |
|    |  |                           |    | |
|    |  |    LIVE EONIC CHART       |    | |
|    |  |                           |    | |
|    |  +---------------------------+    | |
+------------------------------------------+
```

### Component Breakdown

1. **Left Sidebar**
   - Logo at top (Eonic hexagon logo)
   - Navigation icons (Home, Stats, Documents, Settings)
   - Minimalist design with icons only
   - Dark purple background with subtle gradient

2. **Top Navigation Bar**
   - Home/page title
   - Search bar
   - Notification bell
   - User profile picture
   - Dark purple background with glass effect

3. **Main Content Area**
   - Top row: Two equal-width widgets
     - Left: User Profile section
     - Right: Chatroom widget
   - Middle row: Eonic Holdings information
   - Bottom row: Live Eonic Chart
   - All widgets have consistent styling with rounded corners and glass effect

## Widget Designs

### User Profile Widget
```
+----------------------------------+
|  +-------+                       |
|  |       |  USERNAME             |
|  | PFP   |                       |
|  |       |  Title                |
|  +-------+                       |
|           level and xp           |
+----------------------------------+
```

- Profile picture (circular or rounded square)
- Username in large, bold font
- Title in medium font
- Level and XP information in smaller font
- Glass-like background with purple gradient

### Chatroom Widget
```
+----------------------------------+
|                                  |
|  Widget of chatroom of choice -  |
|  in a small interactive chat     |
|  window                          |
|                                  |
+----------------------------------+
```

- Small chat interface with messages
- Input field at bottom
- Glass-like background with purple gradient
- Scrollable message area

### EONIC Holdings Widget
```
+----------------------------------+
|                                  |
|  Your EONIC holdings             |
|  Your STAKED eonic               |
|  How users CAN stake             |
|                                  |
+----------------------------------+
```

- Three sections of information
- Bold headings with values underneath
- Possibly include small charts or indicators
- Glass-like background with purple gradient

### Live EONIC Chart Widget
```
+----------------------------------+
|                                  |
|  Live EONIC Chart widget         |
|                                  |
|  [Interactive chart area]        |
|                                  |
+----------------------------------+
```

- Large interactive chart
- Time period selectors (1D, 1W, 1M)
- Price information
- Percentage changes
- Glass-like background with purple gradient

## Visual Style Elements

### Color Palette
- Primary background: Dark purple/navy (#1E1A2B)
- Accent colors: Pink/purple gradients (#9C4FD6 to #E056FD)
- Widget backgrounds: Semi-transparent dark (#2A2438 with opacity)
- Text: White (#FFFFFF) and light gray (#E0E0E0)
- Chart colors: Cyan (#00E8FC), Purple (#9C4FD6), Pink (#E056FD)
- Positive indicators: Green (#00C897)
- Negative indicators: Red (#FF5757)

### Design Elements
- Glassmorphism effect on all widgets
- Subtle background patterns or 3D elements
- Rounded corners (border-radius: 16px for widgets, 8px for buttons)
- Neon glow effects on important elements
- Shadow effects for depth perception
- Responsive layout that adapts to different screen sizes
- Consistent typography throughout

### Interactive Elements
- Hover effects on buttons and clickable items
- Smooth transitions between states
- Animated charts and data visualizations
- Tooltips for additional information
