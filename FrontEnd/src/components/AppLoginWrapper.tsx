import { useRef, useState } from "react";
import App from "../App";
import useRedundantStorage from "../Hooks/useRedudantStorage";
import "../style/AppLoginWrapper.css";


interface AppLoginWrapperProps {

}

const AppLoginWrapper:React.FC<AppLoginWrapperProps> = ():JSX.Element => {
    
    const [isLoggedIn, setLoggedIn] = useRedundantStorage<string>("loggedIn", "false", undefined, undefined, false)
    const [errorMessage, setErrorMessage] = useState<string|undefined>();

    const PasswordRef = useRef<HTMLInputElement>(null);


    return <>
        {isLoggedIn=="true" && <App></App>}
        {isLoggedIn!="true" && <div className="LoginWrapper">
            <div className="LoginBackground"></div>
            <div className="LoginFields">
                <h1 className="Timer LoginHeader">Login</h1>
                
                <input className="PasswordField" type="password" ref={PasswordRef}></input>
                <h2 className="LoginError">{errorMessage}</h2>
                <button className="PasswordSubmit" onClick={() => {
                    if (!PasswordRef.current) return;
                    const currentInput = PasswordRef.current?.value;

                    if (currentInput == "170706030206") setLoggedIn("true")
                    else setErrorMessage("Mauvais mot de passe")

                }}>Submit</button>
            </div>
        </div>}
    </>
}

export default AppLoginWrapper;