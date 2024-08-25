
// Part 1: Function to fetch works data
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
  });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch works: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Fetch did not work out due to: " + error.message);
  }
};

// Part 2: Function to create the gallery
function createGallery(data) {
  const gallery = document.querySelector(".gallery");
  
  data.forEach((workItem) => {
    const figure = document.createElement("figure");
    figure.classList.add("project");
    figure.setAttribute("data-category", workItem.categoryId);
    figure.setAttribute("data-id", workItem.id);

    const img = document.createElement("img");
    img.src = workItem.imageUrl;
    img.alt = workItem.title;
    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = workItem.title;
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  });
}

// Part 3: Function to create the modal
function createModal(data) {
  const modalGallery = document.querySelector('.modal-gallery');
  
  data.forEach((workItem) => {
    const figure = document.createElement("figure");
    figure.setAttribute("data-id", workItem.id);

    const img = document.createElement("img");
    img.src = workItem.imageUrl;
    img.alt = workItem.title;
    figure.appendChild(img);

    const button = document.createElement("button");
    button.classList.add("btn-del-icon");
    button.setAttribute("data-id", workItem.id);

    const buttonImg = document.createElement("img");
    buttonImg.src = "assets/icons/bin-icon.svg";
    buttonImg.alt = "Icône d'une corbeille";
    button.appendChild(buttonImg);

    figure.appendChild(button);
    modalGallery.appendChild(figure);
  });

  document.querySelectorAll('.btn-del-icon').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      deleteWork(item.getAttribute('data-id'));
    });
  });
}

// Action 
(async function () {
  try {
    const data = await fetchWorks();
    createGallery(data);
    createModal(data);
  } catch (error) {
    console.error(error);
  }
})();


async function showCategories() {
  // Selecting the container where the category buttons will be displayed
  const categoriesContainer = document.querySelector(".btn-list");

  try {
    // Fetch data from the API
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
      const categories = await response.json();

      // Loop through each category in the fetched data
      categories.forEach((category) => {
        // Create a new list item and button element for each category
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = category.name;
        button.classList.add("btn");
        button.dataset.category = category.id;
        button.addEventListener("click", () => filterWorks(category.id));
        listItem.appendChild(button);
        categoriesContainer.appendChild(listItem);

        // Add the category to the select dropdown in the modal
        const categoryOption = document.createElement("option");
        categoryOption.value = category.id;
        categoryOption.textContent = category.name;
        document.querySelector('.categories-addWork').appendChild(categoryOption);
      });

      // A button to show all projects
      const allButton = document.createElement("button");
      allButton.innerText = "Tous";
      allButton.classList.add("btn", "btn-active");
      allButton.dataset.category = 0;
      allButton.addEventListener("click", () => filterWorks(0));
      const allListItem = document.createElement("li");
      allListItem.appendChild(allButton);
      categoriesContainer.prepend(allListItem);

      // Filter works to make sure the selected filter is highlighted in green
      const buttons = document.querySelectorAll(".btn");
      // to add if buttons 
      if(buttons){
        buttons.forEach((item) => {
        item.addEventListener("click", (e) => {
          for (const btn of buttons) {
            btn.classList.remove("btn-active");
          }

          e.target.classList.toggle("btn-active");
          filterWorks(e.target.dataset.category);
        });
      });
    }} else {
      console.error("Failed to fetch categories");
    }
  } catch (error) {
    console.error("An error occurred while fetching categories:", error);
  }
}

// calling the function
showCategories();

async function deleteWork(id) {
  try {
      const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?");
      if (!isConfirmed) return;

      const resultFetch = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

      if (resultFetch.ok) {
          // Delete the figure from the gallery and the modal
          document.querySelectorAll(`figure[data-id="${id}"]`).forEach(item => {
              item.parentNode.removeChild(item);
          });
      } else {
          console.log(`Failed to delete work with id ${id}. Status: ${resultFetch.statusText}`);
      }
  } catch (error) {
      console.error("An error occurred while deleting the work:", error);
  }
}


function filterWorks(category) {
  // Loop through each figure element in the gallery
  for (const figure of document
    .querySelector(".gallery")
    .getElementsByTagName("figure")) {
    // Show or hide the figure based on its category
    if (category == figure.dataset.category || category == 0) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  }
}


function showPhotoGallery() {
  // Hide back arrow
  const modalComeback = document.querySelector('.modal-comeback');
  if(modalComeback){
    modalComeback.style.visibility = 'hidden';
  }

  // Hide the add work form in the modal
  // document.querySelector('.modal-addWork').style.display = 'none';

  const modalAddWork = document.querySelector('.modal-addWork');
  if(modalAddWork){
    modalAddWork.style.display = 'none';
  }

  // Show the gallery in the modal
  // document.querySelector('.modal-gallery').style.display = 'grid';
  const modalGallery = document.querySelector('.modal-gallery');
  if(modalGallery){
    modalGallery.style.display = 'grid';
  }

  // Show the modal bottom button
  // document.querySelector('.modal-bottom-btn').style.display = 'flex';

  const modalBottomBtn = document.querySelector('.modal-bottom-btn');
  if(modalBottomBtn){
    modalBottomBtn.style.display = 'flex';
  }

}

// call the function 
showPhotoGallery();

// add work

