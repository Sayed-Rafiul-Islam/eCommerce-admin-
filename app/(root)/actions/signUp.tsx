"use server"

export const signUp = async (email: string, password: string, userName: string) => {
    const res = await fetch(`http://localhost:5000/createUser`, {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({email,password,userName}),
        cache : "no-store"
    }) 
    const {accessToken} = await res.json()
    return {accessToken,status : res.status}

}
