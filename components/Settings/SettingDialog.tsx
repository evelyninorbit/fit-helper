import { Dialog, DialogProps } from '@mui/material'
import SettingTabs from './SettingTabs'

const SettingDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog {...props}>
      <SettingTabs />
    </Dialog>
  )
}

export default SettingDialog
