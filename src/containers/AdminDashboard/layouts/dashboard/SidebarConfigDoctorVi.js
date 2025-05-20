// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const SidebarConfigDoctorVi = [
  {
    title: "Quản lý bệnh nhân",
    path: "/admin-dashboard/doctor/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
  {
    title: "Quản lý ca khám bệnh",
    path: "/admin-dashboard/doctor/manage-schedule-doctor",
    icon: getIcon("healthicons:i-schedule-school-date-time"),
  },
  {
    title: "Quản lý tất cả bệnh nhân",
    path: "/admin-dashboard/receptionist/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
];

export default SidebarConfigDoctorVi;
