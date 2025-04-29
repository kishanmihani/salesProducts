import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { BorderTop } from "@mui/icons-material";

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    padding: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressBlock: {
    marginVertical: 4,
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    fontWeight: "bold",
    padding: 4,
    border: "1px solid #000",
    width: "16.66%",
  },
  tableCol: {
    padding: 4,
    border: "1px solid #000",
    width: "16.66%",
  },
  tableColWithoutborder: {
    padding: 4,
    borderWidth: "0px",
    width: "16.66%",
  },
  tdSpace: {
    borderBottom: "1px solid black",
    padding: 3,
    width: "100%",
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  total: {
    textAlign: "right",
    padding: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 9,
  },
  sectionRow: {
    flexDirection: "row",
    border: "1 solid black",
  },
  leftSection: {
    width: "60%",
    borderRight: "1 solid black",
    padding: 5,
  },
  rightSection: {
    width: "40%",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  boldText: {
    fontWeight: "bold",
  },
  termItem: {
    marginBottom: 2,
  },
  footerText: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 8,
  },
  signStamp: {
    marginTop: 20,
    marginBottom: 5,
  },
  footerContainer: {
    marginTop: 15,
    borderTop: "1 solid #1F4E79",
    paddingTop: 4,
    textAlign: "center",
    color: "#1F4E79",
  },
});

