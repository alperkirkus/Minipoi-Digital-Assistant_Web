import React,{useState,useEffect} from 'react'
import './App.css';
import Panel from './components/Panel'
import Login from './components/Login'

function App() {

  const [user,setUser] = useState(null)

  //get user info
  useEffect(() => {
 
    setUser(JSON.parse(localStorage.getItem("user")))
  }, [])
  return (
 <>
     {
       user ?(
        <Panel  setUser ={setUser}/>
       ):(
        <Login setUser ={setUser}/>
       )

     }
    
   </>
  );
}

export default App;
