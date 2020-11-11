'use strict';

export const loginService = {
    handleLogin,
    getUsers
}

async function getUsers() {
    const res = await fetch("http://localhost:3030/api/user")
    const users = await res.json()
    return users
}
async function handleLogin(user) {
    try {
        const res = await fetch("http://localhost:3030/api/auth/login", {
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

