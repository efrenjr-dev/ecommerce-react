import { useNavigate } from "react-router-dom";

import "./Modal.scss";

function Modal({ children }) {
    const navigate = useNavigate();

    function closeHandler() {
        navigate("..");
    }

    return (
        <>
            <div className="backdrop" onClick={closeHandler} />
            <dialog open className="modalDialog modalFullMobile">
                {children}
            </dialog>
        </>
    );
}

export default Modal;
