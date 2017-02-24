import { connect } from 'react-redux'

import { currentTeamSelector } from 'modules'
import { currentBasePathSelector } from '../../modules'
import { WorkspaceSidebar as WorkspaceSidebarView } from './workspace-sidebar.view'

const mapStateToProps = (state) => ({
  team: currentTeamSelector(state),
  basePath: currentBasePathSelector(state)
})

const mapDispatchToProps = (dispatch) => ({})

const makeContainer = (component) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)
}

export const WorkspaceSidebar = makeContainer(WorkspaceSidebarView)