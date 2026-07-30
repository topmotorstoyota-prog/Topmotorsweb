# Walkthrough - New Wheel Visualizer Floating Button

Added a second floating action button to the UI to provide quick access to the wheel visualizer tool.

## Changes

### 1. New Floating Action
- **Placement**: Positioned exactly above the Leasing Calculator button for a clean vertical stack.
- **Visuals**: Uses a dark theme (`bg-zinc-900`) to complement the red calculator button.
- **Icon**: Features a `Disc` icon with a slow continuous rotation animation (`animate-spin-slow`) to represent a moving wheel.

### 2. Interactive Effects
- **Hover Expansion**: The button expands horizontally on hover, revealing the text "Машинд обуд, дугуй тавих".
- **External Redirect**: Clicking the button opens `https://topmotors.kt.mn/try` in a new browser tab.

### 3. Implementation Details
- **CSS**: Added `@keyframes spin-slow` to `FloatingCalculator.css` for the smooth rotation.
- **JSX**: Integrated the new button into `FloatingCalculator.jsx` using `framer-motion` for consistency with existing animations.

## Verification

- [x] Verified that the button is only visible on desktop (following the "hidden lg:block" pattern).
- [x] Confirmed the expansion animation and hover text are correct.
- [x] Confirmed the wheel icon spins smoothly.
- [x] Verified the redirect URL and target.
