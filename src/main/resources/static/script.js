let IPDIRECTION = "localhost";

document.addEventListener("DOMContentLoaded", () => {
    loadProperties();

    document.getElementById("property-form").addEventListener("submit", function (event) {
        event.preventDefault();
        submitProperty();
    });

    document.getElementById("update-btn").addEventListener("click", function (event) {
        event.preventDefault();
        updateProperty();
    });
});

let editingPropertyId = null;

function loadProperties() {
    fetch(`http://${IPDIRECTION}:8080/v1/property`)
        .then(response => response.json())
        .then(properties => {
            const tableBody = document.getElementById("table-body");
            tableBody.innerHTML = ""; 
            properties.forEach(property => {
                tableBody.appendChild(createPropertyRow(property));
            });
        })
        .catch(error => console.error("Error cargando propiedades:", error));
}

function submitProperty() {
    if (editingPropertyId) {
        updateProperty();
    } else {
        addProperty();
    }
}

function addProperty() {
    const address = document.getElementById("address").value;
    const price = document.getElementById("price").value;
    const size = document.getElementById("size").value;
    const description = document.getElementById("description").value;

    const newProperty = { address, price, size, description };
    fetch(`http://${IPDIRECTION}:8080/v1/property/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty)
    })
        .then(response => response.json())
        .then(() => {
            loadProperties();
            resetForm();
            alert("Creado exitosamente!");
        })
        .catch(error => console.error("Error agregando propiedad:", error));
}

function editProperty(id, address, price, size, description) {
    document.getElementById("address").value = address;
    document.getElementById("price").value = price;
    document.getElementById("size").value = size;
    document.getElementById("description").value = description;
    
    editingPropertyId = id;
    document.getElementById("update-btn").style.display = "block";
}

function updateProperty() {
    if (!editingPropertyId) return;
    const updatedProperty = {
        id: editingPropertyId,
        address: document.getElementById("address").value,
        price: document.getElementById("price").value,
        size: document.getElementById("size").value,
        description: document.getElementById("description").value
    };
    fetch(`http://${IPDIRECTION}:8080/v1/property/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProperty)
    })
        .then(response => response.json())
        .then(() => {
            loadProperties();
            resetForm();
            alert("Actualizado exitosamente!");
        })
        .catch(error => console.error("Error actualizando propiedad:", error));
}

function deleteProperty(id) {
    fetch(`http://${IPDIRECTION}:8080/v1/property/${id}`, { method: "DELETE" })
        .then(() => {
            loadProperties()
            alert("Borrado exitosamente!");
        })
        .catch(error => console.error("Error eliminando propiedad:", error));
}

function createPropertyRow(property) {
    const tr = document.createElement("tr");
    tr.id = `row-${property.id}`;
    tr.innerHTML = `
        <td>${property.id || "N/A"}</td>
        <td>${property.address || "Sin dirección"}</td>
        <td>${property.price || "Sin precio"}</td>
        <td>${property.size || "Sin tamaño"}</td>
        <td>${property.description || "Sin descripción"}</td>
        <td>
            <button class="boton" onclick="editProperty(${property.id}, '${property.address}', '${property.price}', '${property.size}', '${property.description}')">Editar</button>
            <button class="boton" onclick="deleteProperty(${property.id})">Borrar</button>
        </td>
    `;

    return tr;
}

function resetForm() {
    document.getElementById("property-form").reset();
    editingPropertyId = null;
    document.getElementById("update-btn").style.display = "none";
}
