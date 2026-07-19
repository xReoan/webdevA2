"use strict";

/* =========================================================
   KAMAKURA UNDER SIEGE
   Page management, educational interactions and mini-game
   ========================================================= */

// ---------- Shared DOM references ----------
const pages = document.querySelectorAll(".page");
const navigationButtons = document.querySelectorAll(".nav-link");
const mainNavigation = document.getElementById("main-navigation");
const menuButton = document.getElementById("menu-button");
const topicGrid = document.getElementById("topic-grid");

const clickAudio = document.getElementById("click-audio");
const correctAudio = document.getElementById("correct-audio");
const wrongAudio = document.getElementById("wrong-audio");

// Audio is optional: failure is safely ignored if a browser blocks autoplay.
function playAudio(audioElement) {
    if (!audioElement) {
        return;
    }

    audioElement.currentTime = 0;
    audioElement.play().catch(function () {
        // The user can continue using the app when audio permission is blocked.
    });
}

// ---------- Single-page navigation system ----------
function showPage(pageId) {
    let requestedPage = document.getElementById(pageId);

    if (!requestedPage || !requestedPage.classList.contains("page")) {
        requestedPage = document.getElementById("home");
        pageId = "home";
    }

    pages.forEach(function (page) {
        const isActive = page.id === pageId;
        page.hidden = !isActive;
        page.classList.toggle("active-page", isActive);
    });

    navigationButtons.forEach(function (button) {
        button.classList.toggle("active-nav", button.dataset.page === pageId);
    });

    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Hash navigation is useful online, but local file previews can restrict
    // History API calls. Updating the hash directly is safer in both cases.
    if (window.location.hash !== "#" + pageId) {
        window.location.hash = pageId;
    }
}

navigationButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        playAudio(clickAudio);
        showPage(button.dataset.page);
    });
});

window.addEventListener("load", function () {
    const startingPage = window.location.hash.replace("#", "") || "home";
    showPage(startingPage);
});

window.addEventListener("hashchange", function () {
    const pageId = window.location.hash.replace("#", "") || "home";
    showPage(pageId);
});

// Event delegation: one parent handles all home topic cards.
topicGrid.addEventListener("click", function (event) {
    const selectedCard = event.target.closest(".topic-card");

    if (selectedCard) {
        playAudio(clickAudio);
        showPage(selectedCard.dataset.page);
    }
});

topicGrid.addEventListener("keydown", function (event) {
    const selectedCard = event.target.closest(".topic-card");

    if (selectedCard && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        showPage(selectedCard.dataset.page);
    }
});

// ---------- Responsive mobile menu ----------
menuButton.addEventListener("click", function () {
    const isOpen = mainNavigation.classList.toggle("menu-open");
    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    playAudio(clickAudio);
});

