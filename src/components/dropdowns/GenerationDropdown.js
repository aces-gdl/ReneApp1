import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const GenerationDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        generationId: '',
        generationDescription: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'generationId') {
            const selectedGeneration = myData.find(generation => generation.generationId === event.target.value);
            setValues({ ...values, generationDescription: selectedGeneration.description, generationId: selectedGeneration.generationId });
            props.updateGenerationId(selectedGeneration.generationId);
        }
    };

    useEffect(() => {
        Axios.get('/diavolofiles/ws/Generations/byModelPDR?keyId=' + props.currentModelId)
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
    }, [props.currentModelId])

    useEffect (() =>{
        setValues({generationId: props.selectedGeneration})
      }, [props.selectedGeneration])


      return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Generación</InputLabel>
                <Select
                    style={props.style}
                    className={props.className}
                    id="generationsDropDown"
                    value={values.generationId}
                    onChange={handleChange('generationId')}
                    input={<Input name="generationId" id="generationId" />}

                >
                    <MenuItem value="" />
                    {myData.map((row) => {
                        return (
                            <MenuItem key={row.generationId} value={row.generationId}>{row.description}</MenuItem>
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
export default React.memo(GenerationDropdown, areEqual);
