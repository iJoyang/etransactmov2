document.addEventListener("DOMContentLoaded", function () {
    setupDropdowns();
});

// Define Districts and Puroks
const districts = {
    "District 1": ["Purok Avocado", "Purok Durian", "Purok Granada", "Purok Granada" , "Purok Labana", "Purok Lansones", "Purok Marang", "Purok Nangka", "Purok Pakwan", "Purok Pinya", "Purok Rambutan", "Purok Saging", "Purok Santol", "Purok Tambis", "Purok Chico", "Purok Ubas"],
    "District 2": ["Purok Acacia", "Purok Almasiga", "Purok Apitong", "Purok Balite", "Purok Gemelina", "Purok Kamagong", "Purok Lawaan", "Purok Mahogany", "Purok Molave", "Purok Narra", "Purok Neem Tree", "Purok Pine Tree", "Purok Talisay", "Purok Tindalo", "Purok Tugas", "Purok Yakal", "Purok Indian Tree"],
    "District 3": ["Purok Aguila", "Purok Gorion", "Purok Maya", "Purok Woodpecker", "Purok Kalapati", "Purok Lovebirds", "Purok Ostrich", "Purok Kalaw", "Purok Kingfisher", "Purok Tamsi", "Purok Parrot"],
    "District 4": ["Purok Arowana", "Purok Balo", "Purok Bangus", "Purok Bariles", "Purok Bolinao", "Purok Flowerhorn", "Purok Lapu-Lapu", "Purok Maya-Maya", "Purok Talakitok", "Tangigue"],
    "District 5": ["Purok Ampalaya", "Purok Cabbage", "Purok Cadios", "Purok Carrots", "Purok Camansi", "Purok Eggplant", "Purok Malunggay", "Purok Pechay", "Purok Stringbeans"],
    "District 6": ["Purok Camel A", "Purok Camel B", "Purok Cobra", "Purok Dragon", "Purok Eggplant A", "Purok Eggplant B", "Purok Kangaroo", "Purok Skylark", "Purok Panther", "Purok Jaguar", "Purok Tamaraw", "Purok Carabao"],
    "District 7": ["Purok Cattleya", "Purok Daisy", "Purok Everlasting", "Purok Gumamela", "Purok Ilang-Ilang", "Purok Orchids", "Purok Sakura", "Purok Sampaguita", "Purok San Francisco", "Purok Santan", "Purok Waling-Waling"],
};

function setupDropdowns() {
    const districtDropdown = document.getElementById("district-dropdown");
    const purokDropdown = document.getElementById("purok-dropdown");

    if (!districtDropdown || !purokDropdown) {
        console.error("Dropdown elements not found!");
        return;
    }

    console.log("Initializing dropdowns...");

    // Populate District Dropdown
    Object.keys(districts).forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtDropdown.appendChild(option);
    });

    // Update Purok Dropdown Based on Selected District
    districtDropdown.addEventListener("change", () => {
        const selectedDistrict = districtDropdown.value;
        purokDropdown.innerHTML = '<option value="">-- Select Purok --</option>';

        if (selectedDistrict && districts[selectedDistrict]) {
            districts[selectedDistrict].forEach(purok => {
                const option = document.createElement("option");
                option.value = purok;
                option.textContent = purok;
                purokDropdown.appendChild(option);
            });

            purokDropdown.disabled = false;
        } else {
            purokDropdown.disabled = true;
        }
    });

    // Fetch Residents when Purok is selected
    purokDropdown.addEventListener("change", () => {
        const district = districtDropdown.value;
        const purok = purokDropdown.value;

        if (district && purok) {
            fetchValidatedResidents(district, purok);
        }
    });
}

// Fetch Validated Residents
function fetchValidatedResidents(district, purok) {
    console.log(`Fetching residents for District: ${district}, Purok: ${purok}`);

    fetch(`fetch-residents.php?district=${encodeURIComponent(district)}&purok=${encodeURIComponent(purok)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector("#validated-residents-table tbody");
            tableBody.innerHTML = ""; // Clear previous results

            if (!data || data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='5'>No validated residents found.</td></tr>";
            } else {
                data.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.user_id}</td>
                        <td>${user.first_name}</td>
                        <td>${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.contact_number}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error("Error fetching validated residents:", error));
}
