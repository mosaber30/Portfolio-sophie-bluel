
/* http://localhost:5678/api/works
http://localhost:5678/api/categories
http://localhost:5678/api-docs/#/default/get_works
*/

async function showWorks() {
    try {
        // Fetch data from the API
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        // Check if the response is successful
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            // Select the gallery element where the works will be displayed
            const gallery = document.querySelector('.gallery');

            // Loop through each work item in the fetched data
            data.forEach(workItem => {
                // Create a new figure element for each work item
                const figure = document.createElement('figure');
                figure.classList.add('project');
                figure.setAttribute('data-category', workItem.categoryId);
                figure.setAttribute('data-id', workItem.userId);

                // Create an img element and set its src and alt attributes
                const img = document.createElement('img');
                img.src = workItem.imageUrl;
                img.alt = workItem.title;
                figure.appendChild(img);

                // Create a figcaption element and set its text content
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = workItem.title;
                figure.appendChild(figcaption);

                // Append the figure element to the gallery
                gallery.appendChild(figure);
            });
        } else {
            throw new Error('Failed to fetch works: ' + response.statusText);
        }
    } catch (error) {
        throw new Error('Fetch did not work out due to: ' + error.message);
    }
};

// calling the function 
showWorks();

async function showCategories() {
    // Selecting the container where the category buttons will be display
    const categoriesContainer = document.querySelector('.btn-list');


    try {
        // Fetch data from the API
        const response = await fetch('http://localhost:5678/api/categories');
        if (response.ok) {
            const categories = await response.json();

        // Loop through each category in the fetched data
            categories.forEach(category => {
                // Createing a new list item and button element for each category
                const listItem = document.createElement('li');
                const button = document.createElement('button');
                button.innerText = category.name;
                button.classList.add('btn');
                button.dataset.category = category.id;
                button.addEventListener('click', () => filterWorks(category.id));
                listItem.appendChild(button);
                categoriesContainer.appendChild(listItem);
            });

            // a button to show all projects
            const allButton = document.createElement('button');
            allButton.innerText = 'Tous';
            allButton.classList.add('btn', 'btn-active');
            allButton.dataset.category = 0;
            allButton.addEventListener('click', () => filterWorks(0));
            const allListItem = document.createElement('li');
            allListItem.appendChild(allButton);
            categoriesContainer.prepend(allListItem);

            // Filter works to mak sure the filter selected in highlighted in green
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(item => {
            item.addEventListener('click', (e) => {
                for (const btn of buttons) {
                    btn.classList.remove('btn-active');
                }
            
                e.target.classList.toggle("btn-active");
                filterWorks(e.target.dataset.category);
            })
        })

        } else {
            console.error('Failed to fetch categories');
        }
    } catch (error) {
        console.error('An error occurred while fetching categories:', error);
    }
}

// calling the function 
showCategories();


function filterWorks(category) {
    // Loop through each figure element in the gallery
    for (const figure of document.querySelector('.gallery').getElementsByTagName("figure")) {
        // Show or hide the figure based on its category
        if (category == figure.dataset.category || category == 0) {
            figure.style.display = "block";
        } else {
            figure.style.display = "none";
        }
    }
}


// when the user login 
if (localStorage.getItem('token') !== null) {
    //show the edit button
    document.querySelector('.edit-mode').style.display = 'flex';
    document.querySelector('.edit-btn').style.display = 'inline-flex';

    // change the login text to logout 
    const linkLoginBtn = document.querySelector('.link-login');
    linkLoginBtn.innerHTML = 'Logout';
    linkLoginBtn.href = '#'

    // logging out 
    linkLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location = 'index.html'
    })

    //hide the filter buttons 
    document.querySelector('.filter').style.display = 'none';
}