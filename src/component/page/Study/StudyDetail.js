import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import MemberPost from "../../common/study/MemberPost";
import NonMemberPost from "../../common/study/NonMemberPost";
import { useSelector, useDispatch } from 'react-redux';
import { memberState } from '../../../store/member';


const StudyDetail = () => {

    const [ confirmed, setConfirmed ] = useState(false)
    const [ post, setPost ] = useState('')
    const dispatch = useDispatch()
    const member = useSelector((state) => state.member.value)
    const params = useParams();
    const navigate = useNavigate()
    console.log(member)
    
    useEffect(() => {
        const fetchPost = () => {
            axios.get(`http://localhost:8080/study/isconfirmed/${params.id}`)
            .then((res) => {
                if(res.data.message === "confirmed"){
                    console.log('confirmed')
                    setConfirmed(true)
                } else if (res.data.message === "404"){
                    console.log('404')
                    navigate('/Error')
                } else if (res.data.message === "waiting"){
                    console.log('waiting')
                    dispatch(memberState(true))
                    setPost(res.data.result)
                } else if (res.data.message === "nonconfirmed"){
                    console.log('nonconfirmed')
                    setPost(res.data.result)
                    dispatch(memberState(false))
                } else {
                    console.log('err')
                }
            })
        }
    fetchPost();
    }, []);

    return (
        confirmed 
        ? <MemberPost />
        : <NonMemberPost prop={post[0]}/>
    )
    
    
}

export default StudyDetail