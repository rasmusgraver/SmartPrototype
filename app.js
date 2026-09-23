;(function () {
  // --- Datamodell: spørsmålene i skjemaet ---
  const steps = [
    {
      id: "frekvens",
      type: "choice",
      multi: false,
      title: "Hvor ofte spiser du i løpet av en dag?",
      options: ["1–2 ganger", "3–4 ganger", "5 eller flere ganger"],
    },
    {
      id: "maltider",
      type: "choice",
      multi: true,
      title: "Hvilke måltider spiser du vanligvis?",
      options: ["Frokost", "Lunsj", "Middag", "Kveldsmat", "Mellommåltider"],
    },
    {
      id: "favorittmat",
      type: "text",
      title: "Hva er favorittmaten din?",
      placeholder: "Skriv svaret ditt her...",
    },
  ]

  // --- State ---
  let currentStep = 0
  const answers = {} // holdes kun i minnet, ikke lagret noe sted

  const content = document.getElementById("app-content")

  function renderStep() {
    if (currentStep >= steps.length) {
      renderDone()
      return
    }

    const step = steps[currentStep]
    content.innerHTML = ""

    // Fremdriftsprikker
    const dots = document.createElement("div")
    dots.className = "progress-dots"
    steps.forEach((s, i) => {
      const d = document.createElement("div")
      d.className =
        "dot" + (i === currentStep ? " active" : i < currentStep ? " done" : "")
      dots.appendChild(d)
    })
    content.appendChild(dots)

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

    // Navigasjon
    const navRow = document.createElement("div")
    navRow.className = "nav-row"

    const backBtn = document.createElement("button")
    backBtn.className = "nav-btn nav-back"
    backBtn.textContent = "Tilbake"
    backBtn.disabled = currentStep === 0
    backBtn.addEventListener("click", () => {
      currentStep--
      renderStep()
    })

    const nextBtn = document.createElement("button")
    nextBtn.className = "nav-btn nav-next"
    nextBtn.id = "next-btn"
    nextBtn.textContent = currentStep === steps.length - 1 ? "Fullfør" : "Neste"
    nextBtn.addEventListener("click", () => {
      currentStep++
      renderStep()
    })

    navRow.appendChild(backBtn)
    navRow.appendChild(nextBtn)
    content.appendChild(navRow)

    updateNextButtonState()
  }

  function updateNextButtonState() {
    const step = steps[currentStep]
    const nextBtn = document.getElementById("next-btn")
    if (!nextBtn) return

    let answered = false
    if (step.type === "choice") {
      const a = answers[step.id]
      answered = step.multi ? a && a.length > 0 : !!a
    } else if (step.type === "text") {
      answered = !!(answers[step.id] && answers[step.id].trim().length > 0)
    }
    nextBtn.disabled = !answered
  }

  function renderDone() {
    content.innerHTML = ""

    const wrap = document.createElement("div")
    wrap.className = "done-screen"

    wrap.innerHTML = `
  <div class="done-icon">✓</div>
  <div class="done-title">Takk for svarene!</div>
  <div class="summary-box">
    <div><b>Hvor ofte:</b> ${answers.frekvens || "-"}</div>
    <div><b>Måltider:</b> ${(answers.maltider || []).join(", ") || "-"}</div>
    <div><b>Favorittmat:</b> ${answers.favorittmat || "-"}</div>
  </div>
`

    const backBtn = document.createElement("button")
    backBtn.className = "nav-btn nav-back"
    backBtn.textContent = "Tilbake til start"
    backBtn.style.marginTop = "14px"
    backBtn.style.width = "100%"
    backBtn.addEventListener("click", () => {
      currentStep = 0
      renderStep()
    })
    wrap.appendChild(backBtn)

    content.appendChild(wrap)
  }

  renderStep()
})()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
  })
}
