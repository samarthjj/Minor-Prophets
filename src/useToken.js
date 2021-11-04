
//tutorial from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

const {useState} = require("react");

export default function useToken() {
    //gets user token from session storage, if it exists
    function getToken() {
        const tokenString = document.cookie.split("=")[1]
        const userToken = tokenString
        console.log(userToken)
        return userToken
    }

    const [token, setToken] = useState(getToken());

    // If a user's token is being set up, save it in session storage
    const saveToken = userToken => {
        // setting cookie attributes (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
        document.cookie = `token=${JSON.stringify(userToken.token)}; SameSite=Strict`
        setToken(userToken.token);
    };

    return {
        token,
        setToken: saveToken
    }
}