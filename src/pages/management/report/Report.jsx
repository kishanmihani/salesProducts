import React from 'react'
import CustomPageHeader from '../../../component/commonComponent/CustomPageHeader/CustomPageHeader'
import SalesReportDashboard from './graphs'

export default function Report() {
  return (
    <div>
        <CustomPageHeader pageHeaderText='Report'></CustomPageHeader>
                <div style={{ width: '96%', margin: 'auto', marginBlock: '5px' }}>
                    <SalesReportDashboard />
                </div>
    </div>
  )
}
