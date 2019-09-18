import React, {Component} from 'react';

import Aux from './../../../hoc/Aux';
import Button from './../../UI/Button/Button';

class OrderSummary extends Component {

    componentDidUpdate() {
        console.log('[Order summary] didUpdate')
    }

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
            return (
                <li key={igKey}><span style={{ textTransform: 'capitalize' }}>{igKey}:</span> {this.props.ingredients[igKey]}</li>
            )
        });
        return (
            <Aux>
                <h3>Your order</h3>
                <p>A delicious burger with the following ingredients:</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total piroce: {this.props.totalPrice.toFixed(2)}</strong></p>
                <p>Continue to Checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        )
    }
};

export default OrderSummary;