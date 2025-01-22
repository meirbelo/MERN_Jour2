
function closepopUp() {
    document.getElementById("popup").style.display = "none";
}
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

function handleEditStudent(studentId) {
    fetch(`/student/${studentId}`)
        .then(response => {
            console.log("Fetch Response Object:", response);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut: ${response.status}`);
            }
            return response.json();
        })
        .then(student => {
            console.log("Student Data Received:", student);
            // Pré-remplir le formulaire avec les données existantes.
            document.getElementById("etudiant-name").innerText = `${student[0].lastname || ''} ${student[0].firstname || ''}`;
            document.querySelector("input[name='lastname']").value = student[0].lastname || '';
            document.querySelector("input[name='firstname']").value = student[0].firstname || '';
            document.querySelector("input[name='email']").value = student[0].email || '';
            document.querySelector("input[name='phone']").value = student[0].phone || '';

            // Afficher la pop-up.
            document.getElementById("popup").style.display = "flex";

            // Remplacer l'événement de soumission pour mettre à jour l'étudiant.
            const form = document.getElementById("addForm");
            form.onsubmit = function (event) {
                event.preventDefault();
                const formData = new FormData(form);
                const updatedData = Object.fromEntries(formData.entries());
                console.log("Data to Update:", updatedData);

                fetch(`/student/update-student/${studentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData),
                })
                    .then(response => {
                        console.log("Update Response Object:", response);
                        if (!response.ok) {
                            throw new Error(`Erreur HTTP ! statut: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        console.log("Update Response Text:", data);
                        document.getElementById("popup").style.display = "none";
                        window.location.reload();
                    })
                    .catch(error => console.error('Erreur lors de la mise à jour:', error));
            };
        })
        .catch(error => console.error('Erreur lors de la récupération des données:', error));
}

async function handleDeleteStudent(studentId) {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?");
    if (!confirmation) {
      return;
    }
  
    try {
      const response = await fetch(`/student/delete-student/${studentId}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Étudiant supprimé avec succès');
        location.reload(); // Rechargez la page pour refléter les modifications
      } else if (response.status === 404) {
        alert('Étudiant introuvable');
      } else {
        alert('Une erreur est survenue lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
      alert('Erreur du serveur');
    }
  }
  
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
