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
  const handleClose = () => {
    setOpen(false);
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
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const name = formJson.name;
              Updatename(name);
              handleClose();
            },
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
            label={dropname}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="success">
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
  setBilling: PropTypes.func,
  open: PropTypes.bool,
  label: PropTypes.string,
  apilink: PropTypes.string,
};
AddlistDialogBox.defaultProps = {
  apilink: "",
  label: "",
  open: false,
  setOpen: () => {},
};
