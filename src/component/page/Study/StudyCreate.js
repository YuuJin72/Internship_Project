import './StudyCreate.css'

export default function StudyCreate(){
    return(
        <div className='create-background-outer'>
            <h1>스터디 생성</h1>
            <div className='create-background'>
                <div className='create-background-left'>
                    <img src="..." alt="..." class="img-thumbnail"/>
                    <p/>
                    <button>변경</button>
                </div>
                <div className='create-background-right'>
                    <input size='50'></input><p/>
                    <input size='50'></input><p/>
                    <input type='textarea' size='50'></input><p/>
                </div> 
                <button>등록</button> 
                <button>취소</button>
            </div>
        </div>
    )
}