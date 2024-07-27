// console.log("hello world!");

const form = document.getElementById('login-btn');

form.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log(email);
    console.log(password);

    // alert('you submitted your email and password');

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('wrong password, maybe?');
        // can i use     throw new Error('wrong username or password')? //
    }
});


