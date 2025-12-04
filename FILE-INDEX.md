# 📂 File Structure Index

## `src/` Root

* **`main.jsx`**: The application entry point. Mounts React to the DOM.
* **`App.jsx`**: The main controller. Handles global state (`CHAOS`/`FORMED`), device detection (`isMobile`), and manages the main 3D Canvas and UI Overlay.
* **`index.css`**: Global styles and Tailwind imports.

## `src/components/`

* **`ChristmasScene.jsx`**: The container for the 3D world. Sets up Lighting, Environment, Post-processing, and holds all 3D objects. Uses `React.memo` for performance.
* **`FoliageSystem.jsx`**: Renders the 6k-25k particles. Handles the shader logic for the "Gold Dust" effect and the spiral transformation animation.
* **`Ornaments.jsx`**: Renders InstancedMeshes for Gift Boxes (Ribbon+Body), Gold Balls, and Diamonds. Handles their physics-like floating animations.
* **`PolaroidPhotos.jsx`**: Manages the 12 flying photos. Implements the "Split to Front" logic for Chaos mode and tree attachment for Formed mode.
* **`TreeTrunk.jsx`**: A simple cylinder mesh representing the tree base.
* **`GoldenStar.jsx`**: The 3D extruded shape at the top of the tree.
* **`CameraController.jsx`**: An invisible component that moves the camera based on mouse/hand position.
* **`HandGestureDetector.jsx`**: Encapsulates TensorFlow logic. Handles webcam stream, hand detection, and maps coordinates to UI events.
* **`UIOverlay.jsx`**: The HTML/CSS layer on top of the canvas. Shows instructions, title, and buttons.
* **`LoadingScreen.jsx`**: The initial black screen with the shimmer effect.

## `src/utils/`

* **`deviceDetection.js`**: Logic to detect Mobile vs. Desktop (including iPad OS 13+ detection).