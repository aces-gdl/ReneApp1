import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const ModelDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        modelId: '',
        modelDescription: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'modelId') {
            const selectedModel = myData.find(model => model.modelId === event.target.value);
            setValues({ ...values, modelDescription: selectedModel.description, modelId: selectedModel.modelId });
            props.updateModelId(selectedModel.modelId);
        }
    };

    useEffect(() => {
        if (props.currentBrandId !== "") {
            Axios.get('/diavolofiles/ws/Models/byBrandPDR?keyId=' + props.currentBrandId)
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
    }, [props.currentBrandId])

    useEffect (() =>{
        setValues({modelId: props.selectedModel})
      }, [props.selectedModel])

    return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Modelo</InputLabel>
                <Select
                    style={props.style}
                    className={props.className}
                    id="modelsDropDown"
                    value={values.modelId}
                    onChange={handleChange('modelId')}
                    input={<Input name="modelId" id="modelId" />}

                >
                    <MenuItem value="" />
                    {myData.map((row) => {
                        return (
                            <MenuItem key={row.modelId} value={row.modelId}>{row.description}</MenuItem>
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
export default React.memo(ModelDropdown, areEqual);
