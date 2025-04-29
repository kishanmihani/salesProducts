// import React from 'react';
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from '@react-pdf/renderer';
// const styles = StyleSheet.create({
//     page: {
//         fontSize: 10,
//         padding: 20,
//         fontFamily: 'Helvetica',
//       },
//       header: {
//         color: '#1F4E79',
//         textAlign: 'center',
//         fontWeight: 'bold',
//         fontSize: 12,
//         marginBottom: 0,
//       },
//       contactInfo: {
//         textAlign: 'center',
//         fontSize: 8,
//         color: '#1F4E79',
//         marginBottom: 5,
//       },
//       sectionRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 5,
//       },
//       leftCol: {
//         width: '50%',
//       },
//       rightCol: {
//         width: '50%',
//       },
//       table: {
//         border: '1 solid black',
//         marginVertical: 10,
//       },
//       tableRow: {
//         flexDirection: 'row',
//       },
//       tableCell: {
//         border: '1 solid black',
//         padding: 4,
//         flex: 1,
//       },
//       bold: {
//         fontWeight: 'bold',
//       },
//       underline: {
//         textDecoration: 'underline',
//       },
//       note: {
//         fontSize: 9,
//         marginTop: 20,
//       },
//       noteheader: {
//         fontSize: 9,
//         marginTop: 20,
//         fontWeight:560
//       },
//       noteItem: {
//         fontSize: 6.5,
//         marginTop: 2,
//       },
//       row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 6,
//       },
//       borderedBox: {
//         border: '1 solid black',
//         paddingHorizontal: 4,
//         paddingVertical: 2,
//         marginHorizontal: 4,
//         fontSize: 10,
//       },
//       text: {
//         fontSize: 10,
//       },
//     })
// export default function InVoicedelivery() {
//   return (
//     <Document >
//         <Page size="A4" style={styles.page}>
//         <Text style={styles.header}>Combust Energy Pvt Ltd</Text>
//       <Text style={[styles.contactInfo,{textAlign:"center"}]}>
//         Unit No. 1608, 16th Floor, Plot No. C-66, Building Name - ONE BKC, G-Block, Bandra Kurla Complex, Bandra (East),</Text>
//         <Text style={styles.contactInfo}> Mumbai-400051, Maharashtra, India
//       </Text>
//       <Text style={styles.contactInfo}>
//         Email: logistic@combustenergy.com </Text>
//         <Text style={styles.contactInfo}>
//          Contact: 9136964775 / 8796856716
//       </Text>

//       <View style={{ borderTop: '1 solid black', marginVertical: 6 }} />

//       <Text style={ { textDecoration: 'underline' ,fontSize:"8px",textAlign:"center",paddingBottom:"8px"}}>DELIVERY ORDER</Text>

//       <View style={styles.sectionRow}>
//         <View style={styles.leftCol}>
//           <Text>Date: 24-Apr-25</Text>
//           <Text style={{paddingTop:20}}>To,</Text>
//           <Text style={[styles.bold,{paddingTop:20,textDecoration:"underline"}]}>AGIES TERMINAL</Text>
//           <Text style={[styles.bold,{textDecoration:"underline"}]}>MANGALORE</Text>
//         </View>
//         <View style={styles.rightCol}>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               DO No. :
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             CEPL/DO/AG 337
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               CHA NAME :
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             JM BAXI & CO
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               BL Number:
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             SELSHNS1124002
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               Inbond BE Number:
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             7634187
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               BE Date:
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             29-08-2024
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               Transporter Name:
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             Self
//             </Text>
//             </View>
//             </View>
//             <View style={{display:"flex",flexDirection:"row",paddingTop:8}}>
//               <View style={{  width: "100%" }}>
//               <Text style={{ width: "100%" ,fontWeight:560}}>
//               Customer Name:
//             </Text>
//               </View>
//               <View style={{width:"100%"}} >
//             <Text style={{ width: "100%" }}>
//             COMBUST ENERGY
//             </Text>
//             </View>
//             </View>
//         </View>
//       </View>

//       <Text style={{ marginTop: 10 }}>Dear Sir,</Text>
//       <Text style={{ marginBottom: 6 }}>
//         We hereby request you to kindly give delivery as per details below:
//       </Text>

//       <View >
//         <View style={styles.tableRow}>
//           <View style={[ { flex: 3 }]}>
//           <View style={styles.row}>
//     <Text style={styles.text}>REF: - </Text>
//     <View style={styles.borderedBox}>
//       <Text>BULK BITUMEN VG 40</Text>
//     </View>
//     <Text style={styles.text}>arrived as per vessel</Text>
//   </View>
//           </View>
//           <View style={styles.tableCell}>
//             <Text style={styles.bold}>MT SELENIA</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text style={styles.bold}>Tank 10</Text>
//           </View>
//         </View>
//       </View>
     
//       <View style={{display:"flex",flexDirection:"row",marginTop:9}}>
//               <View style={{  width: "100%" }}>
              
//               </View>
//               <View style={{width:"50%"}} >
//             <Text style={{ width: "100%", textAlign:"right" }}>
//             Quantity to be issued
//             </Text>
//             </View>
//             <View style={{width:"50%", paddingLeft:10}} >
//             <Text>MTS <Text style={styles.bold}>49.000</Text></Text>
//             </View>
//             </View>

//       <View style={{ marginTop: 40 }}>
//         <Text>For</Text>
//         <Text style={{ marginTop: 10 }}>Combust Energy Private Limited</Text>
//         <Text style={{ marginTop: 30 }}>Authorized Signatory</Text>
//       </View>

