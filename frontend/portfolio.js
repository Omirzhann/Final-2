const token = localStorage.getItem("token");

async function loadProjects() {
  const projectsContainer = document.getElementById("projectsContainer");
  projectsContainer.innerHTML = "Loading projects...";
  try {
    const response = await fetch("http://localhost:3000/portfolio/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to load projects.");
    const data = await response.json();
    projectsContainer.innerHTML = "";

    data.portfolios.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project");

      projectElement.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        <div>
          ${project.images
            .map((img) =>
              img.trim().startsWith("http")
                ? `<img src="${img}" alt="Project Image" style="max-width: 100px;">`
                : `<img src="placeholder.jpg" alt="Placeholder Image" style="max-width: 100px;">`
            )
            .join("")}
        </div>
        <button class="editButton" data-id="${project._id}" data-title="${project.title}" data-description="${project.description}" data-images="${project.images.join(',')}">Edit</button>
        <button class="deleteButton" data-id="${project._id}">Delete</button>
      `;

      projectsContainer.appendChild(projectElement);
    });

    document.querySelectorAll(".deleteButton").forEach((button) => {
      button.addEventListener("click", (e) => {
        const projectId = e.target.getAttribute("data-id");
        deleteProject(projectId);
      });
    });

    document.querySelectorAll(".editButton").forEach((button) => {
      button.addEventListener("click", (e) => {
        const projectId = e.target.getAttribute("data-id");
        const title = e.target.getAttribute("data-title");
        const description = e.target.getAttribute("data-description");
        const images = e.target.getAttribute("data-images").split(",");
        openEditModal(projectId, title, description, images);
      });
    });
  } catch (error) {
    projectsContainer.innerHTML = "Error loading projects.";
    console.error(error);
  }
}

async function deleteProject(projectId) {
  try {
    const response = await fetch(`http://localhost:3000/portfolio/delete/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete project.");
    alert("Project successfully deleted!");
    loadProjects();
  } catch (error) {
    alert("Failed to delete project.");
    console.error(error);
  }
}

const editModal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editProjectForm = document.getElementById("editProjectForm");
let currentEditId = null;

function openEditModal(id, title, description, images) {
  currentEditId = id;
  document.getElementById("editProjectTitle").value = title;
  document.getElementById("editProjectDescription").value = description;
  document.getElementById("editProjectImages").value = images.join(", ");
  editModal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

editProjectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const updatedData = {
    title: document.getElementById("editProjectTitle").value,
    description: document.getElementById("editProjectDescription").value,
    images: document.getElementById("editProjectImages").value.split(",").map((img) => img.trim()),
  };

  try {
    const response = await fetch(`http://localhost:3000/portfolio/update/${currentEditId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update project.");
    alert("Project successfully updated!");
    editModal.classList.add("hidden");
    loadProjects();
  } catch (error) {
    alert("Failed to update project.");
    console.error(error);
  }
});

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

loadProjects();
