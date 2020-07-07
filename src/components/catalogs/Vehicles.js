import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Axios from 'axios';
import { TextField, Button, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import BrandDropdown from '../dropdowns/BrandDropdown';
import '../Catalog.css';
import { ModelDropdown } from '../dropdowns/ModelDropdown';
import { GenerationDropdown } from '../dropdowns/GenerationDropdown';
import { FuelTypeDropdown } from '../dropdowns/FuelTypeDropdown';
import { EnginesDropdown } from '../dropdowns/EnginesDropdrown';
import StagesDropdown from '../dropdowns/StagesDropdown';
import uuid from 'react-uuid';
import { SnackMessages } from '../utils/SnackMessages';
const querystring = require('query-string');


const columns = [
    {
        id: 'workOrderId',
        label: 'WO',
        align: 'center',
        minWidth: 50
    },
    {
        id: 'wosCode',
        label: 'Status',
        align: 'center',
        minWidth: 50
    },
    {
        id: 'brand',
        label: 'Marca',
        minWidth: 70
    },
    {
        id: 'model',
        label: 'Modelo',
        minWidth: 50,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'generation',
        label: 'Generación',
        minWidth: 120,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'engine',
        label: 'Motor',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'fuelType',
        label: 'Comb.',
        minWidth: 80,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'year',
        label: 'Año',
        minWidth: 60,
        align: 'center',

    },
    {
        id: 'woCreationDate',
        label: 'F. Creación',
        minWidth: 150,
        align: 'center',
        format: (value) => {
            const d = new Date(value);
            return d.toLocaleDateString();
        },
    },
    {
        id: 'stageCode',
        label: 'Etapa',
        minWidth: 60,
        align: 'center',

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
    Button: {

    },
}));

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const Vehicles = (props) => {
    const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [myFile, setMyFile] = React.useState(null);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const [modalStyle] = React.useState(getModalStyle);
    const [searchString, setSearchString] = React.useState('');

    const [values, setValues] = React.useState({
        userId: 2,
        vehicleId: '',
        brandId: '',
        modelId: '',
        generationId: '',
        fuelTypeId: '',
        engineId: '',
        year: '',
        gearbox: '',
        ecu: '',
        hardware: '',
        software: '',
        originalFile:'',
        fileName:''
    });

    const [mySnack, setMySnack] = React.useState({
        TextMessage: 'Hola Default',
        isOpen: false,
        MessageType: 'Info'
    })

    const updateBrandIdFromChild = (dataFromChild) => {
        setValues({ ...values, brandId: dataFromChild });
    };
    const updateModelIdFromChild = (dataFromChild) => {
        setValues({ ...values, modelId: dataFromChild });
    };
    const updateGenerationIdFromChild = (dataFromChild) => {
        setValues({ ...values, generationId: dataFromChild });
    };
    const updateFuelTypeIdFromChild = (dataFromChild) => {
        setValues({ ...values, fuelTypeId: dataFromChild });
    };
    const updateEngineIdFromChild = (dataFromChild) => {
        setValues({ ...values, engineId: dataFromChild });
    };
    const updateStageIdFromChild = (dataFromChild) => {
        setValues({ ...values, stageId: dataFromChild });
    };

    const handleChangeSearchString = (prop) => (event) => {
        setSearchString(event.target.value);
    };
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const handleFileChange = (e) => {
        if (e.target.files.length >= 1) {
            setMyFile(e.target.files[0]);
            var newName = e.target.files[0].name;
            newName = uuid() + newName.substr(newName.lastIndexOf('.'), newName.length);
            setValues({...values, fileName: newName });
        }
    }

    const handleSnackClose = (() => {
        setMySnack({ isOpen: false });
    })

    const UploadFile = (() => {
        if (validaForm()) {
            return
        }

        if (myFile === null) {
            SaveVehicle();
            setIsEditOpen(false);
            setIsAddOpen(false);
            return;
        }

        var file = myFile;
        var formData = new FormData();

        formData.append("file", file);
        formData.append("DIRECTORY", "tmp");
        formData.append("FINAL_FILE_NAME", values.fileName);

        Axios(
            {
                url: '/diavolofiles/FileUploaderLocal',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            })
            .then((response) => {
                console.log('response', response);
                SaveVehicle();
                setIsEditOpen(false);
                setIsAddOpen(false);
                setMySnack({ isOpen: true, MessageType: 'Success', TextMessage: 'Carga de imagen exitosa' })
                setMyFile(null);
                setValues({ ...values,fileName:''});
            })
            .catch((err) => {
                console.log(err)
            })
    });


    const validaForm = (() => {
        var errorMessage = '';

        if (values.brandId === '' && errorMessage.length === 0) {
            errorMessage += "Marca es requerida"
        }
        if (values.modelId === '' && errorMessage.length === 0) {
            errorMessage += "Modelo es requerido"
        }
        if (values.generationId === '' && errorMessage.length === 0) {
            errorMessage += "Generación es requerida"
        }
        if (values.fuelTypeId === '' && errorMessage.length === 0) {
            errorMessage += "Tipo de Gasolina es requerida"
        }
        if (values.engineId === '' && errorMessage.length === 0) {
            errorMessage += "Tipo de motor es requerido"
        }
        if (values.generationId === '' && errorMessage.length === 0) {
            errorMessage += "Generación es requerida"
        }
        if (values.year === '' && errorMessage.length === 0) {
            errorMessage += "Año es requerida"
        }
        if (values.gearbox === '' && errorMessage.length === 0) {
            errorMessage += "Caja de cambios es requerida"
        }
        if (values.ecu === '' && errorMessage.length === 0) {
            errorMessage += "ECU es requerida"
        }
        if (values.hardware === '' && errorMessage.length === 0) {
            errorMessage += "Hardware es requerido"
        }
        if (values.fileName === ''
            && errorMessage.length === 0
            && myFile === null
            && values.vehicleId === '') {
            errorMessage += "Archivo es requerido"
        }
        if (values.stageId === '' && errorMessage.length === 0) {
            errorMessage += "Etapa es requerida"
        }
        if (errorMessage.length > 0) {
            setMySnack({ isOpen: true, TextMessage: errorMessage, MessageType: 'Error' });
        }

        return errorMessage.length > 0
    })


    const SaveVehicle = (() => {

        const payload = {
            keyId: values.vehicleId,
            userId: values.userId,
            engineId: values.engineId,
            year: values.year,
            gearbox: values.gearbox,
            ecu: values.ecu,
            hardware: values.hardware,
            software: values.software,
            stageId: values.stageId,
            originalFile: values.fileName,
        };

        console.log('Payload: ', payload);

        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Vehicles/savePDR', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                const m = response.data.result[1]; // take [1]

                if (values.vehicleId === '') {
                    updateData.push(m);
                    setIsAddOpen(false);
                } else {
                    setIsEditOpen(false);
                    const myIndex = updateData.findIndex(element => element.vehicleId === m.vehicleId)
                    updateData[myIndex] = m;
                }
      
                 setMyData(updateData);
                setMySnack({ isOpen: true, MessageType: 'Success', TextMessage: 'Operación exitosa' })
            })
            .catch((err) => {
                console.log(err)
            })
        setIsAddOpen(false)
    });


    const DeleteVehicle = (() => {

        const payload = {
            'keyId': values.vehicleId
        };

        const xPayload = querystring.stringify(payload);
        Axios.post('/diavolofiles/ws/Vehicles/deletePDR/', xPayload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then((response) => {
                var updateData = [...myData];
                if (response.data.result) {
                    const myIndex = updateData.findIndex(element => element.vehicleId === values.vehicleId)
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
                    onClick={UploadFile}>
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
                    onClick={DeleteVehicle}>
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
                    onClick={UploadFile}>
                    Agregar
            </Button>
            </div>
        )
    });

    const setTitle = ((action) => {
        if (action === 'add') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Agregar Vehiculo</div>
        )
        if (action === 'delete') return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Eliminar Vehiculo</div>
        )
        if (action === 'edit') return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={classes.modalTitle}>Editar Vehiculo</div>
        )
    });

    const editScreen = ((action) => {
        return (
            <div style={modalStyle} className={classes.paper}>
                {setTitle(action)}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <BrandDropdown
                            required
                            updateBrandId={updateBrandIdFromChild}
                            className={classes.dropDown}
                            selectedBrand={values.brandId}
                        />
                        <ModelDropdown
                            required
                            updateModelId={updateModelIdFromChild}
                            currentBrandId={values.brandId}
                            className={classes.dropDown}
                            selectedModel={values.modelId}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <GenerationDropdown
                            updateGenerationId={updateGenerationIdFromChild}
                            currentModelId={values.modelId}
                            className={classes.dropDown}
                            selectedGeneration={values.generationId}
                        />
                        <FuelTypeDropdown
                            updateFuelTypeId={updateFuelTypeIdFromChild}
                            className={classes.dropDown}
                            selectedFuelType={values.fuelTypeId}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <EnginesDropdown
                            updateEnginesId={updateEngineIdFromChild}
                            currentGenerationId={values.generationId}
                            currentFuelTypeId={values.fuelTypeId}
                            className={classes.dropDown}
                            selectedEngine={values.engineId}
                        />
                        <TextField
                            required
                            label="Año"
                            input={<Input name="year"
                                id="year"
                                required
                                type="number"
                                min="1900"
                                max="2025" />}
                            onChange={handleChange('year')}
                            value={values.year}
                            className={classes.TextField}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextField
                            required
                            label="Caja de cambios"
                            value={values.gearbox}
                            onChange={handleChange('gearbox')}
                            className={classes.TextField}
                        />
                        <TextField
                            required
                            label="ECU"
                            value={values.ecu}
                            onChange={handleChange('ecu')}
                            className={classes.TextField}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextField
                            required
                            label="Hardware"
                            value={values.hardware}
                            onChange={handleChange('hardware')}
                            className={classes.TextField}
                        />
                        <TextField
                            required
                            label="Software"
                            value={values.software}
                            onChange={handleChange('software')}
                            className={classes.TextField}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextField
                            required
                            label="Archivo"
                            type="file"
                            onChange={handleFileChange}
                            className={classes.TextField}
                        />
                        <StagesDropdown
                            required
                            updateStageId={updateStageIdFromChild}
                            className={classes.dropDown}
                            selectedStage={values.stageId}
                        />
                    </div>
                </div>
                {actionButton(action)}
            </div >

        )
    });


    useEffect(() => {
        Axios.get('/diavolofiles/ws/VwBVehiclesExt/browsePDR?keyword=&userId=' + values.userId)
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
        var myURL = '/diavolofiles/ws/VwBVehiclesExt/browsePDR?keyword=' + mySearch + '&userId=' + values.userId;

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

    function onEdit(event, vehicle) {
        setIsEditOpen(true);
        setValues({
            ...values,
            userId: vehicle.userId,
            vehicleId: vehicle.vehicleId,
            brandId: vehicle.brandId,
            modelId: vehicle.modelId,
            generationId: vehicle.generationId,
            fuelTypeId: vehicle.fuelTypeId,
            engineId: vehicle.engineId,
            year: vehicle.year,
            gearbox: vehicle.gearbox,
            ecu: vehicle.ecu,
            hardware: vehicle.hardware,
            software: vehicle.software,
            originalFile: '',
            fileName:'',
            stageId: vehicle.stageId
        });
        setMyFile(null);
    };

    function onAdd() {
        setIsAddOpen(true);
        setValues({
            ...values,
            vehicleId: '',
            userId: values.userId,
            brandId: '',
            modelId: '',
            engineId: '',
            fuelTypeId: '',
            generationId: '',
            year: '',
            gearbox: '',
            ecu: '',
            hardware: '',
            software: '',
            originalFile: '',
            fileName:'',
            stageId: ''
        });
        setMyFile(null);
        

    };


    function onDelete(event, vehicle) {
        setIsDeleteOpen(true)
        setValues({
            ...values,
            vehicleId: vehicle.vehicleId,
            userId: vehicle.userId,
            brandId: vehicle.brandId,
            modelId: vehicle.modelId,
            generationId: vehicle.generationId,
            fuelTypeId: vehicle.fuelTypeId,
            engineId: vehicle.engineId,
            year: vehicle.year,
            gearbox: vehicle.gearbox,
            ecu: vehicle.ecu,
            hardware: vehicle.hardware,
            software: vehicle.software,
            originalFile: '',
            fileName:'',
            stageId: vehicle.stageId
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.workOrderId}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'actions') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <div   >
                                                                <HtmlTooltip
                                                                    placement="left-start"
                                                                    title={
                                                                        <React.Fragment>
                                                                            <b>Status</b> {row.wosDescription}<br />
                                                                            <b>Caja:</b> {row.gearbox} <br />
                                                                            <b>ECU: </b> {row.ecu} <br />
                                                                            <b>Hardware: </b>{row.hardware}<br />
                                                                            <b>Software: </b>{row.software}<br />
                                                                            <b>Etapa:</b>{row.stageDescription}<br />
                                                                        </React.Fragment>
                                                                    }
                                                                >
                                                                    <IconButton >
                                                                        <AssignmentIcon />
                                                                    </IconButton>
                                                                </HtmlTooltip>
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
export default React.memo(Vehicles, areEqual);