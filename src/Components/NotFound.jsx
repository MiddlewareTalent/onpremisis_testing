import NotFoundImg from "../Assets/NotFound.png"

const NotFound=()=>{
    return (
        <div className="flex flex-col justify-center items-center">
            <img src={NotFoundImg} alt="Page Not Found"/>
        </div>
    )
}

export default NotFound;