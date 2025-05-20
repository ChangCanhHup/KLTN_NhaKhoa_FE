import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";

// Importing icons
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      isFormSubmitted: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = this.state;

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Normally, you would send the form data to the server here.
    // For now, we will simulate a successful form submission.
    this.setState({ isFormSubmitted: true });
    alert("Thank you for contacting us! We will get back to you shortly.");
  };

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
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    };

    const titleStyle = {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#333",
      display: "flex",
      alignItems: "center",
    };

    const iconStyle = {
      marginRight: "10px",
      fontSize: "28px",
      color: "#1a1a1a",
    };

    const formStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "20px",
    };

    const inputStyle = {
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const buttonStyle = {
      padding: "12px 20px",
      fontSize: "16px",
      backgroundColor: "#49bce2",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const footerStyle = {
      backgroundColor: "#222",
      color: "#fff",
      padding: "20px 0",
      textAlign: "center",
      marginTop: "50px",
    };

    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div style={containerStyle}>
          {/* Map Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaMapMarkerAlt style={iconStyle} />
              Địa Chỉ
            </div>
            <div
              style={{
                marginBottom: "30px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <iframe
                style={{ width: "100%", height: "450px", border: "none" }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2751680828437!2d106.60055067573609!3d10.790224358937605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c748c14642f%3A0x3992d85999731ec8!2zODc3IMSQLiBUw6JuIEvhu7MgVMOibiBRdcO9LCBCw6xuaCBIxrBuZyBIb8OgIEEsIELDrG5oIFTDom4sIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1733250196589!5m2!1svi!2s"
                title="Google Map Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Info Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaPhone style={iconStyle} />
              Thông Tin Liên Hệ
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div>
                  <FaPhone style={{ marginRight: "8px" }} />
                  <span>Điện thoại: +84 123 456 789</span>
                </div>
                <div>
                  <FaEnvelope style={{ marginRight: "8px" }} />
                  <span>Email: info@hbtdental.com</span>
                </div>
                <div>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                  <span>
                    Địa chỉ: 123 Đường ABC, TP. Thủ Đức, TP.HCM, Việt Nam
                  </span>
                </div>
                <div>
                  <FaClock style={{ marginRight: "8px" }} />
                  <span>Giờ làm việc: Thứ 2 - Thứ 7, 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaEnvelope style={iconStyle} />
              Liên Hệ Với Chúng Tôi
            </div>
            <form style={formStyle} onSubmit={this.handleFormSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                style={inputStyle}
                value={this.state.name}
                onChange={this.handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                style={inputStyle}
                value={this.state.email}
                onChange={this.handleInputChange}
              />
              <textarea
                name="message"
                placeholder="Lời nhắn"
                style={{ ...inputStyle, height: "120px" }}
                value={this.state.message}
                onChange={this.handleInputChange}
              />
              <button type="submit" style={buttonStyle}>
                Gửi
              </button>
            </form>
          </div>

          {/* Social Media Links Section */}
          <div style={sectionStyle}>
            <div style={titleStyle}>
              <FaFacebook style={iconStyle} />
              Mạng Xã Hội
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: "20px",
              }}
            >
              <a
                href="https://www.facebook.com/BikDental"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook
                  style={{
                    fontSize: "24px",
                    marginRight: "15px",
                    color: "#555",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a
                href="https://www.instagram.com/BikDental"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram
                  style={{
                    fontSize: "24px",
                    marginRight: "15px",
                    color: "#555",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a
                href="https://www.linkedin.com/company/hbtdental"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin
                  style={{
                    fontSize: "24px",
                    marginRight: "15px",
                    color: "#555",
                    cursor: "pointer",
                  }}
                />
              </a>
            </div>
          </div>

          <HomeFooter style={footerStyle} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
