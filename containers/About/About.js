import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick"; // Slick Carousel
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";

// Importing icons
import { FaBuilding, FaVideo, FaHistory, FaCogs } from "react-icons/fa";

class About extends Component {
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
      color: "#49bce2",
      fontWeight: "bold",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
    };

    const iconStyle = {
      marginRight: "10px",
      fontSize: "28px",
      color: "#49bce2",
    };

    const paragraphStyle = {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#666",
      marginRight: "20px", // Ensure the text doesn't touch the image
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

    const historyListStyle = {
      listStyleType: "decimal",
      marginLeft: "20px",
    };

    const listItemStyle = {
      fontSize: "16px",
      color: "#555",
      marginBottom: "10px",
    };

    const footerStyle = {
      backgroundColor: "#222",
      color: "#fff",
      padding: "10px 0",
      textAlign: "center",
      marginTop: "50px",
    };

    const imageStyle = {
      width: "100%",
      borderRadius: "10px",
      marginTop: "20px",
    };

    const sliderStyle = {
      maxWidth: "600px", // Limit the max width of the slider
      borderRadius: "10px",
      margin: "0 auto",
    };

    const textAndImageStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row", // Set to 'row' for left-right layout
    };

    const textStyle = {
      flex: 1,
      marginRight: "10px", // Add some spacing between text and image
    };

    const imageStyleSlider = {
      width: "100%", // Ensure image takes 50% of the container width
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
          {/* Về Chúng Tôi Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaBuilding style={iconStyle} />
              Về Chúng Tôi
            </div>
            <div style={textAndImageStyle}>
              <div style={textStyle}>
                <p style={paragraphStyle}>
                  Nha khoa Quốc tế BIK tiền thân là Nha Khoa Bảo Việt thành lập
                  vào ngày 02/09/2013, hoạt động với 04 nhóm dịch vụ chính:
                  Trồng răng Implant, răng sứ thẩm mỹ, niềng răng và nha khoa
                  tổng quát. Tọa lạc tại TP. Thủ Đức, TP.HCM và TP. Thủ Dầu Một,
                  Bình Dương với 3 chi nhánh. Cùng với đội ngũ bác sĩ, kỹ thuật
                  viên được đào tạo chuyên khoa Răng Hàm Mặt, Trung tâm Nha Khoa
                  Quốc Tế BIK với sứ mệnh “Trao Nụ Cười – Nhận Tương Lai”, tự
                  hào là địa chỉ uy tín thực hiện dịch vụ nha khoa, thẩm mỹ răng
                  hàm mặt chất lượng, chuyên nghiệp chuẩn quốc tế, hiệu quả toàn
                  diện, đảm bảo quyền lợi người bệnh tối đa, mang lại tâm lý
                  thoải mái nhất cho khách hàng khi đến điều trị.
                </p>
              </div>
              <Slider style={sliderStyle} {...sliderSettings}>
                <div>
                  <img
                    style={imageStyleSlider}
                    src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/ghe-nha-khoa-bik-768x512.jpg" // Replace with your image
                    alt="Modern Equipment"
                  />
                </div>
                <div>
                  <img
                    style={imageStyleSlider}
                    src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/img_0524-hdr_optimized-768x512.jpg" // Replace with your image
                    alt="Modern Equipment"
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* Video Giới Thiệu Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaVideo style={iconStyle} />
              Video Giới Thiệu
            </div>
            <div style={videoContainerStyle}>
              <iframe
                width="1140"
                height="663"
                src="https://www.youtube.com/embed/PxY5CJgc53w"
                title="KỶ NIỆM 10 NĂM THÀNH LẬP NHA KHOA QUỐC TẾ BIK (02/09/2013 - 02/09/2023)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          {/* Lịch Sử Phát Triển Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaHistory style={iconStyle} />
              Lịch Sử Phát Triển
            </div>
            <ul style={historyListStyle}>
              <li style={listItemStyle}>2010: Thành lập công ty.</li>
              <li style={listItemStyle}>
                2012: Mở rộng thị trường sang các quốc gia Đông Nam Á.
              </li>
              <li style={listItemStyle}>
                2015: Ra mắt sản phẩm công nghệ mới.
              </li>
              <li style={listItemStyle}>2020: Đạt mốc 1 triệu người dùng.</li>
              <li style={listItemStyle}>
                2023: Tiến hành nghiên cứu và phát triển các sản phẩm AI tiên
                tiến.
              </li>
            </ul>
          </div>

          {/* Cơ Sở Vật Chất Hiện Đại Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaCogs style={iconStyle} />
              Cơ Sở Vật Chất Hiện Đại - Trang Thiết Bị Máy Móc Tân Tiến
            </div>
            <div style={textAndImageStyle}>
              <div style={textStyle}>
                <p style={paragraphStyle}>
                  Chúng tôi tự hào sở hữu cơ sở vật chất hiện đại, trang bị đầy
                  đủ các thiết bị máy móc tân tiến nhất. Điều này giúp chúng tôi
                  cung cấp những sản phẩm và dịch vụ chất lượng cao, đáp ứng nhu
                  cầu của khách hàng trong mọi lĩnh vực.
                </p>
              </div>
              <Slider style={sliderStyle} {...sliderSettings}>
                <div>
                  <img
                    style={imageStyleSlider}
                    src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/1.png" // Replace with your image
                    alt="Modern Equipment"
                  />
                </div>
                <div>
                  <img
                    style={imageStyleSlider}
                    src="https://nhakhoaquoctebik.com/wp-content/uploads/2024/06/1maymoc1.png" // Replace with your image
                    alt="Modern Equipment"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </div>
        <HomeFooter style={footerStyle} />
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