function closeMobileMenu() {
    mainNavigation.classList.remove("menu-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
}

// ---------- Kamakura society explorer ----------
const societyData = {
    warrior: {
        kicker: "Government and protection",
        name: "Warrior Government",
        description: "Samurai served powerful lords, protected estates and carried out military or administrative duties for the shogunate.",
        role: "Defence and administration",
        concern: "Service, loyalty and land"
    },
    farmer: {
        kicker: "Food and local production",
        name: "Farmers",
        description: "Farmers cultivated rice and other crops. Their labour supported households, estates, temples and the warrior government through dues and taxes.",
        role: "Agricultural production",
        concern: "Harvests, weather and dues"
    },
    artisan: {
        kicker: "Craft and exchange",
        name: "Artisans & Merchants",
        description: "Artisans made tools, pottery, cloth, weapons and religious objects, while merchants helped goods move between communities and growing markets.",
        role: "Production and trade",
        concern: "Materials, customers and travel"
    },
    religious: {
        kicker: "Belief and learning",
        name: "Religious Communities",
        description: "Temples and shrines were centres of worship, education, landholding and community activity. New Buddhist movements also gained followers.",
        role: "Worship, learning and welfare",
        concern: "Patronage and community needs"
    },
    court: {
        kicker: "Tradition and legitimacy",
        name: "Imperial Court",
        description: "The emperor and nobles remained in Kyoto. Although military authority shifted toward Kamakura, the court retained cultural and symbolic importance.",
        role: "Ceremony and legitimacy",
        concern: "Influence, rank and tradition"
    }
};

const societySelector = document.getElementById("society-selector");
const societyKicker = document.getElementById("society-kicker");
const societyName = document.getElementById("society-name");
const societyDescription = document.getElementById("society-description");
const societyRole = document.getElementById("society-role");
const societyConcern = document.getElementById("society-concern");

societySelector.addEventListener("click", function (event) {
    const selectedButton = event.target.closest(".selector-button");

    if (!selectedButton) {
        return;
    }

    const group = societyData[selectedButton.dataset.group];

    document.querySelectorAll(".selector-button").forEach(function (button) {
        button.classList.toggle("selected", button === selectedButton);
    });

    societyKicker.textContent = group.kicker;
    societyName.textContent = group.name;
    societyDescription.textContent = group.description;
    societyRole.textContent = group.role;
    societyConcern.textContent = group.concern;
    playAudio(clickAudio);
});

// ---------- Myth or fact reveal cards ----------
document.querySelectorAll(".reveal-card").forEach(function (card) {
    card.addEventListener("click", function () {
        card.classList.toggle("revealed");
        playAudio(clickAudio);
    });
});

// ---------- Invasion comparison ----------
const invasionData = {
    "1274": {
        label: "First invasion",
        name: "The Bun'ei Campaign",
        summary: "The invading force attacked Tsushima and Iki before landing near Hakata Bay. Japanese defenders encountered coordinated formations, massed archery and gunpowder weapons.",
        preparation: "Limited experience against a large overseas invasion",
        development: "The defenders learned how different the attackers' tactics were",
        outcome: "The invading fleet withdrew after fighting and severe weather"
    },
    "1281": {
        label: "Second invasion",
        name: "The Kōan Campaign",
        summary: "A much larger invasion returned. Japan had strengthened the coast, including a stone wall at Hakata Bay, and defenders prevented the attackers from easily securing a beachhead.",
        preparation: "Years of vigilance, coastal patrols and new fortifications",
        development: "The Hakata wall and raids from small Japanese boats limited enemy movement",
        outcome: "Resistance, supply problems and a destructive typhoon ended the invasion"
    }
};

const yearTabs = document.querySelectorAll(".year-tab");
const invasionYear = document.getElementById("invasion-year");
const invasionName = document.getElementById("invasion-name");
const invasionSummary = document.getElementById("invasion-summary");
const invasionPreparation = document.getElementById("invasion-preparation");
const invasionDevelopment = document.getElementById("invasion-development");
const invasionOutcome = document.getElementById("invasion-outcome");
const invasionLabel = document.querySelector(".invasion-year span");

yearTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const year = tab.dataset.year;
        const data = invasionData[year];

        yearTabs.forEach(function (item) {
            const isSelected = item === tab;
            item.classList.toggle("active-year", isSelected);
            item.setAttribute("aria-selected", String(isSelected));
        });

        invasionLabel.textContent = data.label;
        invasionYear.textContent = year;
        invasionName.textContent = data.name;
        invasionSummary.textContent = data.summary;
        invasionPreparation.textContent = data.preparation;
        invasionDevelopment.textContent = data.development;
        invasionOutcome.textContent = data.outcome;
        playAudio(clickAudio);
    });
});

// ---------- Interactive event timeline ----------
const timelineData = {
    "1268": "Kublai Khan's government sent demands that Japan submit. The shogunate refused.",
    "1274": "The first invasion attacked Tsushima and Iki before fighting around Hakata Bay.",
    "1275": "Japan prepared for another invasion by strengthening coastal defence, including the Hakata stone wall.",
    "1281": "Two large forces approached Japan. Strong resistance and a major typhoon helped end the second invasion."
};

const eventTimeline = document.getElementById("event-timeline");
const timelineExplanation = document.getElementById("timeline-explanation");

eventTimeline.addEventListener("click", function (event) {
    const selectedEvent = event.target.closest("button");

    if (!selectedEvent) {
        return;
    }

    eventTimeline.querySelectorAll("button").forEach(function (button) {
        button.classList.toggle("selected", button === selectedEvent);
    });

    timelineExplanation.textContent = timelineData[selectedEvent.dataset.event];
    playAudio(clickAudio);
});

