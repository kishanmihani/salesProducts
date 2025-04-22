import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import { authAxios } from "../../utils/authAxios";
export default function AddlistDialogBox({
  open,
  setOpen,
  label,
  apilink,
  dropname,
  paramName,
  userId,
  setAddtolist,
}) {
  
  const [selectedName,setSelectedName] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const handleClose = () => {
    setOpen(false);
    setAddtolist("Select");
  };
  function Updatename(name) {
    let keyname = paramName;
    authAxios
      .post(
        apilink,
        JSON.stringify({
          user_id: userId,
          [keyname]: name,
        })
      )
      .then((response) => {
        if (response?.data?.[0]?.massage === "Entry Inserted") {
          setAddtolist(name);
          handleClose();
        } else {
          Invalid_alert(response?.data?.[0]?.massage);
        }
      })
      .catch((err) => Invalid_alert(err?.data?.[0]?.massage));
  }
  function Success_alert(data) {
    toast.success(data, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  function Invalid_alert(data) {
    toast.warn(data, {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  function handlesubmit(){
      if(selectedName!==""){
        setErrors("");
        Updatename(selectedName);
        setOpen(false);
      }else if(selectedName == ""){
        setErrors(`${[dropname]} is required`);
      }
     
      
      
  }
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        slotProps={{
          paper: {
            component: "form"
          },
        }}
      >
        <DialogTitle>{label}</DialogTitle>
        <DialogContentText p={3} pt={0} pb={0}>
          Please enter your {dropname} here. We will directly add to list.
        </DialogContentText>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            value={selectedName}
            onChange={(e)=>setSelectedName(e.target.value)}
            label={dropname}
            type="text"
            error={!!errors}
            helperText={errors}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button variant="contained" type="button" onClick={handlesubmit} color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      ></ToastContainer>
    </React.Fragment>
  );
}

AddlistDialogBox.propType = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  label: PropTypes.string,
  apilink: PropTypes.string,
  paramName:PropTypes.string,
  setAddtolist:PropTypes.func,
  userId:PropTypes.string,
};
AddlistDialogBox.defaultProps = {
  apilink: "",
  label: "",
  open: false,
  setOpen: () => {},
  userId:"",
  dropname:"",
  paramName:"",
  setAddtolist:() => {}
};
