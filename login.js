const card = document.querySelector(".card");
const forgot = document.querySelector("#forgot");
const signup = document.querySelector("#signup");
const loginBack = document.querySelectorAll(".back-login");



forgot.addEventListener("click", function(e) {
    e.preventDefault();

    card.classList.remove("show-signup");
    card.classList.add("show-forgot");

    card.style.transform = "rotateY(180deg)";
});



signup.addEventListener("click", function(e) {
    e.preventDefault();

    card.classList.remove("show-forgot");
    card.classList.add("show-signup");

    card.style.transform = "rotateY(180deg)";
});



loginBack.forEach(function(button) {
    button.addEventListener("click", function(e) {
        e.preventDefault();

        card.style.transform = "rotateY(0deg)";

        setTimeout(function() {
            card.classList.remove("show-forgot");
            card.classList.remove("show-signup");
        }, 800);
    });
});



const loginButton = document.querySelector("#login-btn");

loginButton.addEventListener("click", function() {

    const username =document.querySelector("#login-username").value;
    const password =document.querySelector("#login-password").value;

    const savedData = localStorage.getItem("user");

    if (!savedData){
        alert("アカウントが登録されていません！");
        return;
    }

    const user = JSON.parse(savedData);

    if(
        username === user.username &&
        password === user.password
    )
    {
        localStorage.setItem(
            "currentUser",
            user.username
        );
        
        window.location.href = "money.html";    
    }else{
        alert("ユーザ名またはパスワードが違います。");
    }

    
});



const signupPage = document.querySelector(".signup-page");
const signupButton = signupPage.querySelector(".sign-btn");

signupButton.addEventListener("click", function() {

    const username = signupPage.querySelector(
        'input[type="text"]'
    ).value;

    const email = signupPage.querySelector(
        'input[type="email"]'
    ).value;

    const password = signupPage.querySelector(
        'input[type="password"]'
    ).value;

    const user = {
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("アカウント登録ができました!!");
});
