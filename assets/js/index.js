const sections = document.querySelectorAll(".app-section");
const navLinks = document.querySelectorAll(".nav-link");
function showSection(sectionId) {
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add("hidden")
    }
    document.getElementById(sectionId).classList.remove("hidden");
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("bg-blue-500/10", "text-blue-400", "hover:bg-slate-800", "text-slate-300");
        if (navLinks[i].dataset.section === sectionId) {
            navLinks[i].classList.add("bg-blue-500/10", "text-blue-400", "hover:bg-blue-500/30");
        }
        else {
            navLinks[i].classList.add("text-slate-300", "hover:bg-slate-800")
        }
    }
}
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", () => {
        showSection(navLinks[i].getAttribute("data-section"))
    })
}
showSection("today-in-space");


let apodData = null;
let launchesData = [];
let planetsData = [];
const NASA_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

const apodLoading = document.getElementById("apod-loading");
const apodImage = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodMediaType = document.getElementById("apod-media-type");
const apodDateInfo = document.getElementById("apod-date-info");
const apodDateInput = document.getElementById("apod-date-input");
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");
const inputDate = document.getElementById("apod-date-input")
const viewImgBtn = document.getElementById("view-full-img-button")
loadInitialAPOD()

async function loadInitialAPOD() {
    const todayDate = getTodaysDate();
    try {
        await getAPOD(todayDate);
    } catch {
        const yesterdayDate = getDate(1);
        await getAPOD(yesterdayDate);
    }
}

