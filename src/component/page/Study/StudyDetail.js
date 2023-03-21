import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import MemberPost from "../../common/study/MemberPost";
import NonMemberPost from "../../common/study/NonMemberPost";
import { useSelector, useDispatch } from 'react-redux';
import { memberState } from '../../../store/member';
import { studyRoomState } from '../../../store/studyRoomHost'
import Loading from "../../common/Loading";
import { Modal } from "../../modal/Modal";


const StudyDetail = () => {

    const [ confirmed, setConfirmed ] = useState(false)
    const [ post, setPost ] = useState('')
    const [limmem, setLimmem] = useState(0)
    const dispatch = useDispatch()
    const { Failure } = Modal()

    const member = useSelector((state) => state.member.value)
    const host = useSelector((state) => state.studyroomhost.value)
    const params = useParams();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true);
    
    const fetchPost = () => {
        setLoading(true)
        axios.get(`http://localhost:8080/study/isconfirmed/${params.id}`)
        .then((res) => {
            if(res.data.message === "confirmed"){
                setConfirmed(true)
                dispatch(studyRoomState(res.data.hostid))
            } else if (res.data.message === "404"){
                navigate('/Error')
            } else if (res.data.message === "waiting"){
                dispatch(memberState(true))
                setPost(res.data.result)
                setLimmem(res.data.limmem)
            } else if (res.data.message === "nonconfirmed"){
                setPost(res.data.result)
                setLimmem(res.data.limmem)
                dispatch(memberState(false))
            } else {
                Failure('에러가 발생했습니다.')
            }
            setLoading(false)
            
        })
    }

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div className="bgcolor">
            {   loading ? <Loading /> : 
            confirmed ? <MemberPost /> : <NonMemberPost prop={[post[0], limmem[0]]}/>}
        </div>
    )
    
    
}

export default StudyDetail