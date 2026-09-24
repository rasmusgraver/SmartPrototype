;(function () {
  const pages = [
    {
      id: "home",
      navLabel: "Home",
      icon: "⌂",
      title: "Velkommen",
      description:
        "Din robotassistent er klar til å hjelpe deg med daglig drift.",
      highlights: ["Sjekk status", "Få rask hjelp", "Se oppgaver"],
    },
    {
      id: "hjelp",
      navLabel: "Hjelp",
      icon: "?",
      title: "Hjelp",
      description: "Her får du kort veiledning og rask tilgang til støtte.",
      highlights: ["Snakker med robot", "Viste tips", "Kontakt støtte"],
    },
    {
      id: "info",
      navLabel: "Info",
      icon: "i",
      title: "Info",
      description: "Appen er bygget for å samle nøkkelinformasjon på ett sted.",
      highlights: ["Personlig info", "Rask oversikt", "Nye funksjoner"],
    },
    {
      id: "minrobot",
      navLabel: "MinRobot",
      icon: "🤖",
      title: "MinRobot",
      description:
        "Se statusen til roboten din og hva den jobber med akkurat nå.",
      highlights: ["Kjører", "Planlagt", "Sjekk batteri"],
    },
    {
      id: "meg",
      navLabel: "Meg",
      icon: "👤",
      title: "Meg",
      description: "Her kan du finne din profil og innstillinger for brukeren.",
      highlights: ["Profil", "Preferanser", "Historikk"],
    },
    {
      id: "eventer",
      navLabel: "Eventer",
      icon: "🎉",
      title: "Eventer",
      description: "Se kommende aktiviteter, møter og påminnelser.",
      highlights: ["Arrangement", "Møter", "Påminnelser"],
    },
  ]

  const content = document.getElementById("app-content")
  let currentPage = 0

  function renderNav(activeIndex) {
    const nav = document.createElement("nav")
    nav.className = "top-nav"
    nav.setAttribute("aria-label", "Sidenavigasjon")

    pages.forEach((page, index) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "top-nav-btn"
      if (index === activeIndex) btn.classList.add("active")
      btn.innerHTML = `
        <span class="nav-icon">${page.icon}</span>
        <span class="nav-label">${page.navLabel}</span>
      `
      btn.addEventListener("click", () => {
        currentPage = index
        renderPage()
      })
      nav.appendChild(btn)
    })

    const existingNav = content.querySelector(".top-nav")
    if (existingNav) existingNav.remove()
    content.appendChild(nav)
  }

  function renderPage() {
    content.innerHTML = ""
    renderNav(currentPage)

    const page = pages[currentPage]
    const shell = document.createElement("section")
    shell.className = "page-shell"

    const hero = document.createElement("div")
    hero.className = "page-hero"

    if (page.id === "home") {
      const image = document.createElement("img")
      image.src = "bilder/two_robots.png"
      image.alt = "To roboter"
      image.className = "page-hero-image"
      hero.appendChild(image)
    } else {
      const badge = document.createElement("div")
      badge.className = "page-badge"
      badge.textContent = page.icon
      hero.appendChild(badge)
    }

    const title = document.createElement("h2")
    title.className = "page-title"
    title.textContent = page.title

    const desc = document.createElement("p")
    desc.className = "page-description"
    desc.textContent = page.description

    const list = document.createElement("div")
    list.className = "info-list"

    page.highlights.forEach((item) => {
      const card = document.createElement("div")
      card.className = "info-card"
      card.textContent = item
      list.appendChild(card)
    })

    shell.appendChild(hero)
    shell.appendChild(title)
    shell.appendChild(desc)
    shell.appendChild(list)
    content.appendChild(shell)
  }

  renderPage()
})()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => registration.update())
  })
}
