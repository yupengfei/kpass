import React, { Component, PropTypes } from 'react'
import cx from 'classnames'

import { Input } from '../input'
import { FieldLabel } from '../field-label'

import './field-text.view.styl'

export class FieldText extends Component {

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    type: PropTypes.string,

    // Redux from
    input: PropTypes.object,
    meta: PropTypes.object
  }

  getRootClassNames () {
    const {
      className,
      meta
    } = this.props

    return cx(
      'fieldText',
      meta.touched && meta.error ? 'isError' : null,
      className
    )
  }

  saveInputRef = (ref) => {
    this.inputRef = ref
  }

  focus () {
    setTimeout(() => this.inputRef.focus(), 10)
  }

  renderLabel () {
    const {
      label,
      name
    } = this.props

    if (!label) {
      return null
    }

    return (
      <FieldLabel
        htmlFor={name}
        text={label}
      />
    )
  }

  handleFocus = (e) => {
    this.props.input.onFocus(e)
  }

  handleBlur = (e) => {
    this.props.input.onBlur(e)
  }

  handleChange = (e) => {
    this.props.input.onChange(e)
  }

  renderInput () {
    const {
      input,
      name,
      placeholder,
      autoFocus,
      type
    } = this.props

    return (
      <div className='inputWrap'>
        <Input
          ref={this.saveInputRef}
          defaultValue={input.value}
          name={name}
          placeholder={placeholder}
          autoFocus={autoFocus}
          type={type}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
        />
      </div>
    )
  }

  render () {
    return (
      <div className={this.getRootClassNames()}>
        {this.renderLabel()}
        {this.renderInput()}
      </div>
    )
  }

}
