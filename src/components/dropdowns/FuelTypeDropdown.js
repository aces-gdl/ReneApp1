import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const FuelTypeDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        fuelTypeId: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'fuelTypeId') {
            const selectedFuelType = myData.find(fuelType => fuelType.fuelTypeId === event.target.value);
            setValues({ ...values, fuelTypeDescription: selectedFuelType.description, fuelTypeId: selectedFuelType.fuelTypeId });
            props.updateFuelTypeId(selectedFuelType.fuelTypeId);
        }
    };

    useEffect(() => {
        Axios.get('/diavolofiles/ws/FuelsTypes/browsePDR?keyword=')
            .then(data => {
                const tempData = data.data.result;
                setMyData(tempData);
                console.log(tempData);
            })
            .catch(err => {
                console.log(err)
            })

        return () => {
            console.log("Descarga del componente")
        };
    }, [])

    useEffect (() =>{
        setValues({fuelTypeId: props.selectedFuelType})
      }, [props.selectedFuelType])


    return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Tipo de gasolina</InputLabel>
                <Select
                    labelId="fuelTypesDropDownLabel"
                    id="fuelTypesDropDown"
                    value={values.fuelTypeId}
                    onChange={handleChange('fuelTypeId')}
                    input={<Input name="fuelTypeId" id="fuelTypeId" />}

                >
                    <MenuItem value="" />
                    {myData.map((row) => {
                        return (
                            <MenuItem key={row.fuelTypeId} value={row.fuelTypeId}>{row.description}</MenuItem>
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
export default React.memo(FuelTypeDropdown, areEqual);
