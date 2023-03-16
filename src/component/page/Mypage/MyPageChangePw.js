import PwCheck from "../../common/study/mypage/PwCheck"
import PwChange from "../../common/study/mypage/PwChange"
import { useState, useEffect } from "react"

const MyPageChangePw = () => {
    
    const [isCorrect, SetIsCorrect] = useState(false)

    const getIsCorrect = (isCorrect) => {
        SetIsCorrect(isCorrect)
    }

    useEffect(() => {

    },[isCorrect])

    return(
        <>
            {!isCorrect && <PwCheck isCorrect={isCorrect} getIsCorrect={getIsCorrect}/>}
            {isCorrect && <PwChange />}
        </>
    )
}

export default MyPageChangePw