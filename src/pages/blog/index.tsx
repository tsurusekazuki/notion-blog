import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import {
  getBlogLink,
  getDateStr,
  getTagLink,
  postIsPublished,
} from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  let allTags: string[] = []
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)
  allTags = allTags.filter((tag, index, orig) => orig.indexOf(tag) === index)
  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
      allTags,
    },
    unstable_revalidate: 10,
  }
}

export default ({ posts, preview, allTags }) => {
  const sortPosts = posts.sort((a, b) => b.Date - a.Date)
  return (
    <>
      <Header titlePre="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>Tech Blog</h1>
        {posts.length === 0 && allTags.length > 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.length > 0 && allTags.length > 0 && (
          <>
            <div className={blogStyles.tagsTitle}>Tags:</div>
            <div className={blogStyles.tags}>
              {allTags &&
                allTags.length > 0 &&
                allTags.map(tag => (
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)}>
                    <span className={blogStyles.tag}>{tag}</span>
                  </Link>
                ))}
            </div>
          </>
        )}
        {sortPosts.map(post => {
          const slug: string = post.Slug
          const published: string = post.Published
          const blogTitle: string = post.Page
          const author: string = post.Authors[0]
          const tags: string[] = post.Tags
          const [year, month, day]: string[] = getDateStr(post.Date).split('/')

          return (
            <div className={blogStyles.postPreview} key={slug}>
              <h3>
                <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                  <div className={blogStyles.titleContainer}>
                    {!published && (
                      <span className={blogStyles.draftBadge}>Draft</span>
                    )}
                    <a>{blogTitle}</a>
                  </div>
                </Link>
              </h3>
              {tags &&
                tags.length > 0 &&
                tags.map(tag => (
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)}>
                    <span className={blogStyles.tag}>{tag}</span>
                  </Link>
                ))}
              {author.length > 0 && <div className="authors">By: {author}</div>}
              {post.Date && (
                <div className="posted">
                  Posted: {year}年{month}月{day}日
                </div>
              )}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
      </div>
    </>
  )
}
