import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import MemberPost from "../../common/study/MemberPost";
import NonMemberPost from "../../common/study/NonMemberPost";
import { useSelector, useDispatch } from 'react-redux';
import { memberState } from '../../../store/member';
import { studyRoomState } from '../../../store/studyRoomNum'
import Loading from "../../common/Loading";


const StudyDetail = () => {

    const [ confirmed, setConfirmed ] = useState(false)
    const [ post, setPost ] = useState('')
    const dispatch = useDispatch()
    const member = useSelector((state) => state.member.value)
    const number = useSelector((state) => state.studynumber.value)
    const params = useParams();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    
    const fetchPost = () => {
        setLoading(true)
        axios.get(`http://localhost:8080/study/isconfirmed/${params.id}`)
        .then((res) => {
            if(res.data.message === "confirmed"){
                console.log('confirmed')
                setConfirmed(true)
                dispatch(studyRoomState(params.id))
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
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchPost();
    }, [setLoading]);

    return (
        <>
            {loading ? <Loading /> : 
            confirmed ? <MemberPost /> : <NonMemberPost prop={post[0]}/>}
        </>
    )
    
    
}

export default StudyDetail