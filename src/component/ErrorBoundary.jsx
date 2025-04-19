import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ErrorBoundary extends Component {
//   static propTypes = {second: third}

constructor(props) {
  super(props)

  this.state = {
     hasError: false
  }
}
static getDerivedStateFromError(error){
  console.error(error)
    return {
        hasError:true
    }
}

  render() {
    if(this.state.hasError){
    return <h1>Something went wrong</h1>
  }
  return  this.props.children
}
}
