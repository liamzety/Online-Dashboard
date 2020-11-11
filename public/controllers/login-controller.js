'use strict';
import { loginService } from "../services/login-service.js";

let gUsers;
window.addEventListener('load', async () => {
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
        console.log('session:', sessionStorage.user)
        if (!user) return
        clearLogin()
        renderDashboard()
        sessionStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
        console.log('ERR:', error)
    }
}

function renderLogin() {
    clearDashboard()
    document.querySelector('.login').innerHTML = `
    <form class="login-form">
        <label for="">Login</label>
        <label for="">Username:</label>
        <input class="username-inp" type="text" name="username">
        <label for="">Password:</label>
        <input class="password-inp" type="password" name="password">
        <button>Submit</button>
    </form>
    
    `
    document.querySelector('.login-form').addEventListener('submit', (ev) => {
        ev.preventDefault()
        onLogin()
    });
}
function renderDashboard() {
    document.querySelector('.signout-anch').addEventListener('click', onSignOut)
    let strHTML = ''
    gUsers.forEach(user => {
        strHTML += `<h2>${user.username}</h2>`
    })
    document.querySelector('.dashboard-list').innerHTML = strHTML
}

function clearLogin() {
    document.querySelector('.login').innerHTML = ''
}
function clearDashboard() {
    document.querySelector('.dashboard-list').innerHTML = ''
}

function onSignOut() {
    sessionStorage.clear()
    window.location.replace('/');
}