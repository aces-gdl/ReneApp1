import React, { useEffect } from 'react'
import Axios from 'axios';
import { Select, MenuItem, Input, FormControl, InputLabel } from '@material-ui/core';

export const BrandDropdown = (props) => {

    // const classes = useStyles();
    const [myData, setMyData] = React.useState([]);
    const [values, setValues] = React.useState({
        brandId: ''
    }); 

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (event.target.name === 'brandId'){
            const selectedBrand = myData.find (brand => brand.brandId === event.target.value);
            setValues({ ...values, brandDescription: selectedBrand.description, brandId : selectedBrand.brandId });
            props.updateBrandId(selectedBrand.brandId);
        }
    };
    
    useEffect(() => {
        Axios.get('/diavolofiles/ws/Brands/browsePDR?keyword=')
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

    useEffect(()=> {
        console.log('Cambio Brand: ' + props.selectedBrand);
        setValues({ brandId : props.selectedBrand });
    }, [props.selectedBrand])


    return (
        <div>
            <FormControl required className={props.className}>
                <InputLabel >Marca</InputLabel>

            <Select
              
                style={props.style}
                className={props.className}
                labelId="brandsDropDownLabel"
                id="brandsDropDown"
                value={values.brandId}
                onChange={handleChange('brandId')}
                input={<Input name="brandId" id="brandId" />}

            >
                <MenuItem value="" />
                {myData.map((row) => {
                    return (
                        <MenuItem key={row.brandId} value={row.brandId}>{row.description}</MenuItem>
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
export default React.memo(BrandDropdown, areEqual);