function getTodaysDate(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : ("0" + `${date.getMonth() + 1}`)}-${date.getDate() > 9 ? date.getDate() : ("0" + `${date.getDate()}`)}`;
}

async function getAPOD(date) {
    showAPODLoading();
    const url = `${NASA_API_URL}&date=${date}`;
    const response = await fetch(url);
    if (!response.ok) {
        hideAPODLoading();
        throw new Error("Invalid APOD date");
    }
    const data = await response.json();
    apodData = data;
    displayAPOD(data);
    hideAPODLoading();
}

function showAPODLoading() {
    apodLoading.classList.remove("hidden");
    apodImage.classList.add("hidden");
}
function hideAPODLoading() {
    apodLoading.classList.add("hidden");
    apodImage.classList.remove("hidden");
}


function displayAPOD(data) {
    const dateObj = new Date(data.date)
    const formatDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    apodTitle.innerHTML = data.title;
    apodDate.innerHTML = `Astronomy Picture of the Day - ${formatDate}`;
    apodDateDetail.innerHTML = formatDate;
    apodExplanation.innerHTML = data.explanation;
    apodCopyright.innerHTML = `&copy; Copyright: ${data.copyright}` || "&copy; NASA/JPL";
    apodDateInfo.innerHTML = formatDate
    apodMediaType.innerHTML = data.media_type === "image" ? "Image" : "Video";
    if (data.media_type === "image") {
        apodImage.src = data.url;
        apodImage.alt = data.title;
    } else if (data.media_type === "video") {
        apodImage.src = data.thumbnail_url;
        apodImage.alt = data.title;
    }
    viewImgBtn.addEventListener("click", () => {
        window.open(data.hdurl, "_blank")
    })
}
inputDate.valueAsNumber = Date.parse(getTodaysDate(0))
inputDate.max = getTodaysDate(-1)
const dateIndicator = document.querySelector('.date-input-wrapper .text-sm')
dateIndicator.textContent = inputDate.value;
inputDate.addEventListener("change", () => {
    dateIndicator.textContent = inputDate.value;
})
loadDateBtn.addEventListener("click", () => {
    if (dateIndicator.textContent <= getTodaysDate()) {
        getAPOD(dateIndicator.textContent);
    }
    else {
        window.alert("please enter a valid date por favor señor")
    }
})
todayApodBtn.addEventListener("click", () => {
    getAPOD(getTodaysDate())
    inputDate.valueAsNumber = Date.parse(getTodaysDate())
    dateIndicator.textContent = inputDate.value;

})



//LAUNCHES
const LAUNCHES_API_URL = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming"
getLaunches()
async function getLaunches() {
    const response = await fetch(`${LAUNCHES_API_URL}?limit=10`);
    if (!response.ok) {
        throw new Error("Failed to fetch launches");
    }
    const data = await response.json();
    launchesData = data.results;
    displayLaunches(launchesData);
}
function displayLaunches(launches) {
    const featuredLaunch = launches[0];
    const upcomingLaunches = launches.slice(1);

    displayFeaturedLaunch(featuredLaunch);
    displayLaunchCards(upcomingLaunches);
}

const featuredLaunchName = document.getElementById("featured-launch-name");
const featuredLaunchStatus = document.getElementById("featured-launch-status")
const featuredLaunchAgency = document.getElementById("featured-launch-agency")
const featuredLaunchMission = document.getElementById("featured-launch-mission")
const featuredLaunchDescription = document.getElementById("featured-launch-description")
const featuredLaunchImage = document.getElementById("featured-launch-img")
const featuredLaunchLocation = document.getElementById("featured-launch-location")
const featuredLaunchCountry = document.getElementById("featured-launch-country")
const featuredLaunchImagePlaceHolder = document.getElementById("featured-launch-img-placeholder")
const featuredLaunchDate = document.getElementById("featured-launch-date")
const featuredLaunchTime = document.getElementById("featured-launch-time")
const featuredLaunchCountdown = document.getElementById("featured-launch-countdown")

function displayFeaturedLaunch(launch) {
    featuredLaunchName.textContent = launch.name;
    featuredLaunchStatus.textContent = launch.status.abbrev;
    featuredLaunchAgency.textContent = launch.launch_service_provider.name;
    featuredLaunchMission.textContent = launch.rocket.configuration.name;
    featuredLaunchDescription.textContent = launch.mission.description;
    featuredLaunchImagePlaceHolder.classList.add("hidden")
    featuredLaunchImage.src = launch.image.image_url;
    featuredLaunchImage.alt = launch.image.name;
    featuredLaunchLocation.textContent = launch.pad.location.name;
    featuredLaunchCountry.textContent = launch.pad.country.name;
    featuredLaunchDate.textContent = new Date(launch.net).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    featuredLaunchTime.textContent = new Date(launch.net).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" }) + " UTC";
    featuredLaunchCountdown.textContent = getDaysUntilLaunch(launch.net);
}
function getDaysUntilLaunch(date) {
    const now = new Date();
    const launchDate = new Date(date);
    const difference = launchDate - now;
    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );
}
const launchesGrid = document.getElementById("launches-grid")
function displayLaunchCards(launches) {
    launchesGrid.innerHTML = "";

    launches.forEach(launch => {

        const card = document.createElement("div");
        card.innerHTML = `
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
              <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                <img src="${launch.image.image_url}" alt="${launch.image.name}" class="w-full h-full object-cover" onerror="this.outerHTML='<i class=&quot;fas fa-space-shuttle text-5xl text-slate-700&quot;></i>'"> 
                <div class="absolute top-3 right-3">
                  <span class="px-3 py-1 bg-slate-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                    ${launch.status.abbrev}
                  </span>
                </div>
              </div>
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${launch.name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${launch.launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${new Date(launch.net).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${new Date(launch.net).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" })}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${launch.rocket.configuration.name}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${launch.pad.location.name}</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;

        launchesGrid.appendChild(card);
    });
}

//PLANETS
const PLANETS_API_URL = "https://solar-system-opendata-proxy.vercel.app/api/planets"
getPlanets()
async function getPlanets() {
    const response = await fetch(`${PLANETS_API_URL}`);
    if (!response.ok) {
        throw new Error("Failed to fetch launches");
    }
    const data = await response.json();
    planetsData = data.bodies;
    console.log(planetsData)
    displayPlanetCards();
}
function displayPlanetCards() {
    const planetsGrid = document.getElementById("planets-grid");
    planetsGrid.innerHTML = "";
    planetsData.forEach(planet => {
        const card = document.createElement("div");

        card.className =
            "planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group";

        card.dataset.planetId = planet.id;

        card.innerHTML = `
            <div class="relative mb-3 h-24 flex items-center justify-center">
                <img
                    class="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                    src="${planet.image}"
                    alt="${planet.englishName}"
                />
            </div>

            <h4 class="font-semibold text-center text-sm">
                ${planet.englishName}
            </h4>

            <p class="text-xs text-slate-400 text-center">
                ${formatAU(planet.semimajorAxis)} AU
            </p>
        `;
        card.addEventListener("click", () => {
            displayPlanetDetails(planet);
        });
        planetsGrid.appendChild(card);
    });
}

function displayPlanetDetails(planet) {
    document.getElementById("planet-detail-image").src = planet.image;
    document.getElementById("planet-detail-image").alt =
        `${planet.englishName} planet`;

    document.getElementById("planet-detail-name").textContent =
        planet.englishName;

    document.getElementById("planet-detail-description").textContent =
        planet.description;

    document.getElementById("planet-distance").textContent =
        `${approxNumber(planet.semimajorAxis / 1000000)}M km`;

    document.getElementById("planet-radius").textContent =
        `${approxNumber(planet.meanRadius)} km`;

    document.getElementById("planet-mass").innerHTML =
        formatScientific(
            planet.mass.massValue,
            planet.mass.massExponent
        );

    document.getElementById("planet-density").textContent =
        `${planet.density} g/cm³`;

    document.getElementById("planet-orbital-period").textContent =
        formatOrbitalPeriod(planet.sideralOrbit);

    document.getElementById("planet-rotation").textContent =
        formatRotationPeriod(planet.sideralRotation);

    document.getElementById("planet-moons").textContent =
        planet.moons ? planet.moons.length : 0;

    document.getElementById("planet-gravity").textContent =
        `${planet.gravity} m/s²`;

    document.getElementById("planet-discoverer").textContent =
        planet.discoveredBy || "Known since antiquity";

    document.getElementById("planet-discovery-date").textContent =
        planet.discoveryDate || "Ancient";

    document.getElementById("planet-body-type").textContent =
        planet.type || planet.bodyType || "Planet";

    document.getElementById("planet-volume").textContent =
        formatVolume(planet.vol);

    document.getElementById("planet-perihelion").textContent =
        `${approxNumber(planet.perihelion / 1000000)}M km`;

    document.getElementById("planet-aphelion").textContent =
        `${approxNumber(planet.aphelion / 1000000)}M km`;

    document.getElementById("planet-eccentricity").textContent =
        planet.eccentricity;

    document.getElementById("planet-inclination").textContent =
        `${planet.inclination}°`;

    document.getElementById("planet-axial-tilt").textContent =
        `${planet.axialTilt}°`;

    document.getElementById("planet-temp").textContent =
        formatTemperature(planet.avgTemp);

    document.getElementById("planet-escape").textContent =
        `${(planet.escape / 1000).toFixed(2)} km/s`;

    displayPlanetFacts(planet);
}
function displayPlanetFacts(planet) {
    const factsContainer = document.getElementById("planet-facts");

    const facts = [];

    if (planet.type) {
        facts.push(`Classified as a ${planet.type}`);
    }

    if (planet.moons) {
        facts.push(
            `Has ${planet.moons.length} known moon${planet.moons.length !== 1 ? "s" : ""}`
        );
    } else {
        facts.push("Has no known moons");
    }

    facts.push(
        `Average temperature is ${formatTemperature(planet.avgTemp)}`
    );

    facts.push(
        `Axial tilt is ${planet.axialTilt}°`
    );

    factsContainer.innerHTML = "";

    facts.forEach(fact => {
        const li = document.createElement("li");

        li.className = "flex items-start";

        li.innerHTML = `
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">${fact}</span>
        `;

        factsContainer.appendChild(li);
    });
}
function formatOrbitalPeriod(days) {
    if (days >= 365) {
        return `${(days / 365.25).toFixed(1)} years`;
    }

    return `${days.toFixed(2)} days`;
} //year in planet time
function formatRotationPeriod(hours) {
    if (hours >= 24) {
        return `${(hours / 24).toFixed(1)} days`;
    }

    return `${hours.toFixed(2)} hours`;
} //day in planet time
function formatScientific(value, exponent) {
    return `${value.toFixed(2)} × 10<sup>${(exponent)}</sup> kg`;
} //mass
function approxNumber(number) {
    return Math.ceil(number);
} //approx number
function formatAU(distanceKm) {
    const AU = planetsData[6].semimajorAxis; //earth semi major axis

    return (distanceKm / AU).toFixed(2);
} //divides the planets semi major axis by earth's
function formatVolume(volume) {
    return `${volume.volValue} × 10<sup>${volume.volExponent}</sup> km³`;
}
function formatTemperature(kelvin) {
    const celsius = kelvin - 273.15;

    return `${Math.round(celsius)}°C`;
}
