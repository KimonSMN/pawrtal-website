<!-- Project Title -->

# ${\color{blue}Pawrtal \space Website}$

<!-- To do list -->

## ${\color{blue}TO-DO \space List}$

### ${\color{blue}Pet \space Report}$

- [ ] home page -> selected found pet page
- [ ] found pet report
- [ ] login / sign up as a user

### ${\color{blue}Vet's \space POV}$

- [ ] Profile change info
- [ ] Delete models
- [ ] render reviews about vet
- [ ] Records
- [ ] Upcoming visits in calendar view
- [ ] confirm Password live update to inform user
- [ ] alert messages when {new record submitted , new user signup , users data changed }

### ${\color{blue}User's \space POV}$

- [ ] User home page
- [ ] Health report for pet page
- [ ] organize a vet date (all 6 stages)
- [ ] 1.add filters
- [ ] 2.choose available vet
- [ ] 3.vet profile page
- [ ] 4.information about the visit/confirm
- [ ] 5.visit info after confirm~[pending by vet/options to cancel]
- [ ] 6.approved visit by vet {options to cancel}
- [ ] pet lost/pet found page
- [ ] 1.lost pet form
- [ ] 2.found pet form
- [ ] 3.form preview

<!-- Project Description -->

## ${\color{blue}Project \space Description}$

Στο db.json λειτουργει σαν ψευτικο backend στην ουσια ειναι μια βαση που αποθηκευει αντικειμενα σε λιστες οποτε να θες εσυ να ανεβασεις κατι στην λιστα users (πχ προσθηκη καινουργιου χρηστη) θα κανεις post request στην διευθυνση "http://localhost:3001/users"
οπως γινεται στο signup μεσα στον φακελο credentials
Με την ιδια λογικη στο login τραβας απο την λιστα τους χρηστε με το ταδε email και password

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

### 4. Run the server

```bash
npm run server
```

### 4. Run the app on a different terminal

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
│   ├── auth/                       # Authentication
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

<!-- Project Structure -->

## ${\color{blue}Backend \space Development}$

Using **JSON Server** as a backend. It works as a full rest API using just a db named `db.json`.

The application communicates with the JSON Server via HTTP requests (fetch),
just as it would in a real backend environment

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
