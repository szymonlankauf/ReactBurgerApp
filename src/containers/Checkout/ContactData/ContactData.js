import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css'
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name',
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-mail',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3
                },
                valid: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            postalCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code',
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest'
            },
        },
        loading: false
    }

    checkValidity = (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        return isValid
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log(this.props);

        this.setState({
            loading: true
        })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: this.state.orderForm.name.value,
                address: {
                    street: this.state.orderForm.street.value,
                    zipCode: this.state.orderForm.postalCode.value,
                    country: this.state.orderForm.country.value,
                },
                email: this.state.orderForm.email.value,
            },
            deliveryMethod: this.state.orderForm.deliveryMethod.value
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading: false,
                })
                this.props.history.push('/')
            })
            .catch(error => {
                this.setState({
                    loading: false,
                })
                return console.log(error)
            });
    }

    handleChange = (event, inputId) => {
        const oldForm = {...this.state.orderForm};
        const updatedForm = {...oldForm[inputId]};
        updatedForm.value = event.target.value;
        updatedForm.valid = this.checkValidity(updatedForm.value, updatedForm.validation);
        oldForm[inputId] = updatedForm;

        console.log(oldForm)

        this.setState({
            orderForm: oldForm
        })
    }

    render () {

        let form = <Spinner />
        
        if(!this.state.loading) {
            form = (<form>
                {Object.keys(this.state.orderForm).map(key => {
                    return <Input
                        changed={(event) => this.handleChange(event, key)}
                        key={key}
                        elementType={this.state.orderForm[key].elementType}
                        elementConfig={this.state.orderForm[key].elementConfig}
                        value={this.state.orderForm[key].value} />
                })}
                <Button btnType="Success" clicked={this.orderHandler} >ORDER</Button>
            </form>)
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}


export default ContactData;