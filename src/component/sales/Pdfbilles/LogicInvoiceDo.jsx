import React from 'react'
import { PDFViewer } from '@react-pdf/renderer';

import CustomPageHeader from '../../commonComponent/CustomPageHeader/CustomPageHeader'
import InVoicedelivery from '../../commonComponent/PdfIntegrations/InVoicedelivery';
export default function LogicInvoiceDo({content}) {
  return (
    <React.Fragment>
        <CustomPageHeader pageHeaderText="Logistic InVoice delivery" />
        {/* <PDFViewer  width={"100%"} height={"100%"}>
          
            <InVoicedelivery />
          </PDFViewer> */}
          <PDFDownloadLink
  document={<InVoicedelivery content={content} />}
  fileName="DeliveryOrder.pdf"
>
  {({ loading }) => (loading ? 'Preparing document...' : 'Download Delivery Order')}
</PDFDownloadLink>
         
        </React.Fragment>
  )
}
