import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'

import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import { insertMentionLinks } from 'utils/stringUtils'
import { getComments, Comment } from 'api/githubAPI'
import { IssueLabels } from 'components/IssueLabels'

import { RootState } from 'app/rootReducer'
import { fetchIssue } from 'features/issuesList/issuesSlice'

import { IssueMeta } from './IssueMeta'
import { IssueComments } from './IssueComments'
import { fetchComments } from './commentsSlice'

import styles from './IssueDetailsPage.module.css'
import './IssueDetailsPage.css'

interface IDProps {
  org: string
  repo: string
  issueId: number
  showIssuesList: () => void
}

export const IssueDetailsPage = ({
  org,
  repo,
  issueId,
  showIssuesList
}: IDProps) => {
  const dispatch = useDispatch()

  // most of the time the issues will be cached inside the Redux store
  const { issue, commentsLoading, commentsError, comments } = useSelector(
    (state: RootState) => {
      return {
        issue: state.issues.issuesByNumber[issueId],
        commentsLoading: state.comments.loading,
        commentsError: state.comments.error,
        comments: state.comments.commentsByIssue[issueId]
      }
    },
    shallowEqual
  )

  // if the issue was not cached, then the useEffect will fetch the issue
  useEffect(() => {
    if (!issue) {
      dispatch(fetchIssue(org, repo, issueId))
    }

    window.scrollTo({ top: 0 })
  }, [org, repo, issueId, issue, dispatch])

  useEffect(() => {
    // retrieve comments only when comments are not cached
    if (issue && !comments) {
      dispatch(fetchComments(issue))
    }
  }, [issue, comments, dispatch])

  let content

  const backToIssueListButton = (
    <button className="pure-button" onClick={showIssuesList}>
      Back to Issues List
    </button>
  )

  if (commentsError) {
    return (
      <div className="issue-detail--error">
        {backToIssueListButton}
        <h1>There was a problem loading issue #{issueId}</h1>
        <p>{commentsError.toString()}</p>
      </div>
    )
  }

  if (issue === null) {
    content = (
      <div className="issue-detail--loading">
        {backToIssueListButton}
        <p>Loading issue #{issueId}...</p>
      </div>
    )
  } else {
    let renderedComments

    if (comments) {
      renderedComments = <IssueComments issue={issue} comments={comments} />
    } else if (commentsLoading) {
      renderedComments = (
        <div className="issue-detail--loading">
          <p>Loading comments...</p>
        </div>
      )
    } else if (commentsError) {
      renderedComments = (
        <div className="issue-detail--error">
          <h1>Could not load comments for issue #{issueId}</h1>
          <p>{commentsError.toString()}</p>
        </div>
      )
    }

    content = (
      <div className={classnames('issueDetailsPage', styles.issueDetailsPage)}>
        <h1 className="issue-detail__title">{issue.title}</h1>
        {backToIssueListButton}
        <IssueMeta issue={issue} />
        <IssueLabels labels={issue.labels} className={styles.issueLabels} />
        <hr className={styles.divider} />
        <div className={styles.summary}>
          <ReactMarkdown
            className={'testing'}
            source={insertMentionLinks(issue.body)}
          />
        </div>
        <hr className={styles.divider} />
        <ul>{renderedComments}</ul>
      </div>
    )
  }

  return <div>{content}</div>
}
