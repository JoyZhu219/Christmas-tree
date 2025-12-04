# ⚡ Quick Start Guide

Follow these steps to run the Grand Luxury Christmas Tree locally.

## Prerequisites

* **Node.js** (Version 16+ recommended)
* **npm** or **yarn**

## Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/luxury-christmas-tree.git](https://github.com/your-username/luxury-christmas-tree.git)
    cd luxury-christmas-tree
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or the port shown in your terminal).

## Troubleshooting

* **Camera not working?** Ensure your browser has permission to access the webcam. On mobile, you must use HTTPS (use Vercel deployment for testing mobile).
* **Black screen?** Check the console. If you see buffer attribute errors, refresh the page (the app auto-detects device capabilities on load).