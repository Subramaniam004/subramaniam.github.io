# Subramaniam B — Cybersecurity Portfolio

A modern, interactive cybersecurity portfolio website built with vanilla HTML, CSS, and JavaScript. Features a terminal-style hero section, Matrix rain animation, dark/light theme toggle, and an interactive command panel.

## 🔗 Live Demo

[https://subramaniam004.github.io](https://subramaniam004.github.io)

## ✨ Features

- **Terminal Hero Section** — Interactive terminal with custom commands (`whoami`, `about`, `skills`, `projects`, `education`, `contact`, `resume`, `neofetch`, `help`, `clear`)
- **Matrix Rain Animation** — Canvas-based Matrix-style digital rain background
- **Network Visualization** — Animated network graph on the hero section
- **Dark/Light Theme** — Toggle between dark and light mode with persistent preference
- **Responsive Design** — Fully responsive layout for all screen sizes
- **Interactive UI** — Smooth scroll navigation, scroll-triggered animations, back-to-top button
- **Contact Form** — EmailJS-powered contact form with validation and spam protection
- **Interactive Map** — Leaflet.js map showing location (Belagavi, Karnataka, India)
- **Certifications Section** — Dynamic certification cards loaded from local PDF files
- **Skills Showcase** — Categorized skill badges (Programming, Cybersecurity, Tools & Platforms)
- **Education Timeline** — Chronological education history with scores
- **Smooth Animations** — CSS transitions, scroll-based reveals, and particle effects

## 🛠️ Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Flexbox, Grid, animations, responsive design
- **JavaScript (Vanilla)** — DOM manipulation, canvas API, event handling
- **Leaflet.js** — Interactive map integration
- **EmailJS** — Client-side email sending for contact form
- **Google Fonts** — Inter & JetBrains Mono fonts

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # All styles (light/dark themes, responsive)
├── js/
│   └── script.js           # All JavaScript functionality
├── certificates/           # PDF certificates and images
├── Subramaniam_Bhavimane_Resume_New.pdf  # Resume PDF
├── README.md               # This file
└── LICENSE                 # MIT License
```

## 🚀 Getting Started

This is a static website — no build tools or dependencies required.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Subramaniam004/subramaniam.github.io.git
   cd subramaniam.github.io
   ```

2. Open `index.html` in your browser:
   ```bash
   # On Windows
   start index.html
   
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   ```

Or serve it locally with any HTTP server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

### Deployment

The site is deployed via **GitHub Pages** from the `main` branch. Simply push changes to deploy:

```bash
git push origin main
```

## 🎮 Terminal Commands

The interactive terminal in the hero section supports these commands:

| Command      | Description                          |
|--------------|--------------------------------------|
| `whoami`     | Display name and role                |
| `about`      | Show about section summary           |
| `skills`     | List technical skills                |
| `projects`   | Show featured projects               |
| `education`  | Display education timeline           |
| `contact`    | Show contact information             |
| `resume`     | Open/download resume PDF             |
| `neofetch`   | Display system-style info            |
| `help`       | List all available commands          |
| `clear`      | Clear terminal output                |

## 🎨 Customization

1. **Personal Info** — Update name, bio, and links in `index.html`
2. **Skills** — Add/remove skill badges in the skills section of `index.html`
3. **Projects** — Replace placeholder project cards with real projects in `index.html`
4. **Certifications** — Add PDF certificates to the `certificates/` folder (loaded dynamically by `js/script.js`)
5. **Theme Colors** — Modify CSS custom properties in `styles.css` (`:root` for light, `[data-theme="dark"]` for dark)
6. **Terminal Commands** — Edit the `commands` object in `js/script.js`

## 📄 License

MIT License — feel free to use this as a template for your own portfolio.

## 📬 Contact

- **GitHub**: [@Subramaniam004](https://github.com/Subramaniam004)
- **LinkedIn**: [subramaniam-bhavimane004](https://www.linkedin.com/in/subramaniam-bhavimane004/)
- **Email**: subramaniambhavimane01@gmail.com
- **TryHackMe**: [@subramaniam004](https://tryhackme.com/p/subramaniam004)