'use strict';
import { loginService } from "../services/login-service.js";

const userSession = true
window.addEventListener('load', () => {
    userSession ? renderLogin() : renderDashboard()
})


function renderLogin() {
    console.log('login',)
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

}

async function onLogin() {
    const elUsername = document.querySelector('.login-form .username-inp')
    const elPassword = document.querySelector('.login-form .password-inp')
    let user
    let users

    const userDetail = {
        username: elUsername.value,
        password: elPassword.value,
    }
    try {
        user = await loginService.handleLogin(userDetail)
        users = await loginService.getUsers()
        console.log('user?', user)
        let strHTML = '';
        if (!user) return
        users.forEach(user => {
            strHTML += `<p>${user.username}</p>`
        });
        document.querySelector('.login').innerHTML = ''
        document.querySelector('.dashboard-list').innerHTML = strHTML
        sessionStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
        console.log('ERR:', error)
    }


}
// async function logout() {
//     await httpService.post('auth/logout');
//     sessionStorage.clear();
// }
// function _handleLogin(user) {
//     sessionStorage.setItem('user', JSON.stringify(user))
//     return user;
// }