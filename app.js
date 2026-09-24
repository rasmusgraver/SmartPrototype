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
      description: "Velg hva du ønsker at roboten skal hjelpe deg med.",
      helpOptions: [
        "Veilede blinde",
        "Vekke deg på morgenen",
        "Huske medisiner",
        "Finne ting",
      ],
    },
    {
      id: "info",
      navLabel: "Info",
      icon: "i",
      title: "Info",
      description:
        "Her kan du lese litt om robotene:\nRobotene må lade en gang i uken i cirka en time.",
      additionalText: [
        "De burde ikke brukes for barn under 10 år uten voksne til stede.",
        "Eventene dine tilpasses etter interesser og alder.",
        "Hvis det er noe galt eller du lurer på noe, ring her:",
      ],
    },
    {
      id: "minrobot",
      navLabel: "MinRobot",
      icon: "🤖",
      title: "MinRobot",
      description: "Her kan du bestemme litt om robotene dine.",
      robotFields: ["Navn:", "Farge:"],
    },
    {
      id: "meg",
      navLabel: "Meg",
      icon: "👤",
      title: "Om meg",
      description: "Her kan du finne din profil og innstillinger for brukeren.",
      textOptions: [
        "Interesser:",
        "Alder:",
        "Adresse:",
        "Kontaktperson:",
        "Navn:",
        "Sykdommer:",
        "Mer å fortelle:",
      ],
    },
    {
      id: "eventer",
      navLabel: "Eventer",
      icon: "🎉",
      title: "Eventer",
      description: "Her kan du se hvilke eventer du kan være med på.",
      highlights: [
        "Tivoli: fre.13.11 kl.8–18",
        "Pensjonist treff: Man.12.11 kl.2",
        "Loppemarked: lør.10.11 kl.10–15",
      ],
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
    content.scrollTop = 0
    content.innerHTML = ""
    renderNav(currentPage)

    const page = pages[currentPage]
    const shell = document.createElement("section")
    shell.className = "page-shell"

    const hero = document.createElement("div")
    hero.className = "page-hero"

    if (page.id === "home") {
      const homeGallery = document.createElement("div")
      homeGallery.className = "home-gallery"

      const robotImg = document.createElement("img")
      robotImg.src = "bilder/robot.jpeg"
      robotImg.alt = "Robot"
      robotImg.className = "home-hero-image"

      const droneImg = document.createElement("img")
      droneImg.src = "bilder/drone.jpeg"
      droneImg.alt = "Drone"
      droneImg.className = "home-hero-image"

      homeGallery.appendChild(robotImg)
      homeGallery.appendChild(droneImg)
      hero.appendChild(homeGallery)

      const promoVideo = document.createElement("video")
      promoVideo.className = "home-promo-video"
      promoVideo.src = "bilder/smartPromo.mov"
      promoVideo.controls = true
      promoVideo.playsInline = true
      promoVideo.preload = "metadata"
      promoVideo.setAttribute("aria-label", "SmartPromo video")
      hero.appendChild(promoVideo)
    }

    const title = document.createElement("h2")
    title.className = "page-title"
    title.textContent = page.title

    const desc = document.createElement("p")
    desc.className = "page-description"
    if (page.id === "info") desc.classList.add("info-description")
    desc.textContent = page.description

    let actionContent = null

    if (page.id === "hjelp") {
      const helpContent = document.createElement("div")
      helpContent.className = "help-content"

      const checklist = document.createElement("div")
      checklist.className = "help-checklist"
      checklist.setAttribute("aria-label", "Oppgaver roboten kan utføre")

      let optionIndex = 0

      const addOption = (option) => {
        const label = document.createElement("label")
        label.className = "help-option"

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.name = "robot-help"
        checkbox.value = option
        checkbox.id = `robot-help-${optionIndex}`

        const text = document.createElement("span")
        text.textContent = option

        label.appendChild(checkbox)
        label.appendChild(text)
        checklist.appendChild(label)
        optionIndex += 1
      }

      page.helpOptions.forEach(addOption)

      const addMoreButton = document.createElement("button")
      addMoreButton.type = "button"
      addMoreButton.className = "help-add-more"
      addMoreButton.textContent = "legg til mer"

      const addForm = document.createElement("form")
      addForm.className = "help-add-form"
      addForm.hidden = true

      const addInput = document.createElement("input")
      addInput.type = "text"
      addInput.className = "help-add-input"
      addInput.placeholder = "Skriv inn et nytt valg"
      addInput.setAttribute("aria-label", "Nytt valg")
      addInput.required = true

      const submitButton = document.createElement("button")
      submitButton.type = "submit"
      submitButton.className = "help-submit"
      submitButton.textContent = "legg til"

      addMoreButton.addEventListener("click", () => {
        addForm.hidden = !addForm.hidden
        if (!addForm.hidden) addInput.focus()
      })

      addForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const option = addInput.value.trim()
        if (!option) return
        addOption(option)
        addInput.value = ""
        addForm.hidden = true
      })

      addForm.appendChild(addInput)
      addForm.appendChild(submitButton)
      helpContent.appendChild(checklist)
      helpContent.appendChild(addMoreButton)
      helpContent.appendChild(addForm)

      actionContent = helpContent
    } else if (page.id === "minrobot") {
      const robotContent = document.createElement("div")
      robotContent.className = "robot-content"

      const robotHeading = document.createElement("h3")
      robotHeading.className = "section-subheading"
      robotHeading.textContent = "Roboten"

      const robotFields = document.createElement("div")
      robotFields.className = "text-list"

      page.robotFields.forEach((item) => {
        const textOption = document.createElement("label")
        textOption.className = "text-option"

        const textLabel = document.createElement("span")
        textLabel.textContent = item

        const textInput = document.createElement("input")
        textInput.type = "text"
        textInput.className = "profile-input"
        textInput.setAttribute("aria-label", item)
        textInput.placeholder = "Skriv inn"

        textOption.appendChild(textLabel)
        textOption.appendChild(textInput)
        robotFields.appendChild(textOption)
      })

      robotContent.appendChild(robotHeading)
      robotContent.appendChild(robotFields)

      const droneHeading = document.createElement("h3")
      droneHeading.className = "section-subheading"
      droneHeading.textContent = "Dronen"

      const droneField = document.createElement("label")
      droneField.className = "text-option"

      const droneLabel = document.createElement("span")
      droneLabel.textContent = "Navn:"

      const droneInput = document.createElement("input")
      droneInput.type = "text"
      droneInput.className = "profile-input"
      droneInput.setAttribute("aria-label", "Dronen navn")
      droneInput.placeholder = "Skriv inn"

      droneField.appendChild(droneLabel)
      droneField.appendChild(droneInput)
      robotContent.appendChild(droneHeading)
      robotContent.appendChild(droneField)
      actionContent = robotContent
    } else if (page.id === "meg") {
      const textList = document.createElement("div")
      textList.className = "text-list"

      page.textOptions.forEach((item) => {
        const textOption = document.createElement("label")
        textOption.className = "text-option"

        const textLabel = document.createElement("span")
        textLabel.textContent = item

        const textInput = document.createElement("input")
        textInput.type = "text"
        textInput.className = "profile-input"
        textInput.setAttribute("aria-label", item)
        textInput.placeholder = "Skriv inn"

        textOption.appendChild(textLabel)
        textOption.appendChild(textInput)
        textList.appendChild(textOption)
      })

      actionContent = textList
    } else if (page.id !== "home" && page.id !== "info") {
      const list = document.createElement("div")
      list.className = "info-list"
      if (page.id === "eventer") list.classList.add("event-list")

      page.highlights.forEach((item) => {
        const card = document.createElement("div")
        card.className = "info-card"
        card.textContent = item
        list.appendChild(card)
      })

      actionContent = list
    }

    if (page.id === "info") {
      const infoContent = document.createElement("div")
      infoContent.className = "info-content"

      page.additionalText.forEach((text) => {
        const additionalText = document.createElement("p")
        additionalText.className = "info-additional-text"
        additionalText.textContent = text
        infoContent.appendChild(additionalText)
      })

      const phoneButton = document.createElement("button")
      phoneButton.type = "button"
      phoneButton.className = "phone-button"
      phoneButton.textContent = "📞"
      phoneButton.setAttribute("aria-label", "Ring her")

      infoContent.appendChild(phoneButton)
      actionContent = infoContent
    }

    if (page.id === "home") {
      shell.appendChild(hero)

      const homeCopy = document.createElement("div")
      homeCopy.className = "home-copy"
      homeCopy.appendChild(title)
      homeCopy.appendChild(desc)
      shell.appendChild(homeCopy)
    } else {
      shell.appendChild(title)
      shell.appendChild(desc)
    }
    if (actionContent) shell.appendChild(actionContent)
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