// ---------- Life during war perspectives ----------
const perspectiveData = {
    samurai: {
        symbol: "刀",
        label: "Military service",
        name: "Samurai Defender",
        story: "A warrior might be ordered to travel to Kyushu, remain ready for another attack and join coastal patrols or raids against enemy ships.",
        points: [
            "Leave home to serve at coastal defences",
            "Provide weapons, armour and attendants",
            "Seek recognition or rewards after service"
        ]
    },
    farmer: {
        symbol: "米",
        label: "Food and survival",
        name: "Farmer",
        story: "A farming household still had to produce enough food for itself while taxes, supply demands and defence work increased pressure on local communities.",
        points: [
            "Maintain crops despite wartime disruption",
            "Contribute food or other resources",
            "Protect family members and stored harvests"
        ]
    },
    builder: {
        symbol: "築",
        label: "Fortification labour",
        name: "Fortification Builder",
        story: "Workers helped gather stone, move materials and construct coastal barriers designed to obstruct a future landing at Hakata Bay.",
        points: [
            "Transport heavy building materials",
            "Work under urgent defensive schedules",
            "Support a project spanning many kilometres"
        ]
    },
    monk: {
        symbol: "祈",
        label: "Prayer and community",
        name: "Buddhist Monk",
        story: "Religious communities performed rituals and prayers for protection while also offering people a way to understand fear, danger and survival.",
        points: [
            "Take part in protective ceremonies",
            "Reassure frightened communities",
            "Interpret the storms through religious belief"
        ]
    }
};

const perspectiveButtons = document.getElementById("perspective-buttons");
const personSymbol = document.getElementById("person-symbol");
const personLabel = document.getElementById("person-label");
const personName = document.getElementById("person-name");
const personStory = document.getElementById("person-story");
const personList = document.getElementById("person-list");

perspectiveButtons.addEventListener("click", function (event) {
    const selectedButton = event.target.closest(".perspective-button");

    if (!selectedButton) {
        return;
    }

    const person = perspectiveData[selectedButton.dataset.person];

    perspectiveButtons.querySelectorAll("button").forEach(function (button) {
        button.classList.toggle("selected", button === selectedButton);
    });

    personSymbol.textContent = person.symbol;
    personLabel.textContent = person.label;
    personName.textContent = person.name;
    personStory.textContent = person.story;
    personList.innerHTML = "";

    person.points.forEach(function (point) {
        const listItem = document.createElement("li");
        listItem.textContent = point;
        personList.appendChild(listItem);
    });

    playAudio(clickAudio);
});

// ---------- Form data ----------
const reflectionForm = document.getElementById("reflection-form");
const profileResult = document.getElementById("profile-result");

reflectionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(reflectionForm);
    const studentName = formData.get("studentName").trim();
    const selectedRole = formData.get("chosenRole");

    if (studentName.length === 0) {
        profileResult.textContent = "Please enter a display name.";
        return;
    }

    profileResult.textContent =
        studentName + ", your historical profile is ready. You chose to investigate the life of a " +
        selectedRole + ".";
    playAudio(correctAudio);
});

// ---------- Mini-game data ----------
const scenarios = [
    {
        label: "Round 1 · Preparation",
        title: "A second invasion is expected",
        text: "Officials plan a stone defensive wall near Hakata Bay. What should receive priority?",
        choices: [
            {
                text: "Organise labour and complete the coastal wall",
                changes: { defence: 24, supplies: -10, morale: 4 },
                feedback: "Strong choice. The Hakata wall helped prevent attackers from easily establishing themselves on the beach.",
                positive: true,
                sprite: "defend"
            },
            {
                text: "Do nothing until enemy ships are visible",
                changes: { defence: -20, supplies: 4, morale: -12 },
                feedback: "Waiting saves resources briefly, but it sacrifices the years available for defensive preparation.",
                positive: false,
                sprite: "idle"
            },
            {
                text: "Spend every resource on ceremonial decoration",
                changes: { defence: -16, supplies: -18, morale: 5 },
                feedback: "Ceremony mattered, but practical fortifications and supplies were essential to coastal defence.",
                positive: false,
                sprite: "idle"
            }
        ]
    },
    {
        label: "Round 2 · Supplies",
        title: "Defenders need food",
        text: "Coastal forces must remain ready, but nearby villages also need enough grain. What is the best plan?",
        choices: [
            {
                text: "Create a balanced supply schedule for soldiers and villages",
                changes: { defence: 10, supplies: 16, morale: 12 },
                feedback: "A balanced plan supports military readiness without exhausting the communities that produce food.",
                positive: true,
                sprite: "defend"
            },
            {
                text: "Take all village food immediately",
                changes: { defence: 8, supplies: 8, morale: -24 },
                feedback: "The army gains food, but severe pressure on villagers damages morale and long-term production.",
                positive: false,
                sprite: "attack"
            },
            {
                text: "Keep every supply inland and provide nothing",
                changes: { defence: -22, supplies: 10, morale: -8 },
                feedback: "Stored food remains safe for now, but coastal defenders cannot stay effective without supplies.",
                positive: false,
                sprite: "idle"
            }
        ]
    },
    {
        label: "Round 3 · Contact",
        title: "Enemy ships approach the coast",
        text: "The wall limits a landing. How should the defenders respond?",
        choices: [
            {
                text: "Hold the wall and conduct controlled raids using small boats",
                changes: { defence: 20, supplies: -8, morale: 14 },
                feedback: "Historically grounded. Defenders used the wall and launched raids against the fleet.",
                positive: true,
                sprite: "attack"
            },
            {
                text: "Leave the wall and charge without coordination",
                changes: { defence: -18, supplies: -12, morale: -5 },
                feedback: "An unsupported charge gives up the advantage created by the coastal fortifications.",
                positive: false,
                sprite: "attack"
            },
            {
                text: "Abandon the coast immediately",
                changes: { defence: -28, supplies: 5, morale: -18 },
                feedback: "Retreat preserves some supplies, but it opens the coast and damages confidence.",
                positive: false,
                sprite: "idle"
            }
        ]
    },
    {
        label: "Round 4 · Aftermath",
        title: "The invasion has ended",
        text: "Warriors request rewards, but no new territory was conquered. What should the government do?",
        choices: [
            {
                text: "Recognise service and distribute available support fairly",
                changes: { defence: 6, supplies: -8, morale: 22 },
                feedback: "This cannot create new land, but fair recognition and support can reduce resentment.",
                positive: true,
                sprite: "victory"
            },
            {
                text: "Ignore every request for recognition",
                changes: { defence: -4, supplies: 8, morale: -28 },
                feedback: "The government saves resources, but disappointed warriors may lose faith in its leadership.",
                positive: false,
                sprite: "idle"
            },
            {
                text: "Promise unlimited rewards that do not exist",
                changes: { defence: -8, supplies: -20, morale: -12 },
                feedback: "Unsustainable promises create further distrust and cannot solve the shortage of land or wealth.",
                positive: false,
                sprite: "idle"
            }
        ]
    }
];

