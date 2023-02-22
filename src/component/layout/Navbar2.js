import './Navbar2.css'
import { useNavigate } from 'react-router-dom';


export default function Navbar2(){

  const navigate = useNavigate()

  function onClickLogin(){
    navigate('/signin')
  }

  function onClickSignUp(){
    navigate('/signup')
  }

  function onClickHome(){
    navigate('/study')
  }
  

  return(
      
    <div className='navbar2'>
      <header class="p-3 text-bg-white">
        <div class="container">
          <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="nav-link px-2 text-secondary home" onClick={onClickHome}>Home</li>
              <li className="nav-link px-2 text-dark">Features</li>
              <li className="nav-link px-2 text-dark">Pricing</li>
              <li className="nav-link px-2 text-dark">FAQs</li>
              <li className="nav-link px-2 text-dark">About</li>
            </ul>

            <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
              <input type="search" class="form-control form-control-white text-bg-white" placeholder="Search..." aria-label="Search" />
            </form>

            <div class="text-end">
              <button type="button" class="btn btn-outline-light me-2 btn-dark" onClick={onClickLogin}>Login</button>
              <button type="button" class="btn btn-dark" onClick={onClickSignUp}>Sign-up</button>
            </div>
          </div>
        </div>
        </header>
    </div>
  )
}