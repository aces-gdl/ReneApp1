import React from 'react'
import '../Catalog.css'
import { Button,  makeStyles } from '@material-ui/core'
import { SnackMessages } from '../utils/SnackMessages';


const useStyles = makeStyles((theme) => ({

}));



const Catalogo2 = (props) => {
    const classes = useStyles();

    const [snackOpen, setSnackOpen] = React.useState(false);

        const handleClose = (()=> {
            setSnackOpen(false);
       })

    return (
        <div className="main-container">
            <div className="header-container">
                <p>Header</p>
            </div>

            <div className="body-container">
                <p>Body</p>
                <SnackMessages MessageType="Error" isOpen={snackOpen} closeIt={handleClose} TextMessage="Hola !!! "/>
                <Button onClick={() => setSnackOpen(true)}>SnackBar </Button>
            </div>
            <div className="footer-container">
                <p>Footer</p>
            </div>
        </div>
    )
}

const areEqual = (prevProps, nextProps) => {
    return false
};
export default React.memo(Catalogo2, areEqual);