import { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./CreateRemedy.scss";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import localization from "moment/locale/vi"; //su dung chung cho cai mac dinh la tieng viet
import { CommonUtils } from "../../../utils";
import { filterDrugs } from "../../../services/drugService";
import {
  getAllSpecialty,
  getBookingById,
  postCreateRemedy,
} from "../../../services/userService";

import { useParams, useNavigate } from "react-router-domv6";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function CreateRemedy() {
  const [email, setEmail] = useState("");
  const [listMedicine, setListMedicine] = useState("");
  const [desciption, setDesciption] = useState("");
  const [additionalFeeDescription, setAdditionalFeeDescription] = useState("");
  const [patientName, setPatientName] = useState("");
  const [queryDrug, setQueryDrug] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [listSeletedDrugs, setListSeletedDrugs] = useState([]);
  const [listFilterDrugs, setListFilterDrugs] = useState([]);
  const [units, setUnits] = useState([
    { key: "pill", valueVi: "Viên", valueEn: "Pill" },
    { key: "package", valueVi: "Gói", valueEn: "Package" },
    { key: "bottle", valueVi: "Chai", valueEn: "Bottle" },
    { key: "tube", valueVi: "Ống", valueEn: "Tube" },
    { key: "set", valueVi: "Bộ", valueEn: "Set" },
  ]);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [token, setToken] = useState("");
  const [timeType, setTimeType] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reason, setReason] = useState("");
  const [teeth, setTeeth] = useState([]);
  const [listSelectedTeeth, setListSelectedTeeth] = useState([]);
  const [listFilterTeeth, setListFilterTeeth] = useState([]);
  const [specialtyData, setSpecialtyData] = useState({});
  const [examinationFee, setExaminationFee] = useState(0);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [specialties, setSpecialties] = useState([]);

  let { bookingId } = useParams();

  const predefinedTeeth = [
    { code: "R11", name: "Răng cửa giữa hàm trên phải" },
    { code: "R12", name: "Răng cửa bên hàm trên phải" },
    { code: "R13", name: "Răng nanh hàm trên phải" },
    { code: "R14", name: "Răng tiền hàm thứ nhất hàm trên phải" },
    { code: "R15", name: "Răng tiền hàm thứ hai hàm trên phải" },
    { code: "R16", name: "Răng cối thứ nhất hàm trên phải" },
    { code: "R17", name: "Răng cối thứ hai hàm trên phải" },
    { code: "R18", name: "Răng cối thứ ba hàm trên phải" },
    { code: "R21", name: "Răng cửa giữa hàm trên trái" },
    { code: "R22", name: "Răng cửa bên hàm trên trái" },
    { code: "R23", name: "Răng nanh hàm trên trái" },
    { code: "R24", name: "Răng tiền hàm thứ nhất hàm trên trái" },
    { code: "R25", name: "Răng tiền hàm thứ hai hàm trên trái" },
    { code: "R26", name: "Răng cối thứ nhất hàm trên trái" },
    { code: "R27", name: "Răng cối thứ hai hàm trên trái" },
    { code: "R28", name: "Răng cối thứ ba hàm trên trái" },
    { code: "R31", name: "Răng cửa giữa hàm dưới trái" },
    { code: "R32", name: "Răng cửa bên hàm dưới trái" },
    { code: "R33", name: "Răng nanh hàm dưới trái" },
    { code: "R34", name: "Răng tiền hàm thứ nhất hàm dưới trái" },
    { code: "R35", name: "Răng tiền hàm thứ hai hàm dưới trái" },
    { code: "R36", name: "Răng cối thứ nhất hàm dưới trái" },
    { code: "R37", name: "Răng cối thứ hai hàm dưới trái" },
    { code: "R38", name: "Răng cối thứ ba hàm dưới trái" },
    { code: "R41", name: "Răng cửa giữa hàm dưới phải" },
    { code: "R42", name: "Răng cửa bên hàm dưới phải" },
    { code: "R43", name: "Răng nanh hàm dưới phải" },
    { code: "R44", name: "Răng tiền hàm thứ nhất hàm dưới phải" },
    { code: "R45", name: "Răng tiền hàm thứ hai hàm dưới phải" },
    { code: "R46", name: "Răng cối thứ nhất hàm dưới phải" },
    { code: "R47", name: "Răng cối thứ hai hàm dưới phải" },
    { code: "R48", name: "Răng cối thứ ba hàm dưới phải" },
  ];

  useEffect(() => {
    setTeeth(predefinedTeeth);
    setListFilterTeeth(predefinedTeeth);
  }, []);
  useEffect(() => {
    calculateTotals(listSelectedTeeth);
  }, [listSelectedTeeth]);
  console.log(listSelectedTeeth);
  const { isLoggedIn, userInfo, language } = useSelector((state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  }));

  const handleRebuildDrugsList = (drugs) => {
    return drugs.map((drug) => {
      drug.description_usage = "";
      drug.unit = "chooseUnits";
      drug.amount = 0;
      return drug;
    });
  };
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await getAllSpecialty();
        console.log(response);
        if (response && response.errCode === 0) {
          const services = response.data
            .filter((specialty) => specialty.isDental)
            .map((specialty) => ({
              value: specialty.id,
              label: specialty.name,
              price: specialty.price,
              isDental: specialty.isDental,
            }));
          setSpecialties(services);
        } else {
          toast.error("Không thể tải danh sách dịch vụ!");
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Lỗi khi tải danh sách dịch vụ!");
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(async () => {
    let res = await filterDrugs({ name: "" });

    let rebuildDrugs = [];
    if (res) rebuildDrugs = handleRebuildDrugsList(res);

    setDrugs(rebuildDrugs);

    if (rebuildDrugs) setListFilterDrugs(rebuildDrugs);

    let patientInfo = await getBookingById(bookingId);
    if (
      patientInfo &&
      patientInfo.data &&
      patientInfo.data.patientName &&
      patientInfo.data.patientData &&
      patientInfo.data.patientData.email
    ) {
      console.log("patientInfo", patientInfo.data.patientData.email);
      setEmail(patientInfo.data.patientData.email);
      setPatientName(patientInfo.data.patientName);
      setDoctorId(patientInfo.data.doctorId);
      setPatientId(patientInfo.data.patientId);
      setDate(patientInfo.data.date);
      setToken(patientInfo.data.token);
      setTimeType(patientInfo.data.timeType);
      let name =
        (userInfo.lastName ? userInfo.lastName : "") +
        " " +
        (userInfo.firstName ? userInfo.firstName : "");
      setDoctorName(name);
      setReason(patientInfo.data.patientReason);
      setSpecialtyData(patientInfo.data.specialtyData);

      // Kiểm tra isDental và cập nhật examinationFee nếu cần
      if (
        patientInfo.data.specialtyData &&
        !patientInfo.data.specialtyData.isDental
      ) {
        setExaminationFee(
          (prev) => prev + (patientInfo.data.specialtyData.price || 0)
        );
      }
    }
  }, []);

  const handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  const handleOnChangeListMedicine = (event) => {
    setListMedicine(event.target.value);
  };
  const handlePushTeethToList = (tooth) => {
    let alreadySelected = listSelectedTeeth.some(
      (selectedTooth) => selectedTooth.code === tooth.code
    );

    if (alreadySelected) {
      toast.error("Răng này đã được chọn!");
      return;
    }

    let temp = [...listSelectedTeeth];
    temp.push({ ...tooth, note: "" }); // Ghi chú mặc định trống
    setListSelectedTeeth(temp);
  };
  const handleOnChangeToothService = (event, toothCode) => {
    const serviceId = Number(event.target.value); // Chuyển đổi sang số
    const service = specialties.find((s) => s.value === serviceId);

    if (service) {
      const updatedTeeth = listSelectedTeeth.map((tooth) =>
        tooth.code === toothCode
          ? {
              ...tooth,
              serviceId: service.value,
              serviceName: service.label, // Lưu tên dịch vụ
              servicePrice: service.price || 0, // Lưu giá dịch vụ
            }
          : tooth
      );

      setListSelectedTeeth(updatedTeeth);
      calculateTotals(updatedTeeth);
    }
  };

  const handleOnChangeToothDiscount = (event, toothCode) => {
    const discountValue = Number(event.target.value);

    const updatedTeeth = listSelectedTeeth.map((tooth) =>
      tooth.code === toothCode ? { ...tooth, discount: discountValue } : tooth
    );
    setListSelectedTeeth(updatedTeeth);

    calculateTotals(updatedTeeth);
  };
  const calculateTotals = (teethList) => {
    // Tính phí khám từ danh sách răng
    const examinationFee = teethList.reduce(
      (sum, tooth) => sum + (tooth.servicePrice || 0),
      0
    );

    // Nếu dịch vụ không liên quan đến nha khoa, cộng thêm giá dịch vụ vào phí khám
    const specialtyPrice = !specialtyData.isDental
      ? specialtyData.price || 0
      : 0;

    const totalDiscount = teethList.reduce(
      (sum, tooth) => sum + (tooth.discount || 0),
      0
    );

    const finalExaminationFee = examinationFee + specialtyPrice;

    setExaminationFee(finalExaminationFee); // Cập nhật phí khám
    setTotalDiscount(totalDiscount); // Tổng khuyến mãi

    // Tính phí cuối cùng: phí khám + phí phát sinh - tổng khuyến mãi
    const finalCost = Math.max(
      finalExaminationFee + additionalFee - totalDiscount,
      0
    );

    setTotalFee(finalCost); // Cập nhật chi phí cuối cùng
  };

  const removeToothFromTheList = (toothCode) => {
    let temp = [...listSelectedTeeth];
    temp = temp.filter((tooth) => tooth.code !== toothCode);
    setListSelectedTeeth(temp);
  };
  const handleOnchangeNoteTooth = (event, toothCode) => {
    const updatedTeeth = listSelectedTeeth.map((tooth) =>
      tooth.code === toothCode ? { ...tooth, note: event.target.value } : tooth
    );
    setListSelectedTeeth(updatedTeeth);
  };

  const handleOnChangeDescription = (event) => {
    setDesciption(event.target.value);
  };

  const handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      // this.setState({
      //   imgBase64: base64,
      // });
    }
  };

  const handleCreateRemedyImage = () => {
    createRemedyImage();
  };

  const createRemedyImage = async () => {
    try {
      setIsShowLoading(true);

      let response = await postCreateRemedy({
        email,
        listMedicine,
        desciption,
        doctorId,
        patientId,
        timeType,
        date,
        token,
        language,
        patientName,
        doctorName,
        listSeletedDrugs,
        listSelectedTeeth,
        patientReason: reason,
        isDental: specialtyData.isDental,
        specialtyData,
        examinationFee,
        additionalFee,
        totalDiscount,
        totalFee: Math.max(examinationFee + additionalFee - totalDiscount, 0),
        additionalFeeDescription,
      });

      if (response && response.errCode === 0) {
        toast.success("Tạo đơn điều trị thành công!");
      } else {
        toast.error("Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.error("Error creating remedy:", error);
      toast.error("Đã xảy ra lỗi!");
    } finally {
      setIsShowLoading(false);
    }
  };

  const handlePushDrugToList = (drug) => {
    let temp = [...listSeletedDrugs];

    temp.push(drug);

    setListSeletedDrugs(temp);

    if (temp) console.log("temp", temp);
  };

  const removeDrugFromTheList = (drugId) => {
    let temp = [...listSeletedDrugs];

    temp = temp.filter((drug) => drug.id != drugId);

    setListSeletedDrugs(temp);
  };

  const handleOnchangeDescriptionUsageDrug = (event, drugId) => {
    let temp = [...listSeletedDrugs];

    temp.map((drug) => {
      if (drug.id == drugId) {
        drug.description_usage = event.target.value;
      }

      return drug;
    });

    setListSeletedDrugs(temp);

    console.log(listSeletedDrugs);
  };

  const handleOnchangeUnitDrug = (event, drugId) => {
    let temp = [...listSeletedDrugs];

    temp.map((drug) => {
      if (drug.id == drugId) {
        drug.unit = event.target.value;
      }

      return drug;
    });

    setListSeletedDrugs(temp);

    console.log(listSeletedDrugs);
  };

  const handleOnchangeAmountDrug = (event, drugId) => {
    let temp = [...listSeletedDrugs];

    temp.map((drug) => {
      if (drug.id == drugId) {
        drug.amount = event.target.value;
      }

      return drug;
    });

    setListSeletedDrugs(temp);

    console.log(listSeletedDrugs);
  };

  const handleFilterDrugs = async () => {
    let res = await filterDrugs({ name: queryDrug });

    let rebuildDrugs = [];
    if (res) rebuildDrugs = handleRebuildDrugsList(res);

    setDrugs(rebuildDrugs);

    if (rebuildDrugs) setListFilterDrugs(rebuildDrugs);
  };

  const handleResetDrugs = async () => {
    setQueryDrug("");
    let res = await filterDrugs({ name: "" });

    let rebuildDrugs = [];
    if (res) rebuildDrugs = handleRebuildDrugsList(res);

    setDrugs(rebuildDrugs);

    if (rebuildDrugs) setListFilterDrugs(rebuildDrugs);
  };

  return (
    <LoadingOverlay
      active={isShowLoading}
      spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
    >
      <div className="row">
        <div class="col-12">
          <h5 className="">
            <FormattedMessage id={"admin.manage-drug.create-prescription"} />
          </h5>
        </div>
      </div>
      <div className="row">
        <div class="col-8">
          <div class="row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.email-patient"} />
              </label>
              <input
                className="form-control"
                type="email"
                value={email}
                // onChange={(event) => handleOnChangeEmail(event)}
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.name-patient"} />
              </label>
              <input
                className="form-control"
                type="text"
                value={patientName}
                // onChange={(event) => this.handleOnChangeEmail(event)}
              />
            </div>
            <div className="col-4">
              <label>Tên dịch vụ</label>
              <input
                className="form-control"
                type="text"
                value={specialtyData?.name || ""}
                readOnly
              />
            </div>
            <div className="col-12 form-group">
              <label>
                <FormattedMessage id={"admin.manage-drug.prescription"} />
              </label>
              {/* <textarea
                      className="form-control"
                      aria-label="With textarea"
                      value={listMedicine}
                      onChange={(event) => handleOnChangeListMedicine(event)}
                    ></textarea> */}
            </div>

            <div class="col-12">
              <div class="row">
                {listSeletedDrugs.map((drug) => {
                  console.log("drug", drug);
                  return (
                    <div class="col-12 form-group">
                      <div class="row align-item-center text-center">
                        <div class="col-4">
                          {" "}
                          <input
                            readonly
                            type="text"
                            value={drug.name}
                            class="form-control"
                            placeholder=""
                          />
                        </div>
                        <div class="col-auto">
                          <select
                            class="form-control"
                            onChange={(event) =>
                              handleOnchangeUnitDrug(event, drug.id)
                            }
                            value={drug.unit}
                          >
                            <option value="chooseUnits">
                              {language == "en" ? "Units" : "Đơn vị"}
                            </option>
                            {language == "vi"
                              ? units.map((unit) => {
                                  return (
                                    <option value={unit.key}>
                                      {unit.valueVi}
                                    </option>
                                  );
                                })
                              : units.map((unit) => {
                                  return (
                                    <option value={unit.key}>
                                      {unit.valueEn}
                                    </option>
                                  );
                                })}
                          </select>
                        </div>
                        <div class="col-1">
                          {" "}
                          <input
                            onChange={(event) =>
                              handleOnchangeAmountDrug(event, drug.id)
                            }
                            type="text"
                            value={drug.amount}
                            class="form-control"
                          />
                        </div>
                        <div class="col-4">
                          {" "}
                          <input
                            onChange={(event) =>
                              handleOnchangeDescriptionUsageDrug(event, drug.id)
                            }
                            type="text"
                            value={drug.desciption}
                            class="form-control"
                            placeholder={
                              language == "en"
                                ? "Enter desription usage"
                                : "Nhập hướng dẫn sử dụng"
                            }
                          />
                        </div>
                        <div class="col-1 d-flex align-items-center">
                          <i
                            onClick={() => removeDrugFromTheList(drug.id)}
                            class="fas fa-trash pointer text-red"
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="row">
            <div class="col-12">
              <FormattedMessage id={"admin.manage-drug.drug-list"} />
              <input
                className="form-control"
                type="text"
                value={queryDrug}
                onChange={(event) => setQueryDrug(event.target.value)}
              />
              <div class="mt-10">
                <button
                  type="button"
                  class="btn btn-primary mr-5"
                  onClick={() => handleFilterDrugs()}
                >
                  <FormattedMessage id="medical-history.apply" />
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleResetDrugs()}
                >
                  <FormattedMessage id="medical-history.reset" />
                </button>
              </div>
              <ul
                class="list-group mt-10"
                style={{ overflowY: "scroll", maxHeight: "400px" }}
              >
                {listFilterDrugs.map((drug) => {
                  return (
                    <li
                      onClick={() => handlePushDrugToList(drug)}
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center pointer"
                    >
                      <span>{drug.name}</span>{" "}
                      <i class="text-primary fas fa-plus-circle"></i>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-8" style={{ marginTop: "20px" }}>
          <div className="row">
            <div className="col-12 form-group">
              <label>Răng điều trị</label>
            </div>
            <div className="col-12">
              <div className="row">
                {listSelectedTeeth.map((tooth) => (
                  <div className="col-12 form-group" key={tooth.code}>
                    <div className="row align-items-center text-center">
                      <div className="col-2">
                        <input
                          readOnly
                          type="text"
                          value={tooth.code}
                          className="form-control"
                        />
                      </div>
                      <div className="col-4">
                        <select
                          className="form-control"
                          value={tooth.serviceId || ""} // Hiển thị giá trị dịch vụ đã chọn
                          onChange={(e) =>
                            handleOnChangeToothService(e, tooth.code)
                          }
                        >
                          <option value="">Chọn dịch vụ</option>
                          {specialties.map((service) => (
                            <option key={service.value} value={service.value}>
                              {service.label} - {formatCurrency(service.price)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-2">
                        <input
                          type="number"
                          className="form-control"
                          value={tooth.discount}
                          placeholder="Nhập giảm giá"
                          onChange={(e) =>
                            handleOnChangeToothDiscount(e, tooth.code)
                          }
                        />
                      </div>

                      {/* Thêm ô nhập note */}
                      <div className="col-3">
                        <input
                          type="text"
                          className="form-control"
                          value={tooth.note || ""}
                          placeholder="Nhập ghi chú"
                          onChange={(e) =>
                            handleOnchangeNoteTooth(e, tooth.code)
                          }
                        />
                      </div>

                      <div className="col-1 d-flex align-items-center">
                        <i
                          onClick={() => removeToothFromTheList(tooth.code)}
                          className="fas fa-trash pointer text-red"
                        ></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div class="col-4" style={{ marginTop: "20px" }}>
          <label>Danh sách răng</label>
          <ul
            class="list-group mt-10"
            style={{ overflowY: "scroll", maxHeight: "400px" }}
          >
            {listFilterTeeth.map((tooth) => (
              <li
                onClick={() => handlePushTeethToList(tooth)}
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center pointer"
              >
                <span>{tooth.code}</span>
                <i class="text-primary fas fa-plus-circle"></i>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-3 form-group" style={{ marginTop: "20px" }}>
          <label>Phí khám</label>
          <input
            type="number"
            className="form-control"
            value={examinationFee}
            readOnly
          />
        </div>

        <div className="col-3 form-group" style={{ marginTop: "20px" }}>
          <label>Chi phí khác</label>
          <input
            type="number"
            className="form-control"
            value={additionalFee}
            onChange={(e) => {
              setAdditionalFee(Number(e.target.value));
              calculateTotals(listSelectedTeeth); // Cập nhật tổng chi phí khi thay đổi
            }}
          />
        </div>

        <div className="col-3 form-group" style={{ marginTop: "20px" }}>
          <label>Tổng giảm giá</label>
          <input
            type="number"
            className="form-control"
            value={totalDiscount}
            readOnly
          />
        </div>

        <div className="col-3 form-group" style={{ marginTop: "20px" }}>
          <label>Chi phí sau cùng</label>
          <input
            type="number"
            className="form-control"
            value={Math.max(examinationFee + additionalFee - totalDiscount, 0)}
            readOnly
          />
        </div>

        {additionalFee > 0 && (
          <div className="col-12 form-group">
            <label>Ghi chú chi phí khác</label>
            <textarea
              className="form-control"
              value={additionalFeeDescription}
              onChange={(e) => setAdditionalFeeDescription(e.target.value)}
              placeholder="Mô tả chi phí khác"
            ></textarea>
          </div>
        )}
        <div class="col-12 form-group">
          <label>
            <FormattedMessage
              id={"admin.manage-drug.more-descriptive-information"}
            />
          </label>
          <textarea
            className="form-control"
            aria-label="With textarea"
            value={desciption}
            onChange={(event) => handleOnChangeDescription(event)}
          ></textarea>
        </div>
      </div>

      <button
        onClick={() => handleCreateRemedyImage()}
        type="button"
        class="btn btn-primary"
      >
        <FormattedMessage id={"admin.manage-drug.btn-create"} />
      </button>
    </LoadingOverlay>
  );
}

// const mapStateToProps = (state) => {
//   return { language: state.app.language, genders: state.admin.genders };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {};
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(CreateRemedy);
