import React from 'react'
import '../Catalog.css'
import CloseIcon from '@material-ui/icons/Close';
import { green, amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
    snackbarSuccess: {
        backgroundColor: green[600]
    },
    snackbarError: {
        backgroundColor: theme.palette.error.dark
    },
    snackbarWarning: {
        backgroundColor: amber[700]
    },
    snackbarInfo: {
        backgroundColor: theme.palette.primary.dark
    },

}));


export const SnackMessages = (props) => {
    const classes = useStyles();


    const ErrorType ={
        "aria-describedby": "message-id",
        className: classes.snackbarError
    }

    const SuccessType ={
        "aria-describedby": "message-id",
        className: classes.snackbarSuccess
    }

    const InfoType ={
        "aria-describedby": "message-id",
        className: classes.snackbarInfo
    }
    const WarningType ={
        "aria-describedby": "message-id",
        className: classes.snackbarWarning
    }
    
    
    let  myStyle;
    if (props.MessageType === 'Error'){
        myStyle = ErrorType
    }else if (props.MessageType === 'Success'){
        myStyle = SuccessType
    }else if (props.MessageType === 'Info'){
        myStyle = InfoType
    }else if (props.MessageType === 'Warning'){
        myStyle = WarningType
    }

        const SnackSuccess = (() => {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                open={props.isOpen}
                autoHideDuration={3000}
                onClose={props.closeIt}

                ContentProps={myStyle}
                message={
                    <span id="message-id">
                        <div>{props.TextMessage}
                        </div>
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={props.closeIt}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        )
    })


    return (
        <SnackSuccess />
    )
}

SnackMessages.propTypes = {
    closeIt: PropTypes.func.isRequired,
    MessageType: PropTypes.oneOf(['Success', 'Warning', 'Error', 'Info']),
    isOpen: PropTypes.bool.isRequired,
    TextMessage: PropTypes.string,
  };
