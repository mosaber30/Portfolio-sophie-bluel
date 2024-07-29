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



async function showWorks(){
    try{
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log(data[4].title); 
        } else {
            console.error('Failed to fetch works:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// console.log('hello')


async function showCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            console.log(data[4].title); 

            const gallery = document.querySelector('.gallery');
            data.forEach(workItem => {
                const figure = document.createElement('figure');
                figure.setAttribute('data-category', workItem.categoryId);
                figure.setAttribute('data-id', workItem.id);

                const img = document.createElement('img');
                img.src = workItem.imageUrl;
                img.alt = workItem.title;
                figure.appendChild(img);

                const figcaption = document.createElement('figcaption');
                figcaption.textContent = workItem.title;
                figure.appendChild(figcaption);

                gallery.appendChild(figure);
            });
        }
    } finally {
        
    }
}

showCategories();



// filter for the categories //
function filterWorks(category) {
    const figures = document.querySelector('.gallery').getElementsByTagName('figure');;
     for (let i = 0; i < figures.length; i++) {
         const figure = figures[i];
         figure.style.display = category == figure.dataset.category || category == 0 ? "block" : "none";
        }
    };
    
    filterWorks();