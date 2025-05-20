// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const SidebarConfigUserVi = [
  {
    title: "Thêm lịch khám bệnh",
    path: "/admin-dashboard/receptionist/create-booking",
    icon: getIcon("mdi:calendar-plus"), // Ví dụ icon lịch với dấu cộng
  },
  {
    title: "Quản lý đặt lịch",
    path: "/admin-dashboard/receptionist/manage-booking",
    icon: getIcon("healthicons:i-schedule-school-date-time"),
  },
  {
    title: "Quản lý bệnh nhân",
    path: "/admin-dashboard/receptionist/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
  {
    title: "Quản lý hóa đơn", // Tiêu đề mục mới
    path: "/admin-dashboard/receptionist/manage-bills", // Đường dẫn đến trang quản lý hóa đơn
    icon: getIcon("mdi:clipboard-text-clock-outline"), // Icon cho hóa đơn
  },
];

export default SidebarConfigUserVi;
