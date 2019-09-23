import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

    state = {
        orders: [],
        loading: true,
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const orders = Object.keys(res.data).map(orKey => {
                    return {
                        ...res.data[orKey],
                        id: orKey
                    };
                })
                this.setState({
                    orders: orders,
                    loading: false
                })
                console.log(this.state.orders)
            })
            .catch(err => console.log(err));
    }

    render() {
        let orders = <Spinner />
        if (!this.state.loading) {
            orders = (
                <div>
                    {this.state.orders.map(order => {
                        return <Order key={order.id} ingredients={order.ingredients} price={order.price} />
                    })}
                </div>
            )
        }
        return (
            <div>
                {orders}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios)