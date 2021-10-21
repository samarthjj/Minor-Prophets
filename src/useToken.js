
//tutorial from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

const {useState} = require("react");

export default function useToken() {
    //gets user token from session storage, if it exists
    function getToken() {
        // const tokenString = sessionStorage.getItem('token');
        const tokenString = document.cookie.split("=")[1]
        // const userToken = JSON.parse(tokenString);
        const userToken = tokenString
        // console.log(JSON.stringify(userToken))
        // console.log(userToken?.token)
        console.log(userToken)
        return userToken
        // return userToken?.token
    }

    const [token, setToken] = useState(getToken());

    // If a user's token is being set up, save it in session storage
    const saveToken = userToken => {
        // sessionStorage.setItem('token', JSON.stringify(userToken));
        document.cookie = `token=${JSON.stringify(userToken.token)}`
        setToken(userToken.token);
        // console.log(JSON.stringify(userToken))
    };

    return {
        token,
        setToken: saveToken
    }
}