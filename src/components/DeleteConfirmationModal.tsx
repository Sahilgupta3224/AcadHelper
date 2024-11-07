import { Box, Button, Modal, Typography } from '@mui/material'
import React from 'react'

function DeleteConfirmationModal({handleCloseModal,open,DeleteChallenge}) {
  return (
    <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
              p: 4,
              outline: 'none',
              zIndex: 1300,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
              Confirm Delete
            </Typography>
            <Typography id="modal-description" sx={{ mb: 4 }}>
              Are you sure you want to delete this challenge?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal} color="primary" sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button onClick={DeleteChallenge} variant="contained" color="secondary">
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
  )
}

export default DeleteConfirmationModal
