import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const StageDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        stageId: ''
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'stageId') {
            const selectedStage = myData.find(stage => stage.stageId === event.target.value);
            setValues({ ...values, stageDescription: selectedStage.description, stageId: selectedStage.stageId });
            props.updateStageId(selectedStage.stageId);
        }
    };

    useEffect(() => {
        Axios.get('/diavolofiles/ws/Stages/browsePDR?keyword=')
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
        setValues({stageId: props.selectedStage})
      }, [props.selectedStage])


    return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Mejora</InputLabel>
                <Select
                    labelId="stagesDropDownLabel"
                    id="stagesDropDown"
                    value={values.stageId}
                    onChange={handleChange('stageId')}
                    input={<Input name="stageId" id="stageId" />}

                >
                    <MenuItem value="" />
                    {myData.map((row) => {
                        return (
                            <MenuItem key={row.stageId} value={row.stageId}>{row.description}</MenuItem>
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
export default React.memo(StageDropdown, areEqual);
