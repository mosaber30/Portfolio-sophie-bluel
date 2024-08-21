const form = document.getElementById('form-login');
const errorLogin = document.getElementById('error-login');

form.addEventListener('focusin', (event) => {
    if (event.target.tagName === 'INPUT') {
        errorLogin.style.visibility = 'hidden';
    }
});
// addEventListener listen to the changes of inputs to delete message error 
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log(email);
    console.log(password);


    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if(response.ok){
            const data = await response.json();
            console.log(data);

            // new lines of code to add the token + Redirect to the home page
            localStorage.setItem('token', data.token);
            window.location = 'index.html'
            return
        } else {
            document.getElementById('error-login').style.visibility = 'visible';
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
});



