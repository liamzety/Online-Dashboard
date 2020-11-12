import { loginService } from "../services/login-service.js";

let gUsers;
let gCurrUser = sessionStorage.user ? JSON.parse(sessionStorage.user) : null;
// //localhost:3030
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
    if (sessionStorage.user) {
        socket.emit('renderDashboard')
    } else renderLogin()

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
            <input class="username-inp w100" type="text" id="username" name="username" required>
        </div>
        <div class="field-container flex align-center w100">
            <label for="password">Password</label>
            <input class="password-inp w100" type="password" id="password" name="password" required>
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
    let strHTML = ``
    gUsers.forEach(user => {
        strHTML += `
        <div class="user-preview"> 
        <h3>${user.username}</h3>
        <h1>${user.isOnline ? 'online' : 'offline'}</h1>
        <p>Last logged at: ${_timeConverter(user.lastLoginAt)}</p>
        <p>IP: ${user.ip}</p>
        <button class="more-details-btn">More Details</button>
        </div>
        `

    })
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
    <p>User agent: ${user.userAgent}</p>
    <p>Logins count: ${user.loginCount}</p>
    <button>Close</button>
    `
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

function onLogOut() {
    socket.emit('logout')
    const user = {
        ...gCurrUser,
        isOnline: false,
    }
    loginService.updateUser(user)
    loginService.handleLogOut()
    renderLogin()
}

function _timeConverter(UNIX_timestamp) {
    const currDate = new Date(UNIX_timestamp);
    const year = currDate.getFullYear();
    const month = currDate.getMonth() + 1;
    const date = currDate.getDate();
    const hour = currDate.getHours();
    const min = currDate.getMinutes();
    const sec = currDate.getSeconds();
    const time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}