//       <Text style={styles.noteHeader}>
//         Please Note: -
//       </Text>
//       <Text style={styles.noteItem}>1. Cargo handed over to buyer/buyer's transporter at Terminal for transportation at buyer's risk and responsibility.</Text>
//       <Text style={styles.noteItem}>2. Transporters are requested to check availability of material with installation and place tankers for deliveries.</Text>
//       <Text style={styles.noteItem}>3. Dispatch Details (Tanker no., L/R No. Qty. & Terminal Gate Pass) to be faxed immediately on email logistics2@blueflameenergy.co. Dispatch details if not received within an hour our liability ceases to issue Tax Invoice and Buyer shall be solely responsible for not getting GST benefit. (in case of depot sale)</Text>
//       <Text style={styles.noteItem}>4. Kindly arrange for all risks transit insurance for the material from EX-above mentioned Terminal to your destination in order to safeguard your interest if any, in case the tanker is detained on its way for want of any documents by the government authorities.</Text>
//       <Text style={styles.noteItem}>5. Any complaints in respect of the quality of the material supplied must be notified to us in writing before unloading of Tanker.</Text>
//       <Text style={styles.noteItem}>6. Any dispute arising out of this will be referred only to Mumbai jurisdiction.</Text>

//         </Page>
//     </Document>
//   )
// }
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    color: '#1F4E79',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 0,
  },
  contactInfo: {
    textAlign: 'center',
    fontSize: 8,
    color: '#1F4E79',
    marginBottom: 5,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  leftCol: {
    width: '50%',
  },
  rightCol: {
    width: '50%',
  },
  table: {
    border: '1 solid black',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    border: '1 solid black',
    padding: 4,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  },
  note: {
    fontSize: 9,
    marginTop: 20,
  },
  noteHeader: {
    fontSize: 9,
    marginTop: 20,
    fontWeight: 560,
  },
  noteItem: {
    fontSize: 6.5,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  borderedBox: {
    border: '1 solid black',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginHorizontal: 4,
    fontSize: 10,
  },
  text: {
    fontSize: 10,
  },
});

// All text moved to variables

export default function InVoicedelivery({content}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{content.companyName}</Text>
        <Text style={[styles.contactInfo, { textAlign: 'center' }]}>{content.addressLine1}</Text>
        <Text style={styles.contactInfo}>{content.addressLine2}</Text>
        <Text style={styles.contactInfo}>{content.email}</Text>
        <Text style={styles.contactInfo}>{content.contact}</Text>

        <View style={{ borderTop: '1 solid black', marginVertical: 6 }} />

        <Text style={{ textDecoration: 'underline', fontSize: '8px', textAlign: 'center', paddingBottom: '8px' }}>
          {content.deliveryOrderTitle}
        </Text>

        <View style={styles.sectionRow}>
          <View style={styles.leftCol}>
            <Text>{content.date}</Text>
            <Text style={{ paddingTop: 20 }}>{content.recipient}</Text>
            <Text style={[styles.bold, { paddingTop: 20, textDecoration: 'underline' }]}>{content.consignee}</Text>
            <Text style={[styles.bold, { textDecoration: 'underline' }]}>{content.location}</Text>
          </View>

          <View style={styles.rightCol}>
            {[
              { label: content.doNoLabel, value: content.doNoValue },
              { label: content.chaLabel, value: content.chaValue },
              { label: content.blLabel, value: content.blValue },
              { label: content.beLabel, value: content.beValue },
              { label: content.beDateLabel, value: content.beDateValue },
              { label: content.transporterLabel, value: content.transporterValue },
              { label: content.customerLabel, value: content.customerValue },
            ].map((item, index) => (
              <View key={index} style={{ display: 'flex', flexDirection: 'row', paddingTop: 8 }}>
                <View style={{ width: '100%' }}>
                  <Text style={{ width: '100%', fontWeight: 560 }}>{item.label}</Text>
                </View>
                <View style={{ width: '100%' }}>
                  <Text style={{ width: '100%' }}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={{ marginTop: 10 }}>{content.salutation}</Text>
        <Text style={{ marginBottom: 6 }}>{content.deliveryNote}</Text>

        <View>
          <View style={styles.tableRow}>
            <View style={{ flex: 3 }}>
              <View style={styles.row}>
                <Text style={styles.text}>{content.refText}</Text>
                <View style={styles.borderedBox}>
                  <Text>{content.product}</Text>
                </View>
                <Text style={styles.text}>{content.arrivalText}</Text>
              </View>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>{content.vesselName}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.bold}>{content.tankNo}</Text>
            </View>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 9 }}>
          <View style={{ width: '100%' }}></View>
          <View style={{ width: '50%' }}>
            <Text style={{ width: '100%', textAlign: 'right' }}>{content.qtyText}</Text>
          </View>
          <View style={{ width: '50%', paddingLeft: 10 }}>
            <Text>
              MTS <Text style={styles.bold}>{content.qtyValue}</Text>
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <Text>{content.authSignatureLine1}</Text>
          <Text style={{ marginTop: 10 }}>{content.authSignatureLine2}</Text>
          <Text style={{ marginTop: 30 }}>{content.authSignatureLine3}</Text>
        </View>

        <Text style={styles.noteHeader}>{content.noteHeader}</Text>
        {content.notes.map((note, i) => (
          <Text key={i} style={styles.noteItem}>{note}</Text>
        ))}
      </Page>
    </Document>
  );
}
