import React, { Component, PropTypes } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { Field, propTypes as formPropTypes } from 'redux-form'
import cx from 'classnames'

import { createEmptyPromise } from 'utils'
import { Button, FieldText } from 'uis'

import './member-invite.view.styl'

export class MemberInvite extends Component {

  static propTypes = {
    className: PropTypes.string,
    team: PropTypes.object,
    teamMembers: PropTypes.array,
    actions: PropTypes.object,
    ...formPropTypes
  }

  getRootClassnames () {
    return cx(
      'memberInviteView',
      this.props.className
    )
  }

  handleSubmit = (values) => {
    const {
      team,
      actions
    } = this.props

    const formPromise = createEmptyPromise()

    actions.createTeamMember({
      teamId: team.id,
      body: {
        userID: values.username
      },
      formPromise
    })

    return formPromise
  }

  componentDidMount () {
    this.refs.usernameInput
      .getRenderedComponent().focus()
  }

  renderMemberInviteForm () {
    const { handleSubmit, pristine, valid, submitting } = this.props

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <Field
          withRef
          ref={'usernameInput'}
          name={'username'}
          component={FieldText}
          placeholder={I18n.t('account.username')}
        />
        <Button
          block
          type={'primary'}
          htmlType={'submit'}
          disabled={pristine || !valid}
          loading={submitting}
        >
          <Translate value={'teamMembers.inviteSubmit'} />
        </Button>
      </form>
    )
  }

  render () {
    return (
      <div
        className={this.getRootClassnames()}
      >
        {this.renderMemberInviteForm()}
      </div>
    )
  }

}
