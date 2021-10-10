//tutorial from https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

const {useState} = require("react");

export default function useToken() {
    function getToken() {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        // console.log(JSON.stringify(userToken))
        console.log(userToken?.token)
        return userToken?.token
    }

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        // console.log(JSON.stringify(userToken))
    };

    return {
        token,
        setToken: saveToken
    }
}