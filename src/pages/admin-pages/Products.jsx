import ContentHeader from "../../components/content-header/ContentHeader";


const Products =()=>{//recordar que los <></> iniciales, son un fragmento, lo cual exige react para declarar múltiples sentencias
    return(
        <>
        <ContentHeader
        title={"Productos"}
        paragraph={"Lorem Ipsum de productos jsjs"}></ContentHeader>
        </>
    );
};

export default Products;