import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "../../modal/Modal";
import ListImg from '../../../assets/images/StudyList.jpg'

const LatestPost = () => {

    const navigate = useNavigate()

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 5000,
        cssEase: "linear"
    };

    const [posts, setPosts] = useState([])
    const { Failure } = Modal()

    useEffect(() => {
        const fetchPost = () => {
            axios.get("http://localhost:8080/study/latest")
            .then((res) => {
                if(res.data.message === "success") {
                  setPosts(res.data.posts)
                }
                else{
                    Failure('정보를 불러오는데 실패하였습니다.')
                }
            })
        }
        fetchPost();
    }, []);

    const handleMoveDetail = (e) => {
        navigate(`${e.target.id}`)
    }
    return(
        <Slider {...settings}>
            {posts.map((el) => (
                <Card
                    key={el}
                    sx={{ height: '35rem', display: 'flex', flexDirection: 'column', pt: 2}}
                    >
                    <img src={ListImg} alt='img' style={{width: '15rem', height: '15rem', padding: '1px', borderRadius: '10px'}}/>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" sx={{mt: 2}}>
                            {el.title}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2" sx={{mt: 2}}>
                            {el.tag}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant="contained" id={el._num} onClick={handleMoveDetail}>상세</Button>
                    </CardActions>
                </Card>
            ))}
        </Slider>
    )
}

export default LatestPost;