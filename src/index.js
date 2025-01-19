 import { createRoot } from "react-dom/client";
 import ToDoList from "./home";


 let root = createRoot(document.getElementById("root"));


 root.render(
    <>
    <div style={{display: "flex", justifyContent: "space-around"}}>
       <ToDoList />
    </div>
    
    </>
 );
