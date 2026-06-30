'use client'

import { Container } from "@mui/material"
import SettingTabs from "@/components/Settings/SettingTabs"

export default function settingsPage() {
    return(
    <Container sx={{textAlign:'center'}}>
        <SettingTabs />
    </Container>
    )
    
}
