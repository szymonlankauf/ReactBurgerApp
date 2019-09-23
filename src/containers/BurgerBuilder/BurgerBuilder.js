import React, { Component } from 'react';

import Aux from './../../hoc/Aux';
import Burger from './../../components/Burger/Burger';
import BuildControls from './../../components/Burger/BuildControls/BuildControls';
import Modal from './../../components/UI/Modal/Modal';
import OrderSummary from './../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        axios.get('https://burger-server-86cef.firebaseio.com/ingredients.json')
            .then(res => {
                const data = res.data;
                
                const sum = Object.keys(data).map((igKey) => {
                    return data[igKey]*INGREDIENT_PRICES[igKey]
                }).reduce((s, el) => {
                    return s+el;
                }, 0)
                let price = this.state.totalPrice;
                price += sum;
                const isPurchasable = sum > 0;
                this.setState({
                    ingredients: data,
                    totalPrice: price,
                    purchasable: isPurchasable
                });
            })
            .catch(error => {});
    }

    updatePrice = (ingredient, method) => {
        let thePrice = this.state.totalPrice;
        
        method === "add" ? thePrice += INGREDIENT_PRICES[ingredient] : thePrice -= INGREDIENT_PRICES[ingredient];

        // this.setState({
        //     totalPrice: thePrice
        // })
        return thePrice;
    }

    updatePurchaseState = (ingredients) => {
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey]
            })
            .reduce(((sum, el) => {
                return sum + el;
            }), 0)
        
        return sum > 0;
        // this.setState({
        //     purchasable: (sum > 0)
        // })
    }

    addIngredientHandler = (type) => {
        let amount = this.state.ingredients[type];
        amount++;

        let prevState = {...this.state.ingredients};

        prevState[type] = amount;

        const newPrice = this.updatePrice(type, "add");
        const purchasable = this.updatePurchaseState(prevState);

        this.setState({
            ingredients: prevState,
            totalPrice: newPrice,
            purchasable: purchasable
        })
    }

    removeIngredientHandler = (type) => {
        let amount = this.state.ingredients[type];
        if (amount <= 0) {
            return;
        }
        amount--;
        let prevState = {...this.state.ingredients};

        prevState[type] = amount;
        
        const newPrice = this.updatePrice(type, "remove");
        const purchasable = this.updatePurchaseState(prevState);
        
        this.setState({
            ingredients: prevState,
            totalPrice: newPrice,
            purchasable: purchasable
        })        
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    closeModalHandler = () => {
        this.setState({
            purchasing: false
        })
    }

    purchaseContinueHandler = () => {
        const queryParams = [];
        for (var i in this.state.ingredients) {
            queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.state.ingredients[i])}`)
        }
        queryParams.push(`price=${encodeURIComponent(this.state.totalPrice.toFixed(2))}`);
        this.props.history.push({
            pathname: '/checkout',
            search: `?${queryParams.join('&')}`
        })
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(var key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;

        if(this.state.loading) {
            console.log(this.state.loading)
            orderSummary = <Spinner />
        }

        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        add={this.addIngredientHandler}
                        remove={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordering={this.purchaseHandler}
                    />
                </Aux>
            )
            orderSummary = <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCanceled={this.closeModalHandler}
                purchaseContinued={this.purchaseContinueHandler}
                totalPrice={this.state.totalPrice}
            />
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} closed={this.closeModalHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios)