import React, { Component } from 'react';
import { Route } from 'react-router-dom';
 
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData';

class Checkout extends Component {

    constructor(props) {
        super(props);
        
        this.query = new URLSearchParams(this.props.location.search);
        this.ingredients = {};
        this.price = 0;
        for (var param of this.query.entries()) {
            if (param[0] === 'price') {
                this.price = +param[1]
            } else {
                this.ingredients[param[0]] = +param[1];
            }
        }
        this.state = {
            ingredients: this.ingredients,
            price: this.price
        }
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {

        return <div>
            <CheckoutSummary
                checkoutCancelled={this.checkoutCancelledHandler}
                checkoutContinued={this.checkoutContinuedHandler}
                ingredients={this.state.ingredients} />
            <Route
                path={this.props.match.path + '/contact-data'}
                render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.price} {...props} />)} />
        </div>
    }
}

export default Checkout;