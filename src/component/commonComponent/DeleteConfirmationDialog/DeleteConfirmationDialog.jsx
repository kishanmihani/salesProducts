
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, itemToDelete }) {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(itemToDelete);
    onClose();
  };
//  console.log(JSON.stringify(itemToDelete))
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        {itemToDelete ? (
          <>
            <Typography>Are you sure you want to delete the following order?</Typography>
            <Typography variant="body2" sx={{display:"flex"}} ><Typography  sx={{width:"100px",fontWeight:800}}>Order ID:</Typography> {itemToDelete.table_id}</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Customer:</Typography> {itemToDelete.customer_Name}</Typography>
            <Typography variant="body2"sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}} >Product:</Typography> {itemToDelete.quantity}</Typography>
            <Typography variant="body2"sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Quantity:</Typography> {itemToDelete.quantity}</Typography>
          </>
        ) : (
          'No item selected.'
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;