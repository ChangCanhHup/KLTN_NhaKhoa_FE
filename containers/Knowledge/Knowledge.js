import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick"; // Slick Carousel
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";

// Importing icons
import {
  FaTooth,
  FaInfoCircle,
  FaQuestionCircle,
  FaVideo,
  FaHandsHelping,
} from "react-icons/fa";

class Knowledge extends Component {
  render() {
    const containerStyle = {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    };

    const sectionStyle = {
      marginBottom: "40px",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
    };

    const titleStyle = {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#49bce2", // Updated to the desired color
      display: "flex",
      alignItems: "center",
    };

    const iconStyle = {
      marginRight: "10px",
      fontSize: "28px",
      color: "#49bce2", // Updated to the desired color
    };

    const paragraphStyle = {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#666",
    };

    const videoContainerStyle = {
      textAlign: "center",
      marginBottom: "30px",
    };

    const videoStyle = {
      width: "100%",
      height: "500px", // Increase the height of the iframe
      borderRadius: "10px",
    };

    const faqListStyle = {
      listStyleType: "decimal",
      marginLeft: "20px",
    };

    const faqItemStyle = {
      fontSize: "16px",
      color: "#555",
      marginBottom: "10px",
    };

    const sliderStyle = {
      maxWidth: "600px", // Limit the max width of the slider
      borderRadius: "10px",
      margin: "0 auto",
    };

    const imageStyleSlider = {
      width: "100%", // Ensure image takes 100% of the container width
      height: "auto",
      borderRadius: "10px",
    };

    // Slick Carousel settings
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
    };

    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div style={containerStyle}>
          {/* Chăm Sóc Răng Miệng Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaTooth style={iconStyle} />
              Chăm Sóc Răng Miệng
            </div>
            <p style={paragraphStyle}>
              Chăm sóc răng miệng là một phần quan trọng trong việc duy trì sức
              khỏe tổng thể. Việc vệ sinh răng miệng hàng ngày giúp ngăn ngừa
              các bệnh lý răng miệng như sâu răng, viêm nướu, và các vấn đề
              nghiêm trọng khác. Hãy chắc chắn rằng bạn đánh răng ít nhất hai
              lần mỗi ngày, sử dụng chỉ nha khoa và khám nha khoa định kỳ.
            </p>
            <Slider style={sliderStyle} {...sliderSettings}>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://i.pinimg.com/736x/fb/39/25/fb39253a7fbccf5c63f978905b26e27a.jpg" // Replace with your image
                  alt="Chải răng đúng cách"
                />
              </div>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://i.pinimg.com/736x/11/bb/f5/11bbf5757d16adb3b8b13762486263ec.jpg" // Replace with your image
                  alt="Chăm sóc răng miệng"
                />
              </div>
            </Slider>
          </div>

          {/* Các Phương Pháp Điều Trị Nha Khoa Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaInfoCircle style={iconStyle} />
              Các Phương Pháp Điều Trị Nha Khoa
            </div>
            <ul style={faqListStyle}>
              <li style={faqItemStyle}>Trồng răng Implant</li>
              <li style={faqItemStyle}>Niềng răng thẩm mỹ</li>
              <li style={faqItemStyle}>
                Điều trị sâu răng và các bệnh lý nướu
              </li>
              <li style={faqItemStyle}>
                Chữa tủy răng và điều trị các vấn đề liên quan đến tủy
              </li>
              <li style={faqItemStyle}>Tẩy trắng răng an toàn</li>
            </ul>
            <Slider style={sliderStyle} {...sliderSettings}>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/07/ham-gia-khung-kim-loai-1.png" // Replace with your image
                  alt="Trồng răng Implant"
                />
              </div>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/07/trong-rang-thao-lap.jpg" // Replace with your image
                  alt="Niềng răng thẩm mỹ"
                />
              </div>
            </Slider>
          </div>

          {/* Video Hướng Dẫn Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaVideo style={iconStyle} />
              Video Hướng Dẫn
            </div>
            <div style={videoContainerStyle}>
              <iframe
                style={videoStyle}
                src="https://www.youtube.com/embed/p8dll0UKm88" // Replace with your video link
                title="Video Hướng Dẫn Chăm Sóc Răng Miệng"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Câu Hỏi Thường Gặp (FAQ) Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaQuestionCircle style={iconStyle} />
              Câu Hỏi Thường Gặp
            </div>
            <ul style={faqListStyle}>
              <li style={faqItemStyle}>
                <strong>Câu hỏi 1:</strong> Khi nào tôi nên đi khám nha khoa
                định kỳ?
                <p style={paragraphStyle}>
                  Để bảo vệ sức khỏe răng miệng tốt nhất, bạn nên đi khám nha
                  khoa ít nhất 6 tháng một lần.
                </p>
              </li>
              <li style={faqItemStyle}>
                <strong>Câu hỏi 2:</strong> Tại sao tôi nên niềng răng?
                <p style={paragraphStyle}>
                  Niềng răng giúp cải thiện cấu trúc răng miệng, khắc phục các
                  vấn đề như răng lệch, vẩu, hoặc sai khớp cắn, giúp bạn có một
                  nụ cười đẹp hơn.
                </p>
              </li>
              <li style={faqItemStyle}>
                <strong>Câu hỏi 3:</strong> Trồng răng Implant có đau không?
                <p style={paragraphStyle}>
                  Trồng răng Implant là một quy trình an toàn và ít đau đớn. Bạn
                  sẽ được gây tê trong quá trình thực hiện, và cảm giác khó chịu
                  chỉ kéo dài trong một vài ngày sau phẫu thuật.
                </p>
              </li>
            </ul>
          </div>

          {/* Hình Ảnh Minh Họa Quy Trình Điều Trị */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaHandsHelping style={iconStyle} />
              Hình Ảnh Minh Họa Quy Trình Điều Trị
            </div>
            <Slider style={sliderStyle} {...sliderSettings}>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/implant-1.jpg" // Replace with your image
                  alt="Quy Trình Trồng Răng Implant"
                />
              </div>
              <div>
                <img
                  style={imageStyleSlider}
                  src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/implant-2.jpg" // Replace with your image
                  alt="Quy Trình Niềng Răng"
                />
              </div>
            </Slider>
          </div>

          <HomeFooter
            style={{
              backgroundColor: "#222",
              color: "#fff",
              padding: "10px 0",
              textAlign: "center",
              marginTop: "50px",
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Knowledge);
