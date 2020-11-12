'use strict';
export const loginService = {
    handleLogin,
    handleLogOut,
    getUsers,
    updateUser
}
const BASE_URL = "/"

async function getUsers() {
    const res = await fetch(`${BASE_URL}api/user`)
    return await res.json()
}
async function handleLogin(user) {
    try {
        const res = await fetch(`${BASE_URL}api/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json , text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if (res.status !== 200) throw new Error()
        return await res.json()
    } catch (error) {
        console.log('Login unsuccessful')
    }

}
async function handleLogOut() {
    sessionStorage.clear()
    window.location.replace('/');
}
async function updateUser(user) {
    try {
        const res = await fetch(`${BASE_URL}api/user/${user.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json , text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if (res.status !== 200) throw new Error()
        return await res.json()
    } catch (error) {
        console.log('ERR', error)
    }

}
