import "./ContentHeader.css"

const ContentHeader = ({ title, paragraph }) => { //Es necesario usar className en react, ya que class solo es de css
    return (
        <div className="content-header">
            <h1 className="bubble-title">{title}</h1>
            <p>{paragraph}</p>
        </div>
    );
};

export default ContentHeader;