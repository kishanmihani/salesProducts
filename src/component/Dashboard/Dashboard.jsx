import React,{ useEffect} from 'react';
import './Dashboard.css';
import { CgSearch } from "react-icons/cg";
import { FaHandsClapping } from "react-icons/fa6";
import { RxHamburgerMenu} from "react-icons/rx";
import { Outlet} from "react-router-dom";
import Sidbar from './Sidbar/Sidbar';
import ErrorBoundary from '../ErrorBoundary';

function Dasboard(){
//   const navigate = useNavigate();
  const UserInfo=[
    {"userName":localStorage.getItem('Username'),"userImg":localStorage.getItem('UserImg')}
  ]
  const CheckUserInfo=UserInfo[0].userImg === null && UserInfo[0].userName === null ;
  useEffect(() => {
   if(CheckUserInfo){
    localStorage.setItem('Username','Kishan')
   }
  },[])
  

	return (
      <ErrorBoundary>
        
	        <div id="page-Container" >

	             <div id="left-container" className='rounded m-1'>
                  <Sidbar message={UserInfo}></Sidbar>
              </div>
              
        
	             <div id="right-container" className='overflow-auto custom-scrollbar-css'>
                  <header id="first-header">  
                   <div id="profile-name">
                   <button onClick={()=> document.getElementById('left-container').style='display:block'} id="menu-button"><RxHamburgerMenu /></button>
                   <h3 className='mb-0'> Hello {UserInfo[0].userName} <span id="handicon"><FaHandsClapping /></span></h3>
                   </div>

                   <div id="input-container" className='border-0 '>
                   <span id="search-icon " className='position-absolute text-secondary '><CgSearch /></span>
                   <input type='text' id="input-search" className='form-control' placeholder='search'/> 
                   </div>
                  </header>
                  
                  <section className='Dashoard-routdiv'>
                  <Outlet></Outlet>
                  </section>
                  
	             </div>
	        </div>
        </ErrorBoundary>
	       ) 

}

export default React.memo(Dasboard);
