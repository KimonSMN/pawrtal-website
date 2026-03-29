<a id="readme-top"></a>

<p align="center">
  <img src="./src/assets/pawrtal_logo.png" width="150">
</p>

# ${\color{purple}Pawrtal \space Website}$

**Course:** Human-Computer Interaction

**Department:** Informatics & Telecommunications

**Semester:** Fall 2025

## ${\color{purple}Team \space Members}$

- [**Σμυρλιάνος Κίμωνας**](https://github.com/KimonSMN)
- [**Αναστόπουλος Αθανάσιος**](https://github.com/ThanosAnastopoulos)
- [**Κρικέλλη Ναταλία**](https://github.com/nataliakrik)

---

<!-- TABLE OF CONTENTS -->

## ${\color{purple}Table \space of \space Contents}$

<details>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#development-tools">Development Tools</a></li>
    <li><a href="#demo">Demo </a></li>
    <li><a href="#dummy-accounts">Dummy Accounts</a></li>
  </ul>
</details>

<!-- ABOUT THE PROJECT -->

<a id="about-the-project"></a>

## ${\color{purple}About \space The \space Project}$

### ${\color{violet}Description}$

The pawrtal website is a place for pets, vets and pet owners.

### ${\color{violet}Projects \space Goals}$

**_If you are a pet owner_**

- Log your pets
- Find a vet for your pet
- If your pet is lost, make an anoouncement for others to know.
- Keep track of your pets vaccines, appointments and have your pets health book at any moment

**_If you are a vet_**

- Create a profile for others to find you
- Keep track of your appointments
- Log pets into the system
- Easy access to any useful information about the pet

**_If you are none of the above_**

- You can adopt a pet
- If you found a lost pet, you can report it to help the pet return to their owner

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- demo -->

<a id="demo"></a>

## ${\color{purple}Demo}$

![](./public/eam-ergasia.gif)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- installation -->

<a id="installation"></a>

## ${\color{purple}Installation}$

Instructions on compiling and running the code

### 1. Clone this repository

```sh
  git clone https://github.com/KimonSMN/pawrtal-website.git
```

### 2. Go into the repository

```sh
  cd pawrtal-website
```

### 3. Install dependencies

```sh
  npm install
```

### 4. Start mock server

```sh
  npm run server
```

### 5. Start frontend

```sh
  npm run dev
```

### 6. Open the app

Open [http://localhost:5173](http://localhost:5173) on your browser

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Project Structure -->

<a id="project-structure"></a>

## ${\color{purple}Project \space Structure}$

```sh
pawrtal-website/
  ├── public/                     # Static files and images
  ├── src/
  │   ├── assets/
  │   ├── auth/
  │   ├── components/
  │       ├── auth/               # authentication files
  │       ├── clientPages/        # components related to the client
  │       ├── credentials/        # login, sign-up pages
  │       ├── layout/             # footer, navbar components
  │       ├── models/             # classes
  │       ├── pets/               # landing-page components
  │       ├── sections/           # lost pets component
  │       ├── vetPages/           # vet's home page components
  │       └── vetSections/        # vet sections
  │   ├── lib/                    # API
  │   ├── pages/
  │       ├── AuthPage.tsx        # authentication page
  │       ├── ClientHome.tsx      # User's home page
  │       ├── FoundPetReport.tsx  # Found pet page
  │       ├── Landing.tsx         # Start page
  │       ├── MyPetsPage.tsx
  │       ├── Notifications.tsx
  │       ├── OpenPet.tsx
  │       ├── Profile.tsx
  │       └── VetHome.tsx
  │   ├── App.jsx             # Page routes
  │   ├── App.css             # Global css
  │   ├── index.css
  │   └── main.jsx
  ├── .gitignore              # ignore files
  ├── .prettierrc
  ├── db.json
  ├── package-lock.json
  ├── package.json            # Dependencies tree
  ├── README.md               # This file
  └── vite.config.js
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- development-tools -->

<a id="development-tools"></a>

## ${\color{purple}Development \space Tools}$

- React + Vite
- Tailwind CSS
- Local mock API implemented with json-server (db.json)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- dummy-accounts -->

<a id="dummy-accounts"></a>

## ${\color{purple}Dummy \space Accounts}$

Use these admin accounts to login and browse the website.

- **User/Owner**

$\color{violet}Email \space $: `admin`

$\color{violet}Password \space $: `admin`

- **Vet**

$\color{violet}Email \space $: `kostas@gmail.com`

$\color{violet}Password \space $: `1234`

<p align="right">(<a href="#readme-top">back to top</a>)</p>
