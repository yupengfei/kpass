import { requireAuth, isPublicTeam } from 'utils'
import { WorkspaceLayout } from './layout'
import { Personal } from './personal'
import { Team } from './team'
import { Entries } from './views'

export const WORKSPACE_BASE_PATH = '/workspace'
export const PERSONAL_PATH = 'personal'
export const TEAM_PATH = 'team'
export const ENTRIES_PATH = 'entries'
export const MEMBERS_PATH = 'members'

export const getWorkspaceBashPath = (team) => {
  if (isPublicTeam(team)) {
    return `${WORKSPACE_BASE_PATH}/${TEAM_PATH}/${team.id}`
  } else {
    return `${WORKSPACE_BASE_PATH}/${PERSONAL_PATH}`
  }
}

export const redirectToPersonal = (nextState, replace) => {
  return replace(`${WORKSPACE_BASE_PATH}/${PERSONAL_PATH}`)
}

export const redirectToPersonalEntries = (nextState, replace) => {
  return replace(`${WORKSPACE_BASE_PATH}/${PERSONAL_PATH}/${ENTRIES_PATH}`)
}

export const redirectToTeamEntries = (nextState, replace) => {
  const pathname = nextState.location.pathname
  return replace(`${pathname}/${ENTRIES_PATH}`)
}

export default (store) => ({
  path : WORKSPACE_BASE_PATH,
  indexRoute : { onEnter: redirectToPersonal },
  component : requireAuth(WorkspaceLayout),
  childRoutes : [
    {
      path : PERSONAL_PATH,
      indexRoute : { onEnter: redirectToPersonalEntries },
      component : Personal,
      childRoutes : [
        {
          path : ENTRIES_PATH,
          component : Entries
        }
      ]
    },

    {
      path : `${TEAM_PATH}/:teamId`,
      component : Team,
      indexRoute : { onEnter: redirectToTeamEntries },
      childRoutes : [
        {
          path : ENTRIES_PATH,
          component : Entries
        },

        {
          path : MEMBERS_PATH,
          component : Entries
        }
      ]
    }
  ]
})
