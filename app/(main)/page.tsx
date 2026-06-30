import { Container, Avatar ,Button ,Stack} from '@mui/material'
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const RootPage: React.FC = () => {

  
  return (
    <Container sx={{display:'flex', flexDirection:'column',alignItems:'center' }} >
        <Avatar sx={{bgcolor:'primary.main', mt:15, width:80,height:80}}></Avatar>
      <Stack spacing={2} sx={{mt:10,alignItems:'center', justifyContent:'center', width:200}}>
        <Link href="/workout/startworkout" style={{width:'100%'}}>
          <Button fullWidth variant='contained' color='primary' sx={{height:64, px:4, justifyContent:'space-between'}}><AddIcon/>新增紀錄</Button>
        </Link>
        <Link href="/settings" style={{width:'100%'}}>
          <Button fullWidth variant='contained' color='primary' sx={{height:64, px:4, justifyContent:'space-between'}}><SettingsIcon/>設定動作</Button>
        </Link>
        <Link href="/records" style={{width:'100%'}}>
          <Button fullWidth variant='contained' color='primary' sx={{height:64, px:4,justifyContent:'space-between'}}><LibraryBooksIcon/>查看紀錄</Button>
        </Link>
      </Stack>
    </Container>


   
  )
}

export default RootPage
