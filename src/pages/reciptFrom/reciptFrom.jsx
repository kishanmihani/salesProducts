import React, { useEffect, useState } from "react";
import { authAxios } from "../../component/utils/authAxios";
import formatDateToUS from "../../component/utils/DateFormate";
import { useSearchParams } from "react-router";
import { UnpaidRecipt } from "../../component/Config/Api/Api";
import CustomPageHeader from "../../component/commonComponent/CustomPageHeader/CustomPageHeader";
import { Button } from "@mui/material";
import InformAlert from "../../component/commonComponent/informAlert/InformAlert";

const ReceiptForm = () => {
  const [searchParams] = useSearchParams();
  const [encodedData] = useState(searchParams.get("data"));
  const [decodedData] = useState(encodedData ? JSON.parse(decodeURIComponent(encodedData)) : null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const userId = JSON.parse(sessionStorage.getItem("userInfo"))?.id;

  const [formData, setFormData] = useState({ date: "", amount: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [receiptRows, setReceiptRows] = useState([]);
  const [billRows, setBillRows] = useState([]);
  const [receiptAllocationRows, setReceiptAllocationRows] = useState([]);

  // ---------------- API CALL – RECEIPTS ----------------
  const loadReceipts = async () => {
    try {
      const response = await authAxios.post(
        UnpaidRecipt,
        JSON.stringify({ User_id: userId, Customer_Name: decodedData?.customer })
      );
      setReceiptRows(response?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- API CALL – BILLS ----------------
  const loadBills = async (soNo) => {
    try {
      const response = await authAxios.post(
        "BituRep/Api/Account/Recipt_Detail_View",
        JSON.stringify({ User_id: userId, So_No: soNo })
      );
      setBillRows(response?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadReceipts(); }, [decodedData?.customer]);
  useEffect(() => { loadBills(decodedData?.so_no); }, [decodedData?.so_no]);

  // ---------------- RECEIPT CHECKBOX ----------------
  const handleReceiptCheckboxChange = (receiptNo) => {
    const updatedList = receiptRows.map(row =>
      row.receipt_No === receiptNo ? { ...row, selected: !row.selected } : row
    );
    setReceiptRows(updatedList);
  };

  // ---------------- BILL CHECKBOX ----------------
  const handleBillCheckboxChange = (id) => {
    const updated = billRows.map(row => {
      if (row.id === id) {
        const newRow = { ...row, selected: !row.selected };
        if (newRow.selected) {
          setReceiptAllocationRows(prev => [
            ...prev,
            {
              id: newRow.id,
              date: newRow.entry_Date,
              vehicle: newRow.vehicle_Name,
              qty: newRow.a_Qty,
              billAmt: newRow.b_Amount,
              billBalAmt: newRow.b_Bal_Amount,
              billNo: newRow.billNo || "",
              receiptAmt: newRow.b_Bal_Amount,    // set Receipt Amt = Balance
              creditNote: newRow.creditNote || "", // copy Credit Note
              tds: 0,
              balance: newRow.b_Bal_Amount
            }
          ]);
        } else {
          setReceiptAllocationRows(prev => prev.filter(r => r.id !== newRow.id));
        }
        return newRow;
      }
      return row;
    });
    setBillRows(updated);
  };

  // ---------------- ALLOCATION CHANGE ----------------
  const handleAllocationChange = (id, field, value) => {
    setReceiptAllocationRows(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          updatedRow.receiptAmt = Number(updatedRow.receiptAmt);
          updatedRow.tds = Number(updatedRow.tds);
          updatedRow.balance = updatedRow.billAmt - updatedRow.receiptAmt - updatedRow.tds;
          return updatedRow;
        }
        return row;
      })
    );
  };

  // ---------------- CALCULATIONS ----------------
  const totalAmount = receiptRows
    .filter(r => r.selected)
    .reduce((sum, r) => sum + Number(r.balance || 0), 0);

  const totalReceiptAllocated = receiptAllocationRows.reduce(
    (sum, row) => sum + Number(row.receiptAmt || 0),
    0
  );

  const remainingAmount = totalAmount - totalReceiptAllocated;

  // ---------------- SUBMIT RECEIPT ENTRY ----------------
  const handleReceiptEntrySubmit = () => {
    const payload = {
      user_id: userId,
      Customer_Name: decodedData.customer,
      Entry_Date: formData.date,
      So_No: decodedData.so_no,
      Tds: 0,
      Amount: formData.amount,
      Recipt_type: decodedData.Payment_Type,
    };
    authAxios
      .post("/BituRep/Api/Account/Recipt_Entry_insert", JSON.stringify(payload))
      .then(res => {
        if (res.data?.massage === "Data insert") {
          loadReceipts();
          setShowPopup(false);
        }
      })
      .catch(err => console.error(err));
  };

  // ---------------- FINAL SUBMIT ----------------
  const handleFinalSubmit = () => {
    // const missingIndex = receiptAllocationRows.findIndex(row => !row.billNo);
    // if (missingIndex !== -1) {
    //   setAlertMsg(`Bill Number missing in row ${missingIndex + 1}`);
    //   setAlertOpen(true);
    //   return;
    // }
    const payload = {
      receipts: receiptRows
        .filter(r => r.selected)
        .map(r => ({ reciptNO: r.receipt_No, balance: Number(r.balance) })),
      bills: receiptAllocationRows.map(b => ({
        Bill_Id: b.id,
        Bill_NO: b.billNo,
        Bill_Rec_Amt: Number(b.receiptAmt),
        Bill_Tds: b.tds,
        CreditNote: b.discount || ""

      }))
    };
    authAxios
      .post("BituRep/Api/Account/Recipt_Submit", JSON.stringify(payload))
      .then(() => alert("Data submitted successfully"))
      .catch(err => console.log(err));
  };

  // ---------------- STYLES ----------------
  const tableStyle = { width: "100%", borderCollapse: "collapse" };
  const cellStyle = { border: "1px solid black", padding: "8px" };
  const scrollStyle = { maxHeight: "240px", overflowY: "auto" };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "98%" }}>
        <CustomPageHeader pageHeaderText="Receipt Form" />
        <div style={{ display: "flex", gap: "20px", width: "100%", margin: 4, marginTop: 10 }}>
          <div>
            <label style={{ fontWeight: 600 }}>SO No</label> :
            <input type="text" value={decodedData.so_no} readOnly />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Customer Name</label> :
            <input type="text" value={decodedData.customer} readOnly />
          </div>
          <Button onClick={() => setShowPopup(true)} variant="contained" color="error">Add Receipt</Button>
        </div>

        {/* TABLES SIDE-BY-SIDE */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* RECEIPT TABLE */}
          <div style={{ width: "50%", ...scrollStyle }}>
            <h3>Outstanding Receipt Detail</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>Receipt No</th>
                  <th style={cellStyle}>Date</th>
                  <th style={cellStyle}>Amount</th>
                  <th style={cellStyle}>Balance</th>
                  <th style={cellStyle}>Select</th>
                </tr>
              </thead>
              <tbody>
                {receiptRows.map(row => (
                  <tr key={row.receipt_No}>
                    <td style={cellStyle}>{row.receipt_No}</td>
                    <td style={cellStyle}>{formatDateToUS( row.date)}</td>
                    <td style={cellStyle}>{row.amount}</td>
                    <td style={cellStyle}>{row.balance}</td>
                    <td style={cellStyle}>
                      <input
                        type="checkbox"
                        checked={row.selected || false}
                        onChange={() => handleReceiptCheckboxChange(row.receipt_No)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BILL TABLE */}
          <div style={{ width: "50%", ...scrollStyle }}>
            <h3>Bill Detail</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Date</th>
                  <th style={cellStyle}>Vehicle</th>
                  <th style={cellStyle}>Qty</th>
                  <th style={cellStyle}>Amt</th>
                  <th style={cellStyle}>Balance</th>
                  <th style={cellStyle}>Bill No</th>
                  <th style={cellStyle}>Credit Note</th>
                  <th style={cellStyle}>Select</th>
                </tr>
              </thead>
              <tbody>
                {billRows.map(row => (
                  <tr key={row.id}>
                    <td style={cellStyle}>{row.id}</td>
                    <td style={cellStyle}>{formatDateToUS(row.entry_Date)}</td>
                    <td style={cellStyle}>{row.vehicle_Name}</td>
                    <td style={cellStyle}>{row.a_Qty}</td>
                    <td style={cellStyle}>{row.b_Amount}</td>
                    <td style={cellStyle}>{row.b_Bal_Amount}</td>
                    <td style={cellStyle}>{row.bill || ""} </td>
                    <td style={cellStyle}>{row.discount || ""}</td>
                    <td style={cellStyle}>
                      <input
                        type="checkbox"
                        checked={row.selected || false}
                        onChange={() => handleBillCheckboxChange(row.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTAL AMOUNT */}
        <div style={{ marginTop: "20px" }}>
          <label><b>Total Amount: </b></label>
          <input value={totalAmount} readOnly style={{ width: "200px" }} />
        </div>

        {/* ALLOCATION TABLE */}
        <div style={{ marginTop: "20px", ...scrollStyle }}>
          <h3>Receipt Allocation</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Date</th>
                <th style={cellStyle}>Vehicle</th>
                <th style={cellStyle}>Qty</th>
                <th style={cellStyle}>Bill Amt</th>
                <th style={cellStyle}>Balance</th>
                <th style={cellStyle}>Bill No</th>
                <th style={cellStyle}>Receipt Amt</th>
                <th style={cellStyle}>Credit Note</th>
                <th style={cellStyle}>TDS</th>
                <th style={cellStyle}>Net Bal</th>
              </tr>
            </thead>
            <tbody>
              {receiptAllocationRows.map(row => (
                <tr key={row.id}>
                  <td style={cellStyle}>{formatDateToUS(row.date)}</td>
                  <td style={cellStyle}>{row.vehicle}</td>
                  <td style={cellStyle}>{row.qty}</td>
                  <td style={cellStyle}>{row.billAmt}</td>
                  <td style={cellStyle}>{row.billBalAmt}</td>
                  <td style={cellStyle}>
                    <input
                      type="text"
                      value={row.billNo}
                      onChange={(e) => handleAllocationChange(row.id, "billNo", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="number"
                      value={row.receiptAmt}
                      onChange={(e) => handleAllocationChange(row.id, "receiptAmt", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="text"
                      value={row.creditNote || ""}
                      onChange={(e) => handleAllocationChange(row.id, "creditNote", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={cellStyle}>
                    <input
                      type="number"
                      value={row.tds}
                      onChange={(e) => handleAllocationChange(row.id, "tds", e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={cellStyle}>{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* REMAINING AMOUNT */}
        <div style={{ marginTop: "20px" }}>
          <label><b>Remaining Amount: </b></label>
          <input value={remainingAmount} readOnly style={{ width: "200px" }} />
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
          <button
            onClick={handleFinalSubmit}
            style={{ padding: "8px 20px", backgroundColor: "green", color: "white" }}
          >
            Submit
          </button>
          <button
            onClick={() => {
              setReceiptRows([]);
              setBillRows([]);
              setReceiptAllocationRows([]);
            }}
            style={{ padding: "8px 20px", backgroundColor: "gray", color: "white" }}
          >
            Cancel
          </button>
        </div>

        {/* POPUP */}
        {showPopup && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "350px" }}>
              <h3>Add Receipt</h3>
              <label>Date</label>
              <input
                type="date"
                style={{ width: "100%", marginBottom: "10px" }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <label>Amount</label>
              <input
                type="number"
                style={{ width: "100%", marginBottom: "10px" }}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="error" onClick={() => setShowPopup(false)}>Close</Button>
                <Button variant="contained" color="success" onClick={handleReceiptEntrySubmit}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <InformAlert open={alertOpen} message={alertMsg} onClose={() => setAlertOpen(false)} />
    </div>
  );
};

export default ReceiptForm;