function InvoicePDF() {
  const [companyName] = useState("COMBUST ENERGY PRIVATE LIMITED");
  const [name] = useState("Combust Energy Private Limited");
  const [whereHouseName] = useState(
    "House No.567, Mahamaya Cross, Sadashivgad, Kadwad, Uttara Kannada, Karnataka, 581352"
  );
  const [cinNumber] = useState("U51909MH2022PTC393430");
  const [GSTIN] = useState("29AAKCC6959P1ZJ");
  const [PAN] = useState("AAKCC6959P");
  const [Godown] = useState(
    "Aegis Vopak Terminals Limited, Plot No P6 & P4, NMPA,between Silver Jubilee Gate and IOCL Terminal, Thannirbhavi Beach Road, Mangalore 575010"
  );
  const [feild] = useState({
    address:
      "4 Floor, C-421 & C-422, 215-Atrium, Andheri Kurla Road Next to Courtyard by Marriott, Andheri East, Mumbai - 400069",
  });
  const footerInfo = [
    "4 Floor, C-421 & C-422, 215-Atrium, Andheri Kurla Road,",
    "Next to Courtyard by Marriott, Andheri East, Mumbai,",
    "Mumbai Suburban, Maharashtra, 400069",
    "Email id : commercial1@combustenergy.com",
    "Phone no: 9867908247 / 8655938583"
  ];
  const tableData = [
    {
      header: ["Sl. No.", "DescriptionHSN Code", "HSN Code", "Quantity M.T Gross", "Quantity M.T Net", "Rate Rs(₹)", "Amount Rs(₹)"],
      rows: [
        [1, "Bitumen VG 40 BULK", "27132000", "27,800", "17.530", "38,220.34", "6,70,002.56"],
        ["", "SUBTOTAL", "", "27,800", "17.530", "-", "6,70,002.56"],
        ["", "Whether TCS Applicable", "", "No", "Total Taxable Value", "", "6,70,002.56"],
        ["", "", "", "", "IGST", "18%", "0.00"],
        ["", "", "", "", "CGST", "8%", "60,300.23"],
        ["", "", "", "", "SGST", "8%", "60,300.23"],
        ["", "", "", "", "TCS", "0.10%", "0.00"],
        ["", "", "", "", "", "Total Invoice Amount", "7,90,603.00"]
      ]
    }
  ];
  const invoiceData = {
    eway: "0",
    godown: Godown,
    customerBillingAddress: {
      company: "BANNARI CONSTRUCTIONS",
      address: "No.4, Giridarshini Layout, T.Narasipura Road, Mysore, Mysuru, Karnataka, 570011",
      gstin: "29AAKFB2209C1ZU",
      stateCode: "29"
    },
    warehouse: {
      name: whereHouseName,
      gstin: GSTIN,
      pan: PAN
    },
    taxInfo: {
      taxInvNo: "95KA2025-26CEPL",
      taxInvDate: "21 April 2025",
      poNo: "BNC/CEPL/25-26/01",
      poDate: "21 April 2025"
    },
    customerDeliveryAddress: {
      company: "BANNARI CONSTRUCTIONS",
      address: "No.4, Giridarshini Layout, T.Narasipura Road, Mysore, Mysuru, Karnataka, 570011",
      gstin: "29AAKFB2209C1ZU",
      stateCode: "29"
    },
    lrNo: "Party a/c",
    motorVehicleNo: "KA550788",
    dispatchFrom: "Aegis Vopak Terminals Limited, Plot No P6 & P4, NMPA, between Silver Jubilee Gate and IOCL Terminal, Thannirbhavi Beach Road, Mangalore 575010",
    payment: "Advance",
    transporter: "Self",
    despatchThrough: "By Road"
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
       <View style={{ border: "1px solid black" }}>
          <View style={styles.header}>
            <Text
              style={{
                textDecoration: "underline",
                fontSize: 9,
                marginBottom: 7,
              }}
            >
              PROFORMA INVOICE - ORIGINAL FOR BUYER
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "580" }}>
              {companyName}
            </Text>
            <Text
              style={{
                textDecoration: "underline",
                fontSize: 9,
                marginBottom: 7,
                marginTop: 7,
              }}
            >
              CIN : {cinNumber}
            </Text>
            <Text>{feild.address}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ border: "1px solid black", width: "100%" }}>
              <Text style={{ width: "100%" }}></Text>
            </View>
            <View
              style={{ border: "1px solid black", padding: 3, width: "100%" }}
            >
              <Text style={{ width: "100%", fontWeight: 560 }}>
                Name &nbsp;: {name}
              </Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View style={{ borderBottom: "1px solid black", width: "100%" }}>
               <View>
                <View style={styles.tdSpace}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ width: "100%" }}>
                      <Text style={{ width: "100%", fontWeight: 560 }}>
                        Eway &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                      </Text>
                    </View>
                    <View style={{ width: "100%" }}>
                      <Text style={{ width: "100%" }}>0</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tdSpace}> <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ width: "100%" }}>
                      <Text style={{ width: "100%", fontWeight: 560 }}>
                        Godown :
                      </Text>
                    </View>
                    <View style={{ width: "100%" }}>
                      <Text style={{ width: "100%" }}>{Godown}</Text>
                    </View>
                  </View></View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ width: "100%", padding: 3 }}>
                    <Text style={{ width: "100%", fontWeight: 560 }}>
                      Customer Billing Address
                    </Text>
                    <Text>{invoiceData.customerBillingAddress.company}</Text>
                    <Text>
                    {invoiceData.customerBillingAddress.address}
                    </Text>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: 6,
                        paddingTop: 20,
                      }}
                    >
                      <View style={{ width: "100%" }}>
                        <Text style={{ width: "100%", fontWeight: 560 }}>
                          GSTIN -
                        </Text>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text style={{ width: "100%" }}>{invoiceData.customerBillingAddress.gstin}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingVertical: 7,
                      }}
                    >
                      <View style={{ width: "100%" }}>
                        <Text style={{ width: "100%", fontWeight: 560 }}>
                          State Code -
                        </Text>
                      </View>
                      <View style={{ width: "100%" }}>
                        <Text style={{ width: "100%" }}>{invoiceData.customerBillingAddress.stateCode}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ border: "1px solid black", width: "100%" }}>
              <Text style={{ width: "100%", padding: 3 }}>
                <Text style={{ fontWeight: 560 }}>Warehouse Address :</Text>{" "}
                {whereHouseName}
              </Text>
              <Text style={{ marginTop: 8, padding: 3 }}>
                <Text style={{ fontWeight: 560 }}>GSTIN :</Text> {GSTIN}
              </Text>
              <Text style={{ marginBottom: 8, padding: 3 }}>
                <Text style={{ fontWeight: 560 }}>PAN &nbsp;&nbsp;&nbsp;:</Text>{" "}
                &nbsp;{PAN}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderTop: 1,
                  borderBottom: 1,
                }}
              >
                <View style={{ width: "100%", borderRight: 1 }}>
                  <Text style={{ width: "100%", padding: 3, fontWeight: 560 }}>
                    Tax Inv No.
                  </Text>
                  <Text style={{ width: "100%", padding: 3 }}>
                    {invoiceData.taxInfo.taxInvNo}
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      width: "100%",
                      padding: 3,
                      borderBottom: 1,
                      fontWeight: 560,
                    }}
                  >
                    Date
                  </Text>
                  <Text style={{ width: "100%", padding: 3 }}>
                  {invoiceData.taxInfo.taxInvDate}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderBottom: 1,
                }}
              >
                <View style={{ width: "100%", borderRight: 1, padding: 3 }}>
                  <Text style={{ width: "100%", fontWeight: 560 }}>PO No.</Text>
                  <Text style={{ width: "100%" }}>{invoiceData.taxInfo.poNo}</Text>
                </View>
                <View style={{ width: "100%", padding: 3 }}>
                  <Text
                    style={{ width: "100%", borderBottom: 1, fontWeight: 560 }}
                  >
                    PO Date.
                  </Text>
                  <Text style={{ width: "100%" }}>{invoiceData.taxInfo.poDate}</Text>
                </View>
              </View>
            </View>

          </View>
          <View
            style={{ display: "flex", flexDirection: "row", borderBottom: 1 }}
          >
            <View style={{ width: "100%", borderRight: 1 }}>
              <Text
                style={{
                  width: "100%",
                  borderBottom: 1,
                  padding: 3,
                  fontWeight: 560,
                }}
              >
                Customer Delivery Address :
              </Text>
              <Text style={{ width: "100%", borderBottom: 1, padding: 3 }}>
              {invoiceData.customerDeliveryAddress.company} :
              </Text>
              <Text style={{ width: "100%", padding: 3 }}>
              {invoiceData.customerDeliveryAddress.address}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: 20,
                  padding: 3,
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text style={{ width: "100%", fontWeight: 560 }}>
                    GSTIN -
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <Text style={{ width: "100%" }}>{invoiceData.customerDeliveryAddress.gstin}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 3,
                  paddingTop: 8,
                  paddingBottom: 7,
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text style={{ width: "100%", fontWeight: 560 }}>
                    State Code -
                  </Text>
                </View>
                <View style={{ width: "100%" }}>
                  <Text style={{ width: "100%" }}>{invoiceData.customerDeliveryAddress.stateCode}</Text>
                </View>
              </View>
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <View style={{ width: "50%", borderRight: 1 }}>
                <Text style={{ width: "100%", fontWeight: 560, padding: 3 }}>
                  LR NO.
                </Text>
                <Text style={{ width: "100%", borderBottom: 1, padding: 3 }}>
                  {invoiceData.lrNo}
                </Text>
              </View>
              <View style={{ width: "50%", padding: 3 }}>
                <Text style={{ width: "100%", fontWeight: 560 }}>
                  Motor Vehicle No.
                </Text>
                <Text style={{ width: "100%" }}>{invoiceData.motorVehicleNo}</Text>
              </View>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={{
                width: "75%",
                borderBottom: 1,
                borderRight: 1,
                padding: 3,
              }}
            >
              <Text style={{ width: "100%", fontWeight: 560 }}>
                Dispatch From :
              </Text>
              <Text>
              {invoiceData.dispatchFrom}
                
              </Text>
            </View>
            <View
              style={{
                width: "25%",
                borderBottom: 1,
                borderRight: 1,
                padding: 3,
              }}
            >
              <Text style={{ width: "100%", fontWeight: 560 }}>Payment :</Text>
              <Text>{invoiceData.payment}</Text>
            </View> <View
              style={{
                width: "50%",
                borderBottom: 1,
                borderRight: 1,
                padding: 3,
              }}
            >
              <Text style={{ width: "100%", fontWeight: 560 }}>
                Transporter
              </Text>
              <Text>{invoiceData.transporter}</Text>
            </View><View
              style={{
                width: "50%",
                borderRight: 1,
                borderBottom: 1,
                padding: 3,
              }}
            >
              <Text style={{ width: "100%", fontWeight: 560 }}>
                Despatch Through
              </Text>
              <Text>{invoiceData.despatchThrough}  </Text>
            </View>
          </View>
          <View style={styles.table}>
  <View style={styles.tableRow}>
    {tableData[0].header.map((header, index) => (
      <Text key={index} style={styles.tableColHeader}>{header}</Text>
    ))}
  </View>

  {tableData[0].rows.map((row, index) => (
    <View key={index} style={styles.tableRow}>
      {row.map((cell, i) => (
        <Text key={i} style={styles.tableCol}>{cell}</Text>
      ))}
    </View>
  ))}
