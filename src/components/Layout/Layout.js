import React, {Component} from 'react';

import Aux from './../../hoc/Aux';
import Toolbar from './../Navigation/Toolbar/Toolbar';
import classes from './Layout.module.css';
import SideDrawer from './../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState((prevState) => {
            return {
                showSideDrawer: !prevState.showSideDrawer
            }
        })
    }

    sideDrawerOpenHandler = () => {
        this.setState({
            showSideDrawer: true
        })
    }

    render () {
        return (
            <Aux>
                <Toolbar menuButtonClicked={this.sideDrawerOpenHandler} />
                <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
};

export default Layout;