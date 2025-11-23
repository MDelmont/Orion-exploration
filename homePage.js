// Home page setup
function setupHomePage() {
    const startButton = document.getElementById("start-button");
    const brandingTitle = document.querySelector(".branding h1");

    // Check if app was already started
    const appStarted = localStorage.getItem("orion-app-started") === "true";
    const lastCategory = localStorage.getItem("orion-last-category");

    if (appStarted) {
        // Skip home page, show app directly
        document.body.classList.add("app-started");

        // Setup branding click handler
        setupBrandingClickHandler();

        // Restore last visited category
        return lastCategory || null;
    } else {
        // Show home page
        document.body.classList.remove("app-started");
    }

    // Handle start button click
    if (startButton) {
        startButton.addEventListener("click", () => {
            // Mark as started and show app immediately
            document.body.classList.add("app-started");
            localStorage.setItem("orion-app-started", "true");
            localStorage.setItem("orion-last-category", "regles");

            // Setup branding click handler after starting
            setupBrandingClickHandler();

            // Navigate to rules page
            window.dispatchEvent(new CustomEvent("home-start", { detail: { category: "regles" } }));
        });
    }

    return null;
}

// Setup click handler on branding title to return to home page
function setupBrandingClickHandler() {
    setTimeout(() => {
        const brandingTitle = document.querySelector(".branding h1");
        if (brandingTitle && !brandingTitle.dataset.homeClickSetup) {
            brandingTitle.style.cursor = "pointer";
            brandingTitle.dataset.homeClickSetup = "true";
            brandingTitle.addEventListener("click", () => {
                localStorage.removeItem("orion-app-started");
                localStorage.removeItem("orion-last-category");
                location.reload();
            });
        }
    }, 100);
}

// Save category to localStorage
function saveCategory(category) {
    if (category) {
        localStorage.setItem("orion-last-category", category);
    }
}
