import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import { MyDocument } from '../../commonComponent/PdfIntegrations/MyDocument'
import InvoicePDF from '../../commonComponent/PdfIntegrations/InVoicePdf'
import CustomPageHeader from '../../commonComponent/CustomPageHeader/CustomPageHeader'

import InVoicedelivery from '../../commonComponent/PdfIntegrations/InVoicedelivery'
export default function Pdfbilles() {
    // const [onPdf,setOnPdf] = useState(false)
  return (
    <React.Fragment>
    <CustomPageHeader pageHeaderText="Logistic Invoice Bill" />
    <PDFViewer  width={"100%"} height={"100%"}>
        <InvoicePDF  />
        {/* <InVoicedelivery /> */}
      </PDFViewer>
     
    </React.Fragment>
  )
}
