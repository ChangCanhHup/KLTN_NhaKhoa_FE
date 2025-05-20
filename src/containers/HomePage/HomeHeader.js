import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";

import { changeLanguageApp } from "../../store/actions/appActions";
import { withRouter } from "react-router";

import MenuHomeHeader from "./MenuHomeHeader";
import BookingModal from "./BookingModal";
import { emitter } from "../../utils/emitter";
import { Alert } from "reactstrap";

class HomeHeader extends Component {
  constructor() {
    super();

    this.state = {
      previewImgURL: [],
      isOpenModalBooking: false, // Thêm trạng thái mở modal
    };
  }

  componentDidMount() {
    let imageBase64 = "";
    if (this.props && this.props.userInfo && this.props.userInfo.image) {
      imageBase64 = new Buffer(this.props.userInfo.image, "base64").toString(
        "binary"
      );
    }

    this.setState({
      previewImgURL: imageBase64,
    });
  }

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
    //fire redux event: action
  };

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };

  toggleBookingModal = () => {
    this.setState((prevState) => ({
      isOpenModalBooking: !prevState.isOpenModalBooking,
    }));
  };

  handleNavigation = (path) => {
    if (this.props.history) {
      this.props.history.push(path);
    }
  };

  render() {
    let language = this.props.language;

    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <div
                className="header-logo"
                onClick={() => {
                  this.returnToHome();
                }}
              ></div>
            </div>
            <div
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  maxWidth: "1200px",
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 20px",
                }}
              >
                <div>
                  <div
                    onClick={this.returnToHome}
                    style={{
                      cursor: "pointer",
                      width: "100px",
                      height: "50px",
                      backgroundImage: "url('/path-to-your-logo.png')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  {/* Menu Items */}
                  <div
                    onClick={() => this.handleNavigation("/home")}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <FormattedMessage
                      id="homeheader.trangchu"
                      defaultMessage="Trang chủ"
                    />
                  </div>
                  <div
                    onClick={() => this.handleNavigation("/gioi-thieu")}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <FormattedMessage
                      id="homeheader.gioithieu"
                      defaultMessage="Giới thiệu"
                    />
                  </div>
                  <div
                    onClick={() => this.handleNavigation("/dich-vu")}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <FormattedMessage
                      id="homeheader.dichvu"
                      defaultMessage="Dịch vụ"
                    />
                  </div>

                  <div
                    onClick={() => this.handleNavigation("/kien-thuc")}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <FormattedMessage
                      id="homeheader.kienthuc"
                      defaultMessage="Kiến thức"
                    />
                  </div>
                  <div
                    onClick={() => this.handleNavigation("/lien-he")}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                  >
                    <FormattedMessage
                      id="homeheader.lienhe"
                      defaultMessage="Liên hệ"
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    onClick={() => this.changeLanguage(LANGUAGES.VI)}
                    style={{
                      cursor: "pointer",
                      color: language === LANGUAGES.VI ? "blue" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    VN
                  </div>
                  <div
                    onClick={() => this.changeLanguage(LANGUAGES.EN)}
                    style={{
                      cursor: "pointer",
                      color: language === LANGUAGES.EN ? "blue" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    EN
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundSize: "cover",
                      backgroundImage: `url(${this.state.previewImgURL || ""})`,
                      cursor: "pointer",
                    }}
                  ></div>
                  <button
                    onClick={this.toggleBookingModal}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "10px 15px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    <span>Đặt lịch</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="right-content">
              <div
                className="avatar-profile mx-10"
                style={{
                  backgroundImage: `url(${
                    this.state.previewImgURL ? this.state.previewImgURL : ""
                  })`,
                }}
              ></div>

              <div className="menu-home-header">
                <MenuHomeHeader />
              </div>
            </div>
          </div>
        </div>
        {this.state.isOpenModalBooking && (
          <BookingModal
            isOpenModal={this.state.isOpenModalBooking}
            toggleModal={this.toggleBookingModal}
          />
        )}
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up position-relative">
              <div
                className="position-absolute"
                style={{
                  bottom: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                }} 
              >
                <div className="title1">
                  <FormattedMessage id="banner.title1" />
                </div>
                <div className="title2">
                  <FormattedMessage id="banner.title2" />
                </div>
                <div className="search-and-book">
                  <div className="search">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Tìm nha sĩ" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
