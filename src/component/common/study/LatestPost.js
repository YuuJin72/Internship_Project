import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { ReactComponent as DefaultImage } from "../../../assets/images/Default.svg"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "../../modal/Modal";

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
                    sx={{ height: '20rem', display: 'flex', flexDirection: 'column', p: '1rem'}}
                    >
                    <DefaultImage/>
                    <CardContent sx={{ flexGrow: 1}}>
                        <Typography gutterBottom variant="h5" component="h2">
                        {el.title}
                        </Typography>
                        <Typography gutterBottom variant="subtitle2" component="h2">
                        {el.tag}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" id={el._num} onClick={handleMoveDetail}>View</Button>
                    </CardActions>
                </Card>
            ))}
        </Slider>
    )
}

export default LatestPost;