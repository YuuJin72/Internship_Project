import './Sign.css'

export default function Signin(){
    return(
        <>
            <div className='signin'>
                <h1>대 대 대</h1>
                <div className='input-area'>
                    <input type='text' placeholder='Input your ID'></input>
                    <p />
                    <input type='password' placeholder='Input your Password'></input>
                </div>
                <p />
                <button className='login'>Log in</button>
                <p />
                회원이 아니신가요? <button>Sign up</button>
            </div>
        </>
    )
}