async function addWork() {
  try {
      const picture = document.querySelector('.img-addWork').files[0];
      const title = document.querySelector('.title-addWork');
      const category = document.querySelector('.categories-addWork');
      
      if(picture.name <= 0 || (!['image/jpeg', 'image/png', 'image/jpg'].includes(picture.type))) {
          return alert("L'image n'est pas sélectionné ou son format est incorrect.");
      }
      if(title.value.length <= 0) {
          return alert("Veuillez entrer un titre.");
      }
      if(category.value.length <= 0) {
          return alert("Veuillez sélectionner une catégorie.");
      }

      const formData = new FormData(document.getElementById('addWork-form'));
      
      const response = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
      })
      if(response.ok) {
          showPhotoGallery();

          const data = await response.json();
          showWork(data)
      }
      else {
          console.log("Erreur lors de la création du projet.");
      }
  }
  catch(error) {
      console.log(error);
  }
}


// when the user login
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem("token") !== null;

  if (isLoggedIn) {
      // Show the edit button
      // document.querySelector(".edit-mode").style.display = "flex";
      const editMode = document.querySelector(".edit-mode");
      if(editMode){
        editMode.style.display = "flex";
      };

      // document.querySelector(".edit-btn").style.display = "inline-flex";
      const editBttn = document.querySelector(".edi§t-btn");
      if(editBttn){
        editBttn.style.display = "inline-flex";
      }

      // Change the login text to logout
      const linkLoginBtn = document.querySelector(".link-login");
      linkLoginBtn.innerHTML = "logout";
      linkLoginBtn.href = "#";

      // Logging out
      linkLoginBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          window.location = "index.html";
      });

      // Hide the filter buttons
      // document.querySelector(".filter").style.display = "none";

      const filter = document.querySelector(".filter");
      if(filter){
        filter.style.display = "none";
      }


      // Show buttons if the user is logged in
      const editBtn = document.querySelectorAll(".edit-btn");
      editBtn.forEach((item) => {
          item.style.display = "inline-flex";
      });

      // Show the modal (Step One)
      editBtn.forEach((item) => {
          item.addEventListener("click", (e) => {
              e.preventDefault();
              document.querySelector(".modal-container").style.display = "flex";
              showPhotoGallery();
          });
      });

      // Show modal add work (Step Two)
      document.querySelector(".btn-addWork").addEventListener("click", (e) => {
          e.preventDefault();
          initializeAddWorkForm();
      });

      // Show modal gallery (back to Step One)
      document.querySelector(".modal-comeback").addEventListener("click", (e) => {
          e.preventDefault();
          showPhotoGallery();
      });

      // Closing the modal by clicking on the cross
      document.querySelector(".modal-close").addEventListener("click", (e) => {
          e.preventDefault();
          document.querySelector(".modal-container").style.display = "none";
      });

      // Closing the modal by clicking outside it
      const modalContainer = document.querySelector(".modal-container");
      modalContainer.addEventListener("click", (e) => {
          if (e.target.classList.contains("modal-container")) {
              modalContainer.style.display = "none";
          }
      });

      // Listen for changes in the file input for the upload work
      const uploadWorkForm = document.querySelector('.upload-work-form');
      uploadWorkForm.addEventListener('change', (e) => {
          // Hide the upload work form
          uploadWorkForm.style.display = 'none';

          // Show the upload work img
          const uploadWorkImg = document.querySelector('.upload-work-img');
          uploadWorkImg.style.display = 'flex';

          // Clear previous image
          uploadWorkImg.innerHTML = '';

          // Add the current image file
          const imgElement = document.createElement("img");
          imgElement.src = URL.createObjectURL(e.target.files[0]);
          imgElement.alt = e.target.files[0].name;
          imgElement.classList.add("current-img-upload");

          uploadWorkImg.appendChild(imgElement);
      });

      // Check if all inputs are filled to enable the submit button
      document.getElementById('addWork-form').addEventListener('input', () => {
          const isFormValid = document.querySelector('.title-addWork').value.length > 0 &&
          document.querySelector('.img-addWork').files.length > 0 &&
          document.querySelector('.categories-addWork').value.length > 0;

          toggleSubmitButton(isFormValid);
      });

      // Submit the work
      document.getElementById('addWork-form').addEventListener('submit', (e) => {
          e.preventDefault();
          addWork();
      });
  }

  function showPhotoGallery() {
      document.querySelector('.modal-comeback').style.visibility = 'hidden';
      toggleVisibility(".modal-gallery-step-one", true);
      toggleVisibility(".modal-gallery-step-two", false);
  }

  function initializeAddWorkForm() {
      document.querySelector('.modal-comeback').style.visibility = "visible";
      toggleVisibility(".modal-gallery-step-one", false);
      toggleVisibility(".modal-gallery-step-two", true);
      resetFormFields();
      toggleSubmitButton(false);
  }

  function toggleVisibility(selector, shouldShow) {
      const element = document.querySelector(selector);
      element.style.display = shouldShow ? "block" : "none";
  }

  function resetFormFields() {
      document.querySelector(".title-addWork").value = "";
      document.querySelector(".img-addWork").value = "";
      document.querySelector(".categories-addWork").selectedIndex = 0;
      document.querySelector(".upload-work-img").style.display = "none";
      document.querySelector(".upload-work-form").style.display = "flex";
  }

  function toggleSubmitButton(isActive) {
      const submitBtn = document.querySelector(".btn-submit-work");
      if (isActive) {
          submitBtn.classList.remove("inactive");
      } else {
          submitBtn.classList.add("inactive");
      }
  }
});
