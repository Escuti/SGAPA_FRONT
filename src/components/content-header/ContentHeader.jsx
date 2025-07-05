import "./ContentHeader.css"

const ContentHeader =({title,paragraph})=>{//es necesario usar className en react, pues class es reservado a css
    return(
        <div className="content-header">
            <h1>{title}</h1>
            <p>{paragraph}</p>
        </div>
    );
};

export default ContentHeader;