/* step 1: link scrip.js to index html 
step 2: in script.js there is a hello world console log 
step 3: fetch API GET of the route of categories
step 4: save the data form the API in a variable . name it data (or whatever i like)
step 5: console.log the data (to have all the info)
step 6: console.log the 5th work of data 
step 7: console.log show only the title of the 5th work  
*/

/* http://localhost:5678/api/works
http://localhost:5678/api/categories
http://localhost:5678/api-docs/#/default/get_works
*/

async function showArchitectProjects() {
    try {
        // Step 1: Fetch data from the API
        const response = await fetch('http://localhost:5678/api/categories', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        // Step 2: Parse the response to JSON
        const projects = await response.json();

        // Step 3: Add each project to the gallery
        const gallery = document.querySelector('.gallery');

        projects.forEach(project => {
            const projectElement = `
                <div class="project-card">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <img src="${project.imageURL}" alt="${project.name}">
                </div>
            `;
            gallery.insertAdjacentHTML('beforeend', projectElement);
        });
        
    } catch (error) {
        console.error('Error fetching architect projects:', error);
        alert("An error occurred while retrieving the architect's projects.");
    }
}

// Call the function to execute it
showArchitectProjects();
