import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Banner.css'
import banner1 from "../../assets/images/banner01.jpg";
import banner2 from "../../assets/images/banner02.jpg";
import banner3 from "../../assets/images/banner03.jpg";
import Slider from "react-slick";

const Banner = () => {
    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    return (
        <div className='banner'>
            <Slider {...settings}>
            <div>
                <img src={banner1} alt='banner1'/>
            </div>
            <div>
                <img src={banner2} alt='banner2'/>
            </div>
            <div>
                <img src={banner3} alt='banner3'/>
            </div>
            </Slider>
        </div>
    )
}

export default  Banner;