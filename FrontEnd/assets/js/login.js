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
    }
});



/*
document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    alert("hey you clicked");
});



const form = document.querySelector(".form--login");

form.addEventListener('submit', async (event) => {
    event.preventDefault();
   
    const data = new FormData(form);
    console.log(data);

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password')
        })
    });
});

if(response.ok) {
    const result = await response.json();
    console.log(result);
} else {
    throw new Error('wrong username or password')
}
    */