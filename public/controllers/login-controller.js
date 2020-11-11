'use strict';
import { loginService } from "../services/login-service.js";
let gUsers;
let gCurrUser = sessionStorage.user ? JSON.parse(sessionStorage.user) : '';

window.addEventListener('load', async () => {
    const socket = io('/');

    gUsers = await loginService.getUsers()
    sessionStorage.user ? renderDashboard() : renderLogin()
})

async function onLogin() {
    const elUsername = document.querySelector('.login-form .username-inp')
    const elPassword = document.querySelector('.login-form .password-inp')
    let user
    const userDetail = {
        username: elUsername.value,
        password: elPassword.value,
    }
    try {
        user = await loginService.handleLogin(userDetail)
        if (!user) return
        sessionStorage.setItem('user', JSON.stringify(user))
        gCurrUser = JSON.parse(sessionStorage.user)
        console.log('session:', gCurrUser)
        clearLogin()
        renderDashboard()
    } catch (error) {
        console.log('ERR:', error)
    }
}

function renderLogin() {
    clearDashboard()
    document.querySelector('.curr-page').innerText = 'Login'
    document.querySelector('.login').innerHTML = `
    <form class="login-form flex justify-center align-center col main-container">
        <div class="field-container flex align-center w100">
            <label for="">Username</label>
            <input class="username-inp w100" type="text" name="username">
        </div>
        <div class="field-container flex align-center w100">
            <label for="">Password</label>
            <input class="password-inp w100" type="password" name="password">
        </div>
        <button>Login</button>
    </form>
    
    `
    document.querySelector('.login-form').addEventListener('submit', (ev) => {
        ev.preventDefault()
        onLogin()
    });
}
function renderDashboard() {
    document.querySelector('.curr-page').innerText = 'Dashboard'
    document.querySelector('.nav-action').innerHTML = `
    <h2>Welcome, ${gCurrUser.username}.</h2>
    <button class="signout-btn">Sign out</button>
    `;
    document.querySelector('.signout-btn').addEventListener('click', onLogOut)
    let strHTML = ``
    gUsers.forEach(user => {
        strHTML += `<h2>${user.username}</h2>`
    })
    document.querySelector('.dashboard-list').innerHTML = strHTML
}

function clearLogin() {
    document.querySelector('.login').classList.remove('flex')
    document.querySelector('.login').classList.add('hide')
}
function clearDashboard() {
    document.querySelector('.dashboard-list').innerHTML = ''
}

function onLogOut() {
    loginService.handleLogOut()

}