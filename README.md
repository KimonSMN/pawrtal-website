<!-- Project Title -->

# ${\color{blue}Pawrtal \space Website}$

<!-- Project Description -->

## ${\color{blue}Project \space Description}$

<!-- GETTING STARTED -->

## ${\color{blue}Getting \space Started}$

Instructions to install and run the app

### 1. Clone this repository

```sh
   git clone https://github.com/KimonSMN/pawrtal-website.git
```

### 2. Go into the repository

```sh
cd pawtral-website
```

### 3. Install dependencies

```sh
npm install
```

### 4. Run the app

```bash
npm run dev
```

### 5. Open the app

Open url terminal points too using (ctrl + click).
➜ Local: http://localhost:5173/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Project Structure -->

## ${\color{blue}Project \space Structure}$

```bash
/pawrtal-website
├── public/                         # Static files and images
├── src/                            # Source code
│   ├── assets/                     # Assets
│       ├── down_arrow.png
│       ├──     ⋮
│       ├──     ⋮
│       └── profile.png
│   ├── components/
│       ├── credentials/            # login, sign-up components
│       ├── layout/                 # footer, Navbar components
│       ├── models/                 # classes , structures
│       ├── pets/
│       ├── sections/
│       ├── vetPages/               # main home components
│       └── vetSections/            # other components in the vet directory
│   ├── pages/
│       ├── Landing.tsx             # Welcome/Home page
│       └── Vet.tsx                 # Vet Home page
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

<!-- React + Vite -->

## ${\color{blue}React \space + \space Vite}$

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
