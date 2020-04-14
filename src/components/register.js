import React, { Component } from 'react'
import axios from 'axios'
import {
    Button,
    Form,
    Container,
    Grid,
    Segment,
    Header,
    Modal,
    Message
} from 'semantic-ui-react'
import { connect } from 'react-redux'
import blocks from '../style/login.css'
import { submitCredentials } from '../actions'
import { Redirect } from 'react-router-dom'

class RegistrationCredentials extends Component {
    state = {
        role: '',
        identifier: '',
        secret_code: '',
        success: '',
        error: '',
        session_id: '',
        submitCredentials: {},
    }
    handleSubmit = () => {
        const { identifier, secret_code } = this.state
        const { role } = this.props
        const data = { role, identifier, secret_code }
        this.setState({ registerLoading: true })
        
        
        this.props.SubmitCredentials(
            data,
            this.successChangeCallback,
            this.errChangeCallback
        )
    }
    successChangeCallback = res => {
        const { data } = res
        this.setState({
            session_id: data.sessionId,
            success: true,
            error: false,
            registerLoading: false
        })
        
    }
    errChangeCallback = err => {
        this.setState({
            success: false,
            error: true,
        })
    }

    render() {
        const { identifier, secret_code, registerLoading, session_id, success, error } = this.state
        const { role } = this.props
        return (
            <Form styleName='blocks.form'>Registration
                <Form.Field>
                    {role === 'student' &&
                        <label>Enrollment Number</label>
                    }
                    {role === 'faculty_member' &&
                        <label>Faculty ID</label>
                    }
                    {role === 'other_staff' &&
                        <label>Staff ID</label>}
                    <input
                        value={identifier}
                        onChange={e =>
                            this.setState({ identifier: e.target.value })
                        }
                        type='number'
                        min="0" oninput="this.value = Math.abs(this.value)"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Registration Key</label>
                    <input
                        value={secret_code}
                        onChange={e =>
                            this.setState({ secret_code: e.target.value })
                        }
                        type='text'
                    />
                </Form.Field>
                <Button
                    basic
                    color='blue'
                    fluid
                    // loading={registerLoading}
                    onClick={this.handleSubmit}
                    disabled={!identifier || !secret_code || registerLoading}
                    type='submit'
                >Proceed</Button>
                {success && (
                    <Redirect to={{pathname: "/registration/verify_details", state: {session_id: session_id}}} />
                )}
                {error && (
                    <Message
                    negative
                    icon='frown outline'
                    header='Error'
                    content={`Wrong Credentials`}
                    />
                )}
            </Form>
        )
    }
}

const mapStateToProps = state => {
    return {
        submitCredentials: state.submitCredentials
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SubmitCredentials: (data, successCallback, errCallback) => {
            dispatch(submitCredentials(data, successCallback, errCallback))
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistrationCredentials)