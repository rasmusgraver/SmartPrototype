;(function () {
  // --- Datamodell: spørsmålene i skjemaet ---
  const steps = [
    {
      id: "frekvens",
      navLabel: "Frekvens",
      type: "choice",
      multi: false,
      title: "Hvor ofte spiser du i løpet av en dag?",
      options: ["1–2 ganger", "3–4 ganger", "5 eller flere ganger"],
    },
    {
      id: "maltider",
      navLabel: "Måltider",
      type: "choice",
      multi: true,
      title: "Hvilke måltider spiser du vanligvis?",
      options: ["Frokost", "Lunsj", "Middag", "Kveldsmat", "Mellommåltider"],
    },
    {
      id: "favorittmat",
      navLabel: "Favoritt",
      type: "text",
      title: "Hva er favorittmaten din?",
      placeholder: "Skriv svaret ditt her...",
    },
  ]

  // --- State ---
  let currentStep = -1
  const answers = {} // holdes kun i minnet, ikke lagret noe sted

  const content = document.getElementById("app-content")

  function renderLanding() {
    content.innerHTML = ""
    renderTopNav(0, ["Home", ...steps.map((step) => step.navLabel)])

    const landing = document.createElement("div")
    landing.className = "landing-screen"

    const image = document.createElement("img")
    image.className = "landing-image"
    image.src = "bilder/two_robots.png"
    image.alt = "To roboter"
    image.title = "Trykk for å starte"
    image.addEventListener("click", () => {
      currentStep = 0
      renderStep()
    })

    landing.appendChild(image)
    content.appendChild(landing)
  }

  function renderTopNav(
    activeIndex,
    labels = ["Home", ...steps.map((step) => step.navLabel)],
  ) {
    const nav = document.createElement("nav")
    nav.className = "top-nav"
    nav.setAttribute("aria-label", "Sidenavigasjon")

    labels.forEach((label, index) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "top-nav-btn"
      if (index === activeIndex) btn.classList.add("active")
      btn.textContent = label
      btn.addEventListener("click", () => {
        if (index === 0) {
          currentStep = -1
          renderLanding()
          return
        }

        if (index <= steps.length) {
          currentStep = index - 1
          renderStep()
          return
        }

        currentStep = steps.length
        renderDone()
      })
      nav.appendChild(btn)
    })

    const existingNav = content.querySelector(".top-nav")
    if (existingNav) existingNav.remove()
    content.insertBefore(nav, content.firstChild)
  }

  function renderStep() {
    if (currentStep === -1) {
      renderLanding()
      return
    }

    if (currentStep >= steps.length) {
      renderDone()
      return
    }

    const step = steps[currentStep]
    content.innerHTML = ""
    renderTopNav(currentStep + 1, [
      "Home",
      ...steps.map((step) => step.navLabel),
    ])

    // Spørsmålstittel
    const title = document.createElement("p")
    title.className = "question-title"
    title.textContent = step.title
    content.appendChild(title)

    if (step.type === "choice") {
      const wrap = document.createElement("div")
      wrap.className = "choices"

      if (step.multi) {
        const hint = document.createElement("div")
        hint.className = "hint"
        hint.textContent = "Du kan velge flere"
        content.appendChild(hint)
      }

      const selected = answers[step.id] || (step.multi ? [] : null)

      step.options.forEach((opt) => {
        const btn = document.createElement("button")
        btn.className = "choice-btn"
        btn.textContent = opt

        const isSelected = step.multi
          ? selected.includes(opt)
          : selected === opt
        if (isSelected) btn.classList.add("selected")

        btn.addEventListener("click", () => {
          if (step.multi) {
            const current = answers[step.id] || []
            const idx = current.indexOf(opt)
            if (idx > -1) current.splice(idx, 1)
            else current.push(opt)
            answers[step.id] = current
          } else {
            answers[step.id] = opt
          }
          renderStep()
        })

        wrap.appendChild(btn)
      })

      content.appendChild(wrap)
    }

    if (step.type === "text") {
      const textarea = document.createElement("textarea")
      textarea.className = "text-input"
      textarea.placeholder = step.placeholder || ""
      textarea.value = answers[step.id] || ""
      textarea.addEventListener("input", (e) => {
        answers[step.id] = e.target.value
        updateNextButtonState()
      })
      content.appendChild(textarea)
    }

    content.appendChild(
      Object.assign(document.createElement("div"), {
        className: "spacer",
      }),
    )
  }

  function renderDone() {
    content.innerHTML = ""
    renderTopNav(steps.length + 1, [
      "Home",
      ...steps.map((step) => step.navLabel),
      "Oppsummering",
    ])

    const wrap = document.createElement("div")
    wrap.className = "done-screen"

    const icon = document.createElement("div")
    icon.className = "done-icon"
    icon.textContent = "✓"
    wrap.appendChild(icon)

    const title = document.createElement("div")
    title.className = "done-title"
    title.textContent = "Takk for svarene!"
    wrap.appendChild(title)

    const summary = document.createElement("div")
    summary.className = "summary-box"

    const addSummaryRow = (label, value) => {
      const row = document.createElement("div")
      const labelElement = document.createElement("b")
      labelElement.textContent = `${label}: `
      row.appendChild(labelElement)
      row.appendChild(document.createTextNode(value || "-"))
      summary.appendChild(row)
    }

    addSummaryRow("Hvor ofte", answers.frekvens)
    addSummaryRow("Måltider", (answers.maltider || []).join(", "))
    addSummaryRow("Favorittmat", answers.favorittmat)
    wrap.appendChild(summary)

    const backBtn = document.createElement("button")
    backBtn.className = "nav-btn nav-back done-back"
    backBtn.textContent = "Tilbake til start"
    backBtn.addEventListener("click", () => {
      currentStep = -1
      renderLanding()
    })
    wrap.appendChild(backBtn)

    content.appendChild(wrap)
  }

  renderLanding()
})()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => registration.update())
  })
}
