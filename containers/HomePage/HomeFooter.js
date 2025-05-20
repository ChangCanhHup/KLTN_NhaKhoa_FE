import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    const footerStyles = {
      backgroundColor: "#49bce2", // Màu nền chủ đạo
      color: "white",
      padding: "40px 0",
      fontFamily: "Arial, sans-serif",
      marginTop: "80px", // Thêm marginTop cho footer
    };

    const containerStyles = {
      display: "flex",
      justifyContent: "space-between",
      padding: "0 60px",
      flexWrap: "wrap", // Để footer tự động xuống dòng trên màn hình nhỏ
    };

    const sectionStyles = {
      flex: 1,
      marginBottom: "20px",
      minWidth: "220px", // Đảm bảo không gian đủ rộng cho mỗi phần
    };

    const sectionHeadingStyles = {
      fontSize: "20px", // Tăng kích thước font của tiêu đề
      fontWeight: "bold",
      marginBottom: "15px",
      textTransform: "uppercase", // Làm cho tiêu đề thêm nổi bật
    };

    const listStyles = {
      listStyleType: "none",
      padding: 0,
    };

    const listItemStyles = {
      margin: "10px 0",
    };

    const listItemLinkStyles = {
      textDecoration: "none",
      color: "white",
      transition: "color 0.3s ease",
      fontSize: "16px",
    };

    const listItemLinkHoverStyles = {
      color: "#ffcc00", // Màu khi hover
    };

    const bottomStyles = {
      backgroundColor: "#3d9bb3", // Màu đậm ở phần dưới
      padding: "10px 0",
      textAlign: "center",
      marginTop: "30px",
    };

    const bottomTextStyles = {
      margin: 0,
      fontSize: "14px",
    };

    return (
      <div style={footerStyles}>
        <div style={containerStyles}>
          {/* Phần thông tin liên hệ */}
          <div style={sectionStyles}>
            <h4 style={sectionHeadingStyles}>Thông tin liên hệ</h4>
            <ul style={listStyles}>
              <li style={listItemStyles}>
                <a href="#" style={listItemLinkStyles}>
                  Địa chỉ: Số 88, Đường số 8, Khu dân cư Trung Sơn
                </a>
              </li>
              <li style={listItemStyles}>
                <a href="tel:+1234567890" style={listItemLinkStyles}>
                  Phone: (123) 456-7890
                </a>
              </li>
              <li style={listItemStyles}>
                <a href="mailto:info@nih.com.vn" style={listItemLinkStyles}>
                  Email: info@nih.com.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Phần giờ làm việc */}
          <div style={sectionStyles}>
            <h4 style={sectionHeadingStyles}>Giờ làm việc</h4>
            <ul style={listStyles}>
              <li style={listItemStyles}>Từ thứ 2 đến thứ 7</li>
              <li style={listItemStyles}>Buổi sáng: 7:00 - 12:00</li>
              <li style={listItemStyles}>Buổi chiều: 13:30 - 17:00</li>
            </ul>
          </div>

          {/* Phần các liên kết */}
          <div style={sectionStyles}>
            <h4 style={sectionHeadingStyles}>Theo dõi chúng tôi</h4>
            <ul style={listStyles}>
              <li style={listItemStyles}>
                <a href="#" style={listItemLinkStyles}>
                  Facebook
                </a>
              </li>
              <li style={listItemStyles}>
                <a href="#" style={listItemLinkStyles}>
                  Instagram
                </a>
              </li>
              <li style={listItemStyles}>
                <a href="#" style={listItemLinkStyles}>
                  Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* Phần đăng ký bản tin */}
          <div style={sectionStyles}>
            <h4 style={sectionHeadingStyles}>Đăng ký nhận bản tin</h4>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              style={{
                width: "80%",
                padding: "10px",
                fontSize: "16px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffcc00",
                border: "none",
                color: "white",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Phần cuối */}
        <div style={bottomStyles}>
          <p style={bottomTextStyles}>
            &copy; 2024 Bệnh viện Đa Khoa Quốc Tế Nam Sài Gòn - All Rights
            Reserved
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
