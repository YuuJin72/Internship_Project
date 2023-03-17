import './Main.css'
import axios from 'axios'
import mainimg from '../../../assets/images/mainimg.jpg'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { loginState } from '../../../store/user'

const Main = () => {

    const dispatch = useDispatch()

    const fetchLogin = () => {
        axios.get('http://localhost:8080/islogin')
        .then((res) => {
            if(res.data.message === 'fail'){
                dispatch(loginState(false))
            }
        })
    }

    useEffect(() => {
        fetchLogin()
    },[])

    return(
        <div className="main">
            
        </div>
    )
}

export default Main;