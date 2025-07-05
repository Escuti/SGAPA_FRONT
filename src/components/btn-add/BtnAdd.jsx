import "./BtnAdd.css"

function BtnAdd({textButton, onClick}){
    return(
        <button className="btn-add" onClick={onClick}>
            <span className="material-symbols-outlined">add</span>{textButton}
        </button>
    )
}

export default BtnAdd;