</View></View>
        <View>
          <View style={styles.sectionRow}>
            <View style={styles.leftSection}>
              <Text style={{ fontWeight: 560 }}>#NAME?</Text>
            </View>
            <View style={styles.rightSection}>
              <Text>Amount of Tax subject to</Text>
              <Text>Reverse Charges - NO</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionRow}>
          <View style={styles.leftSection}>
            <Text style={styles.boldText}>Terms & Conditions :</Text>
            <Text style={styles.termItem}>
              1. Interest @24% per annum will be charged on all bills not paid
              within due date.
            </Text>
            <Text style={styles.termItem}>
              2. All disputes under this bill will be settled in Mumbai
              Jurisdiction only.
            </Text>
            <Text style={styles.termItem}>
              3. All disputes regarding this bill will not be entertained unless
              submitted in writing within 3 (Three) days from the receipt of
              this bill.
            </Text>
            <Text style={styles.termItem}>
              4. Our Responsibility ceases as soon as the goods leaves our
              godown.
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text>For Combust Energy Private Limited</Text>
            <Text style={styles.signStamp}>[Stamp & Signature Image Here]</Text>
            <Text style={styles.boldText}>Authorised Signatory</Text>
          </View>
        </View>

        {/* Footer Note */}
        <Text
          style={{ border: "1px solid black", textAlign: "center", padding: 3 }}
        >
          This is a Computer Generated Invoice and does not require signature
        </Text>
        <View style={styles.footerContainer}>
        {footerInfo.map((line, index) => (
    <Text key={index}>{line}</Text>
  ))}
        </View>
      </Page>
    </Document>
  );
}
export default InvoicePDF;

