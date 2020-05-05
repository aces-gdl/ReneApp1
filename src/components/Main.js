import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'





class Main extends Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div>
                    <AppBar className={classes.NavBar} position="static">
                        <Toolbar variant="dense">
                            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <Link to="/" className={classes.menuButton}  > <HomeOutlinedIcon/></Link> 
                            </IconButton>
                            <Typography variant="h6" >
                                <Link to="/Brands" className={classes.menuButton}  >Brands</Link>
                            </Typography>
                            <Typography variant="h6"  >
                                <Link to="/cat2" className={classes.menuButton}  >Catalogo 2</Link>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default withStyles({
    NavBar: {
        backgroundColor: 'rgb(103,107,230)'
    },
    menuButton: {
        color: ' white',
        textDecoration: 'none',
        marginRight: 20
    }
})(Main)