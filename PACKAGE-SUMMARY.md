# 📦 Package Summary

Below is an overview of the key dependencies used in this project and why they were chosen.

## Core Framework
* **`react` / `react-dom` (v18+)**: The UI library powering the component structure.
* **`vite`**: Next-generation frontend tooling for lightning-fast HMR (Hot Module Replacement) and building.

## 3D Ecosystem
* **`three`**: The base WebGL library.
* **`@react-three/fiber` (R3F)**: A React renderer for Three.js. Allows us to write 3D scenes using declarative components (`<mesh>`, `<pointLight>`) instead of imperative code.
* **`@react-three/drei`**: A collection of useful helpers for R3F. We use it for `OrbitControls`, `Environment` (HDRI lighting), `PerspectiveCamera`, `Sparkles`, `Float`, and `useTexture`.
* **`@react-three/postprocessing`**: Wrapper for standard post-processing effects. Used for the critical `Bloom`, `Vignette`, and `Noise` effects.

## AI & Computer Vision
* **`@tensorflow/tfjs`**: The core machine learning library for JavaScript.
* **`@tensorflow-models/handpose`**: A pre-trained model that detects 21 3D hand landmarks in real-time. Used for gesture control.

## Utilities & Styling
* **`tailwindcss`**: Utility-first CSS framework used for the UI Overlay, Loading Screen, and HTML UI elements.