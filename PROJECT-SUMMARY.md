# 🏗 Project Summary & Architecture

## 1. Core Concept: The Dual-Coordinate System
Every object in the scene (Foliage particles, Ornaments, Polaroids) possesses two sets of coordinates:
* **`ChaosPosition`**: Randomly distributed coordinates in a spherical "galaxy" or exploded view.
* **`TargetPosition`**: Mathematically calculated coordinates that form the shape of a cone (Christmas Tree).

We use `THREE.MathUtils.lerp` in the animation loop (`useFrame`) to interpolate between these two states based on a `progress` value (0 to 1).

## 2. Visual Identity: "Grand Luxury"
* **Color Palette**: Deep Forest Green (`#002400` to `#38b000`), Solid Gold (`#FFD700`), and Deep Red (`#8B0000`).
* **Materials**: High `metalness` (0.8-1.0) and low `roughness` for mirror-like reflections.
* **Post-Processing**: Aggressive Bloom (Threshold 0.7, Intensity 1.8) to make gold elements glow, combined with Film Noise for cinematic texture.

## 3. Performance Strategy (The "Smart Hybrid" Model)
To ensure the app runs on iPhones as well as RTX 4090 desktops, we implement strict tiering via `isMobile` detection:

| Feature | Desktop (Ultra) | Mobile (Lite) |
| :--- | :--- | :--- |
| **Particle Count** | 25,000 | 6,000 (scaled up x1.5) |
| **Shadows** | Real-time Cast/Receive | Disabled |
| **Bloom** | Mipmap Blur (High Quality) | Standard Blur |
| **Materials** | Physical Transmission (Glass) | Standard Transparent |
| **AI Detection** | 100ms interval | 300ms interval + Low Res |

## 4. React Optimization
* **`React.memo`**: heavily used in `ChristmasScene.jsx` to isolate heavy 3D components from the high-frequency state updates caused by the Hand Gesture Detector.
* **Absolute Time Animation**: Rotations use `state.clock.elapsedTime` instead of delta accumulation to prevent physics explosions during frame drops.