// ---------- Mini-game state and DOM ----------
let currentRound = 0;
let stats = { defence: 70, supplies: 70, morale: 70 };
let countdownValue = 20;
let countdownTimer = null;
let gameLocked = false;

const gameIntro = document.getElementById("game-intro");
const gameBoard = document.getElementById("game-board");
const resultPanel = document.getElementById("result-panel");
const startGameButton = document.getElementById("start-game");
const resetGameButton = document.getElementById("reset-game");
const resetAppButton = document.getElementById("reset-app");

const roundNumber = document.getElementById("round-number");
const countdownNumber = document.getElementById("countdown-number");
const scenarioLabel = document.getElementById("scenario-label");
const scenarioTitle = document.getElementById("scenario-title");
const scenarioText = document.getElementById("scenario-text");
const choiceList = document.getElementById("choice-list");
const feedbackBox = document.getElementById("feedback-box");
const battleSamurai = document.getElementById("battle-samurai");
const movingShip = document.getElementById("moving-ship");

const defenceValue = document.getElementById("defence-value");
const suppliesValue = document.getElementById("supplies-value");
const moraleValue = document.getElementById("morale-value");
const defenceBar = document.getElementById("defence-bar");
const suppliesBar = document.getElementById("supplies-bar");
const moraleBar = document.getElementById("morale-bar");

const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");

function clampStat(value) {
    return Math.max(0, Math.min(100, value));
}

function updateStats() {
    defenceValue.textContent = stats.defence;
    suppliesValue.textContent = stats.supplies;
    moraleValue.textContent = stats.morale;

    defenceBar.style.width = stats.defence + "%";
    suppliesBar.style.width = stats.supplies + "%";
    moraleBar.style.width = stats.morale + "%";
}

function updateSprite(spriteClass) {
    battleSamurai.className = "samurai-sprite " + spriteClass;
}

function animateBattleScene(isPositive) {
    // JS animation requirement: JavaScript updates a positioned CSS property.
    movingShip.style.right = isPositive ? "-130px" : "8px";
    window.setTimeout(function () {
        movingShip.style.right = window.innerWidth <= 800 ? "15px" : "55px";
    }, 900);
}

function beginCountdown() {
    window.clearInterval(countdownTimer);
    countdownValue = 20;
    countdownNumber.textContent = countdownValue;

    countdownTimer = window.setInterval(function () {
        countdownValue -= 1;
        countdownNumber.textContent = countdownValue;

        if (countdownValue <= 0) {
            window.clearInterval(countdownTimer);
            handleTimeout();
        }
    }, 1000);
}

