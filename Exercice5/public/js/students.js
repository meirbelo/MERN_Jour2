// Gestion de l'ouverture et de la fermeture du popup
document.getElementById("openPopupBtn").onclick = function () {
    document.getElementById("popup").style.display = "flex";
};

document.getElementById("closePopupBtn").onclick = function () {
    document.getElementById("popup").style.display = "none";
};

// Gestion des onglets (tabs)
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");



// Fonction pour récupérer les paramètres de l'URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

// Fonction pour mettre à jour les paramètres de l'URL
function updateQueryParams(params) {
    const searchParams = new URLSearchParams(params).toString();
    window.location.replace(`/student/management?${searchParams}`);
    console.log('redirect')
}

// Gestion du tri (OrderBy)
function handleOrderBy(query) {
    console.log('order by')
    const queryParams = getQueryParams();
    queryParams.orderBy = query.value;
    updateQueryParams(queryParams);
}

// Gestion de la recherche
function handleSearch(input) {
    const queryParams = getQueryParams();
    queryParams.search = input.value; // Met à jour le paramètre de recherche
    updateQueryParams(queryParams);
}

// Fonction d'initialisation pour gérer les événements en direct
function initialize() {
    const searchInput = document.getElementById("searchInput");
    const orderBySelect = document.getElementById("orderBySelect");

    if (searchInput) {
        searchInput.oninput = function () {
            handleSearch(searchInput);
        };
    }

    if (orderBySelect) {
        orderBySelect.onchange = function () {
            handleOrderBy(orderBySelect);
        };
    }
}

// Initialiser les gestionnaires après le chargement du DOM
document.addEventListener("DOMContentLoaded", initialize);
