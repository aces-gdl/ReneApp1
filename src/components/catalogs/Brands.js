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
import '../Catalog.css';

const querystring = require('query-string');


const columns = [
    { id: 'code', label: 'Código', minWidth: 100 },
    {
        id: 'description',
        label: 'Descripción',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'actions',
        label: 'Acciones',
        minWidth: 170,
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
        width: 400,

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
    }
}));

const Brands = (props) => {
    const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const [modalStyle] = React.useState(getModalStyle);


    const [values, setValues] = React.useState({
        searchString: '',
        brandId: '',
        code: '',
        description: '',
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const UpdateBrand = ((event) => {

        const payload = {
            'keyId': values.brandId,
            'code': values.code,
            'description': values.description,
        };
        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Brands/savePDR', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                const m = response.data.result[1];
                const myIndex = updateData.findIndex(element => element.brandId === m.brandId)
                updateData[myIndex] = response.data.result[0];
                setMyData(updateData);
            })
            .catch((err) => {
                console.log(err)
            })

        setIsEditOpen(false)
    });

    const AddBrand = ((event) => {

        const payload = {
            'keyId': '',
            'code': values.code,
            'description': values.description,
        };
        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Brands/savePDR', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                const m = response.data.result[1]; // take [1]
                updateData.push(m);
                setMyData(updateData);
            })
            .catch((err) => {
                console.log(err)
            })

        setIsAddOpen(false)
    });

    const DeleteBrand = (() => {
        const payload = {
            'keyId': values.brandId
        };
        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Brands/deletePDR/', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                if (response.data.result) {
                    const myIndex = updateData.findIndex(element => element.brandId === values.brandId)
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
                    onClick={UpdateBrand}>
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
                    onClick={DeleteBrand}>
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
                    onClick={AddBrand}>
                    Agregar
            </Button>
            </div>
        )
    });

    const setTitle = ((action) => {
        if (action === 'add') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Agregar Marca</div>
        )
        if (action === 'delete') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Eliminar Marca</div>
        )
        if (action === 'edit') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Editar Marca</div>
        )
    });

    const editScreen = ((action) => {
        return (
            <div style={modalStyle} className={classes.paper}>
                {setTitle(action)}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        className={classes.TextField}
                        label="Codigo"
                        style={{ margin: 10 }}
                        value={values.code}
                        onChange={handleChange('code')}
                        inputProps={{ maxLength: 4 }}
                        disabled={action === 'delete'}
                    />
                    <TextField
                        className={classes.TextField}
                        style={{ margin: 10 }}
                        label="Descripción"
                        value={values.description}
                        onChange={handleChange('description')}
                        disabled={action === 'delete'}
                    />
                </div>
                {actionButton(action)}
            </div>

        )
    });

    useEffect(() => {
        Axios.get('/diavolofiles/ws/Brands/browsePDR?keyword=')
            .then(data => {
                const tempData = data.data.result;
                setMyData(tempData);
            })
            .catch(err => {
                console.log(err)
            })

        return () => {
            console.log("Descarga del componente")
        };
    }, [])

    const LoadData = (() => {
        var mySearch = values.searchString !== undefined ? values.searchString : '';
        var myURL = '/diavolofiles/ws/Brands/browsePDR?keyword=' + mySearch;

        Axios.get(myURL)
            .then(data => {
                const tempData = data.data.result;
                setMyData(tempData);
            })
            .catch(err => {
                console.log(err)
            })
    });

    function onSearchClick() {
        LoadData();
    }

    function onEdit(event, brand) {
        setIsEditOpen(true);
        setValues({
            ...values,
            brandId: brand.brandId,
            code: brand.code,
            description: brand.description
        });
    };

    function onAdd() {
        setIsAddOpen(true);
        setValues({
            ...values,
            brandId: '',
            code: '',
            description: ''
        });
    };

    function onDelete(event, brand) {
        setIsDeleteOpen(true)
        setValues({
            ...values,
            brandId: brand.brandId,
            code: brand.code,
            description: brand.description
        });
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
                            value={values.searchString}
                            onChange={handleChange('searchString')}
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'actions') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div style={{}}>

                                                                <Button onClick={(event) => onEdit(event, row)}>
                                                                    <EditIcon />
                                                                </Button>

                                                                <Button onClick={(event) => onDelete(event, row)}>
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    )
                                                } else {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number' ? column.format(value) : value}
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

            </div>
        </>
    );
}
const areEqual = (prevProps, nextProps) => {
    return false
};
export default React.memo(Brands, areEqual);