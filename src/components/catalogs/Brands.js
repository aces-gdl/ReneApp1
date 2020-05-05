import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
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

const columns = [
    { id: 'brandId', label: 'ID', minWidth: 170 },
    { id: 'code', label: 'Code', minWidth: 100 },
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
        alignContent:'center',
        width: '95%',
 
    },
    mainContainer: {
         maxHeight:'600px'
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

    const LoadData = (() => {
        var mySearch = values.searchString !== undefined ? values.searchString : '';
        var myURL = '/diavolofiles/ws/Brands/browse?keyword=' + mySearch;

        Axios.get(myURL)
            .then(data => {
                setMyData(data.data);
            })
            .catch(err => {
                console.log(err)
            })
    });

    const editScreen = (
        <div style={modalStyle} className={classes.paper}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Editando</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    className={classes.TextField}
                    label="Codigo"
                    style={{ margin: 10 }}
                    value={values.code}
                    onChange={handleChange('code')}
                />
                <TextField
                    className={classes.TextField}
                    label="Descripción"
                    value={values.description}
                    onChange={handleChange('description')}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<CloseIcon />}
                    className={classes.button}
                    onClick={(event) => onEdit(event, { brandId: 99 })}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={<CheckIcon />}
                    className={classes.button}
                    onClick={(event) => onEdit(event, { brandId: 99 })}>
                    Aplicar
                </Button>
            </div>
        </div>

    );

    useEffect(() => {
        Axios.get('/diavolofiles/ws/Brands/browse?keyword=')
            .then(data => {
                setMyData(data.data);
            })
            .catch(err => {
                console.log(err)
            })

        console.log('Screen Size = w' + window.innerWidth + " x h" + window.innerHeight)
        return () => {
            console.log("Descarga del componente")
        };
    }, [])


    function onSearchClick() {
        LoadData();
    }

    function onEdit(event, id) {
        setIsEditOpen(!isEditOpen);
        console.log('Id:', id.brandId)


    }
    return (
        <>
            <Paper className={classes.root}>
                <div style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            endIcon={<AddCircleOutlineIcon />}
                            onClick={onSearchClick}
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
                                                            <Button onClick={(event) => onEdit(event, row)}>
                                                                <EditIcon />
                                                            </Button>

                                                            <DeleteIcon />
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
            </Paper>

            <div>
                <Modal open={isEditOpen}>
                    {editScreen}
                </Modal>
            </div>
        </>
    );
}
const areEqual = (prevProps, nextProps) => {
    console.log("Props are equal ?");
    return false
};
export default React.memo(Brands, areEqual);