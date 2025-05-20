import { useRef, useState, useEffect } from "react";
import "../scss/MedicalHistory.scss";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { Modal } from "reactstrap";
import moment from "moment";
import {
  filterBookingsByPatientId,
  cancelBookingUser,
} from "../../../services/userService";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

export default function BookingList() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [isShowLoading, setIsShowLoading] = useState(false);

  const dispatch = useDispatch();
  let history = useHistory();

  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  useEffect(() => {
    if (userInfo && userInfo.id) {
      setPatientId(userInfo.id);
    }
    handleFilterBookingsByDate(userInfo.id, startDate, endDate);
  }, []);

  const handleOnchangeDate = (event, type) => {
    if (type === "startDate") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const handleResetDate = async () => {
    setStartDate("");
    setEndDate("");
    await handleFilterBookingsByDate(userInfo.id, "", "");
  };

  const checkValidateInput = () => {
    if (!startDate) {
      language === "vi"
        ? toast.error("Bạn chưa nhập ngày bắt đầu")
        : toast.error("You have not entered a start date");
      return false;
    }

    if (!endDate) {
      language === "vi"
        ? toast.error("Bạn chưa nhập ngày kết thúc")
        : toast.error("You have not entered an end date");
      return false;
    }
    return true;
  };

  const handleFilterBookingByDateApply = async () => {
    let isValid = checkValidateInput();
    if (!isValid) return;

    setIsShowLoading(true);
    let data = {
      patientId: patientId,
      startDate: startDate,
      endDate: endDate,
    };

    let res = await filterBookingsByPatientId(data);
    if (res && res.errCode === 0) {
      setBookings(res.data);
      setIsShowLoading(false);
    } else {
      setIsShowLoading(false);
    }
  };

  const handleFilterBookingsByDate = async (patientId, startDate, endDate) => {
    let data = {
      patientId: patientId,
      startDate: startDate,
      endDate: endDate,
    };
    let res = await filterBookingsByPatientId(data);
    if (res && res.errCode === 0) {
      setBookings(res.data);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      let res = await cancelBookingUser({ bookingId });
      if (res && res.errCode === 0) {
        toast.success("Hủy đặt lịch thành công");
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
      } else {
        toast.error("Hủy đặt lịch thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error from server");
    }
  };

  return (
    <LoadingOverlay
      active={isShowLoading}
      spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
    >
      <div>
        <div class="d-flex justify-content-center">
          <h2>
            <FormattedMessage id="booking-list.title" />
          </h2>
        </div>
        <div class="row">
          <div class="col-12 mb-20">
            <h3>
              <FormattedMessage id="booking-list.filters" />
            </h3>
          </div>
          <div class="col-12 mb-5">
            <span style={{ width: "100px", display: "inline-block" }}>
              <FormattedMessage id="booking-list.from-date" />
            </span>
            <input
              type="date"
              class="ml-5"
              value={startDate}
              onChange={(event) => handleOnchangeDate(event, "startDate")}
            />
          </div>
          <div class="col-12">
            <span style={{ width: "100px", display: "inline-block" }}>
              <FormattedMessage id="booking-list.to-date" />
            </span>
            <input
              type="date"
              class="ml-5"
              value={endDate}
              onChange={(event) => handleOnchangeDate(event, "endDate")}
            />
          </div>
          <div class="col-12 mt-10">
            <button
              onClick={() => handleFilterBookingByDateApply()}
              type="button"
              class="btn btn-primary mr-5"
            >
              <FormattedMessage id="booking-list.apply" />
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => handleResetDate()}
            >
              <FormattedMessage id="booking-list.reset" />
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <table class="table table-hover mt-45">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">
                    <FormattedMessage id="booking-list.date-booking" />
                  </th>
                  <th scope="col" class="text-center">
                    <FormattedMessage id="booking-list.patient-name" />
                  </th>
                  <th scope="col" class="text-center">
                    <FormattedMessage id="booking-list.reason" />
                  </th>
                  {/* <th scope="col" class="text-center">
                    <FormattedMessage id="booking-list.doctor" />
                  </th> */}
                  {/* <th scope="col" class="text-center">
                    <FormattedMessage id="booking-list.status" />
                  </th> */}
                  <th scope="col" class="text-center">
                    <FormattedMessage id="booking-list.action" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{moment(parseInt(item.date)).format("DD/MM/YYYY")}</td>
                    <td class="text-center">
                      {item.patientData.firstName} {item.patientData.lastName}
                    </td>
                    <td class="text-center">{item.patientReason}</td>
                    {/* <td class="text-center">
                      <div
                        class="pointer text-primary"
                        onClick={() =>
                          history.push(`/detail-doctor/${item.doctorId}`)
                        }
                      >
                        {item.patientData.lastName} {item.patientData.firstName}
                      </div>
                    </td> */}
                    {/* <td class="text-center">{item.statusId}</td> */}
                    <td class="text-center">
                      {item.statusId === "S1" && (
                        <button
                          class="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(item.id)}
                        >
                          <FormattedMessage id="booking-list.cancel" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}
