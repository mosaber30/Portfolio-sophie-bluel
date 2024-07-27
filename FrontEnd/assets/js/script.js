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

// filter for the categories //
const figures = document.querySelector('.gallery').getElementsByTagName('figure');
for (let i = 0; i < figures.length; i++) {
    const figure = figures[i];
    figure.style.display = category == figure.dataset.category || category == 0 ? "block" : "none";
}