/* http://localhost:5678/api/works
http://localhost:5678/api/categories
http://localhost:5678/api-docs/#/default/get_works
*/
async function showWorks() {
  try {
    // Fetch data from the API
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Select the gallery element where the works will be displayed
      const gallery = document.querySelector(".gallery");

      // Loop through each work item in the fetched data
      data.forEach((workItem) => {
        // Create a new figure element for each work item
        const figure = document.createElement("figure");
        figure.classList.add("project");
        figure.setAttribute("data-category", workItem.categoryId);
        figure.setAttribute("data-id", workItem.id); // Corrected this line

        // Create an img element and set its src and alt attributes
        const img = document.createElement("img");
        img.src = workItem.imageUrl;
        img.alt = workItem.title;
        figure.appendChild(img);

        // Create a figcaption element and set its text content
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = workItem.title;
        figure.appendChild(figcaption);

        // Append the figure element to the gallery
        gallery.appendChild(figure);
      });

      // Showcasing the work in the modal
      const modalGallery = document.querySelector('.modal-gallery');

      // Loop through each work item in the fetched data
      data.forEach((workItem) => {
        // Create a new figure element for each work item
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", workItem.id);

        // Create an img element and set its src and alt attributes
        const img = document.createElement("img");
        img.src = workItem.imageUrl;
        img.alt = workItem.title;
        figure.appendChild(img);

        // Create a figcaption element and set its text content
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = "éditer";
        figure.appendChild(figcaption);

        // Create a button element with an img inside
        const button = document.createElement("button");
        button.classList.add("btn-del-icon");
        button.setAttribute("data-id", workItem.id);

        const buttonImg = document.createElement("img");
        buttonImg.src = "assets/icons/bin-icon.svg";
        buttonImg.alt = "Icône d'une corbeille";
        button.appendChild(buttonImg);

        figure.appendChild(button);

        // Append the figure element to the modal gallery
        modalGallery.appendChild(figure);
      });

      document.querySelectorAll('.btn-del-icon').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          deleteWork(item.getAttribute('data-id'));
        });
      });

    } else {
      throw new Error("Failed to fetch works: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Fetch did not work out due to: " + error.message);
  }
};

// calling the function
showWorks();

async function showCategories() {
  // Selecting the container where the category buttons will be display
  const categoriesContainer = document.querySelector(".btn-list");

  try {
    // Fetch data from the API
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.ok) {
      const categories = await response.json();

      // Loop through each category in the fetched data
      categories.forEach((category) => {
        // Createing a new list item and button element for each category
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        button.innerText = category.name;
        button.classList.add("btn");
        button.dataset.category = category.id;
        button.addEventListener("click", () => filterWorks(category.id));
        listItem.appendChild(button);
        categoriesContainer.appendChild(listItem);
      });

      // a button to show all projects
      const allButton = document.createElement("button");
      allButton.innerText = "Tous";
      allButton.classList.add("btn", "btn-active");
      allButton.dataset.category = 0;
      allButton.addEventListener("click", () => filterWorks(0));
      const allListItem = document.createElement("li");
      allListItem.appendChild(allButton);
      categoriesContainer.prepend(allListItem);

      // Filter works to mak sure the filter selected in highlighted in green
      const buttons = document.querySelectorAll(".btn");
      buttons.forEach((item) => {
        item.addEventListener("click", (e) => {
          for (const btn of buttons) {
            btn.classList.remove("btn-active");
          }

          e.target.classList.toggle("btn-active");
          filterWorks(e.target.dataset.category);
        });
      });
    } else {
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
    const resultFetch = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    });
    if(resultFetch.ok) {
      // Delete the figure from the gallery and delete the figure from the modal
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
  document.querySelector('.modal-comeback').style.visibility = 'hidden';

  // Update the title of the modal
  document.querySelector('.modal-title').innerHTML = 'Galerie photo';

  // Hide the add work form in the modal
  document.querySelector('.modal-addWork').style.display = 'none';

  // Show the gallery in the modal
  document.querySelector('.modal-gallery').style.display = 'grid';

  // Show the modal bottom button
  document.querySelector('.modal-bottom-btn').style.display = 'flex';

}

// call the function 
showPhotoGallery();


// when the user login
if (localStorage.getItem("token") !== null) {
  //show the edit button
  document.querySelector(".edit-mode").style.display = "flex";
  document.querySelector(".edit-btn").style.display = "inline-flex";

  // change the login text to logout
  const linkLoginBtn = document.querySelector(".link-login");
  linkLoginBtn.innerHTML = "logout";
  linkLoginBtn.href = "#";

  // logging out
  linkLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location = "index.html";
  });

  //hide the filter buttons
  document.querySelector(".filter").style.display = "none";

  // Show buttons if user is logged
  const editBtn = document.querySelectorAll(".edit-btn");
  editBtn.forEach((item) => {
    item.style.display = "inline-flex";
  });

  // Show the modal
  editBtn.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".modal-container").style.display = "flex";

      showPhotoGallery();
    });
  });

  // Show modal add work
  document.querySelector(".btn-addWork").addEventListener("click", (e) => {
    e.preventDefault();

    // Show back arrow
    document.querySelector(".modal-comeback").style.visibility = "visible";

    // Update the title of the modal
    document.querySelector(".modal-title").innerHTML = "Ajout photo";

    // Hide the gallery in the modal
    document.querySelector(".modal-gallery").style.display = "none";

    // Show the add work form in the modal
    document.querySelector(".modal-addWork").style.display = "block";

    // Hide the modal bottom button
    // not working well, need to find a solution 
    document.querySelector(".modal-bottom-btn").style.display = "none";

    // Hide the upload work img
    document.querySelector(".upload-work-img").style.display = "none";

    // Show the upload work form
    document.querySelector(".upload-work-form").style.display = "flex";

    // Change background submit input to grey
    document.querySelector(".btn-submit-work").style.backgroundColor =
      "rgb(167, 167, 167)";

    // Reset the title input
    document.querySelector(".title-addWork").value = "";

    // Reset image input element
    document.querySelector(".img-addWork").value = "";

    // Reset the select element
    document.querySelector(".categories-addWork").selectedIndex = 0;
  });

  // Show modal gallery
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
    if (e.target.classList.value == "modal-container")
      modalContainer.style.display = "none";
  });

}
