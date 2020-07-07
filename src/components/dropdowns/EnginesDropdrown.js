import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const EnginesDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        engineId: '',
        engineDescription: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'engineId') {
            const selectedEngines = myData.find(engine => engine.engineId === event.target.value);
            setValues({ ...values, engineDescription: selectedEngines.description, engineId: selectedEngines.engineId });
            props.updateEnginesId(selectedEngines.engineId);
        }
    };

    useEffect(() => {
        if ((props.currentGenerationId !== "") & (props.currentFuelTypeId !== "")) {
            Axios.get('/diavolofiles/ws/Engines/byGenerationAndFuelTypePDR?generationId=' + props.currentGenerationId + '&fuelTypeId=' + props.currentFuelTypeId)
                .then(data => {
                    const tempData = data.data.result;
                    setMyData(tempData);
                    console.log(tempData);
                })
                .catch(err => {
                    console.log(err)
                })

        }

        return () => {
            console.log("Descarga del componente")
        };
    }, [props.currentFuelTypeId, props.currentGenerationId])

    useEffect (() =>{
        setValues({engineId: props.selectedEngine})
      }, [props.selectedEngine])

    return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Motor</InputLabel>
                <Select
                    style={props.style}
                    className={props.className}
                    id="enginesDropDown"
                    value={values.engineId}
                    onChange={handleChange('engineId')}
                    input={<Input name="engineId" id="engineId" />}
                >
                    <MenuItem value="" />
                    {myData.map((row) => {
                        return (
                            <MenuItem key={row.engineId} value={row.engineId}>{row.description}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
}
const areEqual = (prevProps, nextProps) => {
    return false
};
export default React.memo(EnginesDropdown, areEqual);
