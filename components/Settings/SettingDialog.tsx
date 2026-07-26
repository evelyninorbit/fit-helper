import { Dialog, DialogProps } from "@mui/material";
import SettingTabs from "./SettingTabs";

const SettingDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog
      {...props}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { height: "80vh", bgcolor: "secondary.main" } } }}
    >
      <SettingTabs />
    </Dialog>
  );
};

export default SettingDialog;
