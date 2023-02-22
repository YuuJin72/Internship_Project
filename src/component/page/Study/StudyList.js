import { useNavigate } from 'react-router-dom'
import './StudyList.css'

export default function StudyList(){

    const navigate = useNavigate()

    function onClickCreateStudy(){
        console.log('onClickCreateStudy')
        navigate('/study/create')
    }

    return(
    <div className='study-page'>
        <h1>스터디 메인</h1>
        <input type='text' size='50'></input> <button>검색</button>
        <div>
            새 스터디
        </div>
        <div>
            마감 임박 스터디
        </div>
        <button onClick={onClickCreateStudy}>새 스터디 생성</button>
    </div>
    )
}