function renderScenario() {
    const scenario = scenarios[currentRound];

    gameLocked = false;
    roundNumber.textContent = currentRound + 1;
    scenarioLabel.textContent = scenario.label;
    scenarioTitle.textContent = scenario.title;
    scenarioText.textContent = scenario.text;
    feedbackBox.classList.remove("visible");
    feedbackBox.textContent = "";
    choiceList.innerHTML = "";

    scenario.choices.forEach(function (choice, index) {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.type = "button";
        button.dataset.choiceIndex = index;
        button.textContent = choice.text;
        choiceList.appendChild(button);
    });

    updateSprite("idle");
    beginCountdown();
}

function applyChoice(choice) {
    stats.defence = clampStat(stats.defence + choice.changes.defence);
    stats.supplies = clampStat(stats.supplies + choice.changes.supplies);
    stats.morale = clampStat(stats.morale + choice.changes.morale);

    updateStats();
    updateSprite(choice.sprite);
    animateBattleScene(choice.positive);

    feedbackBox.textContent = choice.feedback;
    feedbackBox.classList.add("visible");

    choiceList.querySelectorAll("button").forEach(function (button) {
        button.disabled = true;
    });

    playAudio(choice.positive ? correctAudio : wrongAudio);

    window.setTimeout(function () {
        currentRound += 1;

        if (currentRound < scenarios.length) {
            renderScenario();
        } else {
            finishGame();
        }
    }, 2500);
}

function handleTimeout() {
    if (gameLocked) {
        return;
    }

    gameLocked = true;
    stats.defence = clampStat(stats.defence - 12);
    stats.morale = clampStat(stats.morale - 10);
    updateStats();

    feedbackBox.textContent = "Time ran out. Delayed decisions can weaken preparation and confidence.";
    feedbackBox.classList.add("visible");
    playAudio(wrongAudio);

    choiceList.querySelectorAll("button").forEach(function (button) {
        button.disabled = true;
    });

    window.setTimeout(function () {
        currentRound += 1;

        if (currentRound < scenarios.length) {
            renderScenario();
        } else {
            finishGame();
        }
    }, 2200);
}

// Event delegation: one listener handles every dynamically created game choice.
choiceList.addEventListener("click", function (event) {
    const selectedChoice = event.target.closest(".choice-button");

    if (!selectedChoice || gameLocked) {
        return;
    }

    gameLocked = true;
    window.clearInterval(countdownTimer);

    const scenario = scenarios[currentRound];
    const choice = scenario.choices[Number(selectedChoice.dataset.choiceIndex)];
    applyChoice(choice);
});

function startGame() {
    currentRound = 0;
    stats = { defence: 70, supplies: 70, morale: 70 };
    gameLocked = false;

    gameIntro.hidden = true;
    resultPanel.hidden = true;
    gameBoard.hidden = false;

    updateStats();
    renderScenario();
    playAudio(clickAudio);
}

function finishGame() {
    window.clearInterval(countdownTimer);
    gameBoard.hidden = true;
    resultPanel.hidden = false;

    const score = stats.defence + stats.supplies + stats.morale;
    finalScore.textContent = score;

    if (score >= 240) {
        resultTitle.textContent = "The coast stands strong!";
        resultMessage.textContent = "Your balanced decisions protected the shoreline while preserving supplies and morale.";
    } else if (score >= 170) {
        resultTitle.textContent = "Japan holds the line";
        resultMessage.textContent = "The defence succeeds, although some choices place heavy pressure on people or resources.";
    } else {
        resultTitle.textContent = "The defence is under strain";
        resultMessage.textContent = "Your campaign shows why preparation, supply and public confidence all mattered during the invasion threat.";
    }

    playAudio(score >= 170 ? correctAudio : wrongAudio);
}

function resetGame() {
    window.clearInterval(countdownTimer);
    currentRound = 0;
    stats = { defence: 70, supplies: 70, morale: 70 };
    gameLocked = false;

    gameIntro.hidden = false;
    gameBoard.hidden = true;
    resultPanel.hidden = true;
    feedbackBox.classList.remove("visible");
    movingShip.style.right = "";
    updateStats();
}

startGameButton.addEventListener("click", startGame);
resetGameButton.addEventListener("click", startGame);

// ---------- Reset the whole app without refreshing ----------
resetAppButton.addEventListener("click", function () {
    resetGame();
    reflectionForm.reset();
    profileResult.textContent = "";

    document.querySelectorAll(".reveal-card").forEach(function (card) {
        card.classList.remove("revealed");
    });

    showPage("home");
    playAudio(clickAudio);
});
