import { loginService } from "../services/login-service.js";

let gUsers;
let gCurrUser = sessionStorage.user ? JSON.parse(sessionStorage.user) : null;
let socket = io('/', { transports: ['websocket'] });

window.addEventListener('load', async () => {
    gUsers = await loginService.getUsers()

    socket.on('update', async ({ userAgent, address }) => {
        gCurrUser = sessionStorage.user ? JSON.parse(sessionStorage.user) : null;
        const user = {
            ...gCurrUser,
            userAgent,
            isOnline: true,
            ip: address,
        }
        loginService.updateUser(user)
        gUsers = await loginService.getUsers()
        renderDashboard()
    })

    if (sessionStorage.user) socket.emit('renderDashboard')
    else renderLogin()

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
        socket.emit('renderDashboard')
    } catch (error) {
        console.log('ERR:', error)
    }
}

function renderLogin() {
    gCurrUser = null
    showHideLogin(true)
    showHideDashboard(false)
    document.querySelector('.curr-page').innerText = 'Login'
    document.querySelector('.login').innerHTML = `
    <form class="login-form flex justify-center align-center col main-container">
        <div class="field-container flex align-center w100">
            <label for="username">Username</label>
            <input value="admin" class="username-inp w100" type="text" id="username" name="username" required>
        </div>
        <div class="field-container flex align-center w100">
            <label for="password">Password</label>
            <input value="1" class="password-inp w100" type="password" id="password" name="password" required>
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
    showHideLogin(false)
    showHideDashboard(true)
    document.querySelector('.curr-page').innerText = 'Dashboard'
    document.querySelector('.nav-action').innerHTML = `
    <h2>Welcome, ${gCurrUser.username}.</h2>
    <button class="signout-btn">Sign out</button>
    `;
    document.querySelector('.signout-btn').addEventListener('click', onLogOut)
    let strHTML = `<div class="user-list-grid main-container">`
    gUsers.forEach(user => {
        strHTML += `
        <div class="user-preview"> 
        <header class="flex align-center">
        ${user.isOnline ? '<div class="circle online"></div>' : '<div class="circle offline"></div>'}
        <h3>${user.username}</h3>
        </header>
        <div class="user-preview-container flex space-between col">
        <p> <span class="bold">Last logged at:</span> ${_timeConverter(user.lastLoginAt)}</p>
        <p> <span class="bold">IP - </span> ${user.ip}</p>
        <button class="more-details-btn">More Details</button>
        </div>
        </div>
        `

    })
    strHTML += '</div>'
    document.querySelector('.user-list').innerHTML = strHTML
    for (let i = 0; i < document.querySelectorAll('.more-details-btn').length; i++) {
        document.querySelectorAll('.more-details-btn')[i].addEventListener('click', () => {
            onMoreDetails(gUsers[i].id)
        })
    }
}

function onMoreDetails(userId) {
    const user = gUsers.find(user => user.id === userId)
    document.querySelector('.user-detail-modal').innerHTML = `
    <div class="modal-header flex justify-center align-center w100">
    <i class="close-btn fas fa-times absolute"></i>
    <h1>${user.username} Details</h1>
    </div>
    <div class="user-modal-container flex space-between col w100">
    <p> <span class="bold">User agent:</span> ${user.userAgent}</p>
    <p> <span class="bold">Logins count:</span> ${user.loginCount}</p>
    </div>
    `
    toggleModal()
}
function toggleModal() {
    const elScreenWrapper = document.querySelector('.screen-wrapper')
    const elCloseBtn = document.querySelector('.modal-header .close-btn')

    elScreenWrapper.classList.toggle("show")
    document.querySelector('.user-detail-modal').classList.toggle("show")

    elScreenWrapper.onclick = toggleModal
    elCloseBtn.onclick = toggleModal
}
function showHideLogin(toShow) {
    const elLogin = document.querySelector('.login')
    if (toShow) {
        elLogin.classList.remove('hide')
        elLogin.classList.add('flex')
        return
    }
    elLogin.classList.remove('flex')
    elLogin.classList.add('hide')
}
function showHideDashboard(toShow) {
    const elUserList = document.querySelector('.user-list')
    if (toShow) {
        elUserList.classList.add('flex')
        elUserList.classList.remove('hide')
        return
    }
    elUserList.classList.remove('flex')
    elUserList.classList.add('hide')
}

async function onLogOut() {
    await socket.emit('logout')
    const user = {
        ...gCurrUser,
        isOnline: false,
    }
    loginService.updateUser(user)
    renderLogin()
    loginService.handleLogOut()
}

function _timeConverter(UNIX_timestamp) {
    const currDate = new Date(UNIX_timestamp);
    const year = currDate.getFullYear();
    const month = currDate.getMonth() + 1;
    const date = currDate.getDate();
    const hour = currDate.getHours();
    const min = currDate.getMinutes();
    const time = date + '/' + month + '/' + year + ' ' + hour + ':' + min;
    return time;
}