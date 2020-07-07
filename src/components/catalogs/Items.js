import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios';
import { TextField, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import '../Catalog.css';
import { SnackMessages } from '../utils/SnackMessages';
const querystring = require('query-string');


const columns = [
    {
        id: 'code',
        label: 'Código',
        align: 'center',
        minWidth: 50
    },
    {
        id: 'description',
        label: 'Descripción',
        align: 'center',
        minWidth: 150
    },
    {
        id: 'credits',
        label: 'Créditos',
        align: 'center',
        minWidth: 50
    },
    {
        id: 'price',
        label: 'Precio',
        align: 'center',
        minWidth: 50
    },
    {
        id: 'actions',
        label: 'Acciones',
        minWidth: 150,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
];


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 500,

        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[3],
        padding: theme.spacing(2, 4, 3),
    },
    root: {
        alignContent: 'center',
        width: '100%',

    },
    mainContainer: {
        height: '75vh'
    },
    headerRow: {
        color: 'white',
        backgroundColor: 'rgb(12,81,161)'
    },
    modalTitle: {
        color: 'white',
        backgroundColor: 'rgb(12,81,161)'
    },
    dropDown: {
        width: '220px'
    },
    TextField: {
        width: '220px'
    },
}));


const Items = (props) => {
    const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const [modalStyle] = React.useState(getModalStyle);
    const [searchString, setSearchString] = React.useState('');

    const [values, setValues] = React.useState({
        itemId: '',
        code: '',
        description: '',
        credits: '',
        price: '',
    });

    const [mySnack, setMySnack] = React.useState({
        TextMessage: 'Hola Default',
        isOpen: false,
        MessageType: 'Info'
    })

    const handleChangeSearchString = (prop) => (event) => {
        setSearchString(event.target.value);
    };
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const handleSnackClose = (() => {
        setMySnack({ isOpen: false });
    })


    const validateForm = (() => {
        var errorMessage = '';

        if (values.code === '' && errorMessage.length === 0) {
            errorMessage += "Codigo es requerido"
        }
        if (values.description === '' && errorMessage.length === 0) {
            errorMessage += "Descripción es requerida"
        }
        if (values.credits === '' && errorMessage.length === 0) {
            errorMessage += "Creditos es requerido"
        }
        if (values.price === '' && errorMessage.length === 0) {
            errorMessage += "Precio es requerido"
        }
        return errorMessage.length > 0
    })


    const SaveItem = (() => {
        if (validateForm()) {
            return
        }
        const payload = {
            keyId: values.itemId,
            code: values.code,
            description: values.description,
            credits: values.credits,
            price: values.price
        };

        console.log('Payload: ', payload);

        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Items/savePDR', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                const m = response.data.result[1]; 
                if (values.itemId === '') {
                    updateData.push(m);
                    setIsAddOpen(false);
                } else {
                    setIsEditOpen(false);
                    const myIndex = updateData.findIndex(element => element.itemId === m.itemId)
                    updateData[myIndex] = m;
                    setMyData(updateData);
                }
                setMyData(updateData);
                setMySnack({ isOpen: true, MessageType: 'Success', TextMessage: 'Operación exitosa' })
            })
            .catch((err) => {
                console.log(err)
            })
        setIsAddOpen(false)
    });


    const DeleteItem = (() => {

        const payload = {
            'keyId': values.itemId
        };

        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Items/deletePDR/', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                if (response.data.result) {
                    const myIndex = updateData.findIndex(element => element.itemId === values.itemId)
                    updateData = updateData.filter((item, index) => { return index !== myIndex });
                    setMyData(updateData);
                }
            })
            .catch((err) => {
                console.log(err)
            })

        setIsDeleteOpen(false)

    })

    const actionButton = ((action) => {
        if (action === 'edit') return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CloseIcon />}
                    className={classes.button}
                    onClick={() => setIsEditOpen(false)}>
                    Cancelar
            </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<CheckIcon />}
                    className={classes.button}
                    onClick={SaveItem}>
                    Actualizar
            </Button>
            </div>
        )
        if (action === 'delete') return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CloseIcon />}
                    className={classes.button}
                    onClick={() => setIsDeleteOpen(false)}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<DeleteIcon />}
                    className={classes.button}
                    onClick={DeleteItem}>
                    Eliminar
                </Button>
            </div>
        )
        if (action === 'add') return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CloseIcon />}
                    className={classes.button}
                    onClick={() => setIsAddOpen(false)}>
                    Cancelar
            </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AddCircleOutlineIcon />}
                    className={classes.button}
                    onClick={SaveItem}>
                    Agregar
            </Button>
            </div>
        )
    });

    const setTitle = ((action) => {
        if (action === 'add') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Agregar Item</div>
        )
        if (action === 'delete') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Eliminar Item</div>
        )
        if (action === 'edit') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Editar Item</div>
        )
    });

    const editScreen = ((action) => {
        return (
            <div style={modalStyle} className={classes.paper}>
                {setTitle(action)}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        required
                        label="Codigo"
                        value={values.code}
                        onChange={handleChange('code')}
                        className={classes.TextField}
                    />
                    <TextField
                        required
                        label="Descripción"
                        value={values.description}
                        onChange={handleChange('description')}
                        className={classes.TextField}
                    />
                    <TextField
                        required
                        label="Créditos"
                        value={values.credits}
                        onChange={handleChange('credits')}
                        className={classes.TextField}
                    />
                    <TextField
                        required
                        label="Precio"
                        value={values.price}
                        onChange={handleChange('price')}
                        className={classes.TextField}
                    />
                </div>
                {actionButton(action)}
            </div >

        )
    });


    useEffect(() => {
        Axios.get('/diavolofiles/ws/Items/browsePDR?keyword=')
            .then(data => {
                setMyData(data.data.result);
            })
            .catch(err => {
                console.log(err)
            })

        return () => {
            console.log("Descarga del componente")
        };
    }, [values.userId])

    const LoadData = (() => {
        var mySearch = searchString !== undefined ? searchString : '';
        var myURL = '/diavolofiles/ws/Items/browsePDR?keyword=' + mySearch;

        Axios.get(myURL)
            .then(data => {
                console.log('Data : ', data.data.result);
                setMyData(data.data.result);
            })
            .catch(err => {
                console.log(err)
            })
    });

    function onSearchClick() {
        LoadData();
    }

    function onEdit(event, item) {
        setIsEditOpen(true);
        setValues({
            ...values,
            itemId: item.itemId,
            code: item.code,
            description: item.description,
            credits: item.credits,
            price: item.price
        });
        //TODO: Assign values for the edit screen
    };

    function onAdd() {
        setIsAddOpen(true);
        setValues({
            ...values,
            itemId: '',
            code:'',
            description:'',
            credits:'',
            price:''
        });
        //TODO: clear values for the add screen
    };


    function onDelete(event, item) {
        setIsDeleteOpen(true)
        setValues({
            ...values,
            itemId: item.itemId,
        });
        //TODO: Update values to show in the Delete Screen
    }

    return (
        <>
            <div className="main-container">
                <div className="header-container" >
                    <div >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            endIcon={<AddCircleOutlineIcon />}
                            onClick={() => onAdd()}
                        >
                            Agregar
                        </Button>
                    </div>

                    <div style={{ display: 'flex', alignItems: "center", justifyContent: 'flex-end', margin: 2 }}>
                        <TextField

                            className={classes.TextField}
                            label="Buscar..."
                            value={searchString}
                            onChange={handleChangeSearchString('searchString')}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            endIcon={<SearchIcon />}
                            onClick={onSearchClick}
                        >
                            Buscar
                        </Button>
                    </div>
                </div>
                <div className="body-container">
                    <TableContainer className={classes.mainContainer}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow >
                                    {columns.map((column) => (
                                        <TableCell
                                            className={classes.headerRow}
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myData.map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.itemId}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'actions') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div>
                                                                <IconButton onClick={(event) => onEdit(event, row)} >
                                                                    <EditIcon />
                                                                </IconButton>

                                                                <IconButton onClick={(event) => onDelete(event, row)}>
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </div>
                                                        </TableCell>
                                                    )
                                                } else {

                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format ? column.format(value) : value}
                                                        </TableCell>
                                                    )
                                                }
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

            </div>

            <div>
                <Modal open={isEditOpen}>
                    {editScreen('edit')}
                </Modal>
                <Modal open={isAddOpen}>
                    {editScreen('add')}
                </Modal>
                <Modal open={isDeleteOpen}>
                    {editScreen('delete')}
                </Modal>
                <SnackMessages
                    isOpen={mySnack.isOpen}
                    MessageType={mySnack.MessageType}
                    TextMessage={mySnack.TextMessage}
                    closeIt={handleSnackClose} />
            </div>
        </>
    );
}
const areEqual = (prevProps, nextProps) => {
    return false
};
export default React.memo(Items, areEqual);