import './Sign.css'


export default function Signup(){
    return(
        <div className='signup'>
           <h1>회원가입</h1>
           <input placeholder='ID 입력'></input> <button>중복확인</button><p/>
           <input placeholder='PW 입력' type='password'></input><p/>
           <input placeholder='PW 확인' type='password'></input><p/>
           <input placeholder='이메일 입력'></input> <button>인증번호 받기</button><p/>
           <input placeholder='인증번호 입력'></input><p/>
           <h2>프로필 사진</h2>
           <img src="./logo192.png" alt='' className="img-thumbnail"></img> <button>변경</button><p/>
           <button>회원가입</button>
        </div>
    )
}
