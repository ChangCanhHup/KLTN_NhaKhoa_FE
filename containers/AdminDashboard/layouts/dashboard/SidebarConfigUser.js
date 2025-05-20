// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const SidebarConfigUser = [
  {
    title: "Manage Appointments",
    path: "/admin-dashboard/receptionist/manage-booking",
    icon: getIcon("icon-park:plan"),
  },
  {
    title: "Manage Patients",
    path: "/admin-dashboard/receptionist/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
  {
    title: "Create Booking",
    path: "/admin-dashboard/receptionist/manage-patient",
    icon: getIcon("medical-icon:i-inpatient"),
  },
];

export default SidebarConfigUser;
