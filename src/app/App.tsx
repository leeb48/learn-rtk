import React, { useState } from 'react'
import './App.css'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './rootReducer'

import { RepoSearchForm } from 'features/repoSearch/RepoSearchForm'
import { IssuesListPage } from 'features/issuesList/IssuesListPage'
import { IssueDetailsPage } from 'features/issueDetails/IssueDetailsPage'

import {
  displayRepo,
  setCurrentDisplayType,
  setCurrentPage
} from 'features/issuesDisplay/issuesDisplaySlice'

// type CurrentDisplay =
//   | {
//       type: 'issues'
//     }
//   | {
//       type: 'comments'
//       issueId: number
//     }

const App: React.FC = () => {
  // const [org, setOrg] = useState(ORG)
  // const [repo, setRepo] = useState(REPO)
  // const [page, setPage] = useState(1)
  // const [currentDisplay, setCurrentDisplay] = useState<CurrentDisplay>({
  //   type: 'issues'
  // })

  // with this you can dispatch actions directly
  const dispatch = useDispatch()
  // replacement for mapStateToProps
  const { org, repo, displayType, page, issueId } = useSelector(
    (state: RootState) => state.issuesDisplay
  )

  const setOrgAndRepo = (org: string, repo: string) => {
    // setOrg(org)
    // setRepo(repo)
    dispatch(displayRepo({ org, repo }))
  }

  const setJumpToPage = (page: number) => {
    // setPage(page)
    dispatch(setCurrentPage(page))
  }

  const showIssuesList = () => {
    // setCurrentDisplay({ type: 'issues' })
    dispatch(setCurrentDisplayType({ displayType: 'issues' }))
  }

  const showIssueComments = (issueId: number) => {
    // setCurrentDisplay({ type: 'comments', issueId })
    dispatch(setCurrentDisplayType({ displayType: 'comments', issueId }))
  }

  let content

  if (displayType === 'issues') {
    content = (
      <React.Fragment>
        <RepoSearchForm
          org={org}
          repo={repo}
          setOrgAndRepo={setOrgAndRepo}
          setJumpToPage={setJumpToPage}
        />
        <IssuesListPage
          org={org}
          repo={repo}
          page={page}
          setJumpToPage={setJumpToPage}
          showIssueComments={showIssueComments}
        />
      </React.Fragment>
    )
  } else {
    // const { issueId } = currentDisplay
    const key = `${org}/${repo}/${issueId}`
    content = (
      <IssueDetailsPage
        key={key}
        org={org}
        repo={repo}
        issueId={issueId!}
        showIssuesList={showIssuesList}
      />
    )
  }

  return <div className="App">{content}</div>
}

export default App
