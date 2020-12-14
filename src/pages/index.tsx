import Header from '../components/header'
import ExtLink from '../components/ext-link'
import sharedStyles from '../styles/shared.module.css'

export default () => (
  <>
    <Header titlePre="Home" />
    <div className={sharedStyles.layout}>
      <div className={sharedStyles.behindImage}>
        <img src="/myphoto.png" />
      </div>
      <h1>Nuoun's Blog</h1>
      <h2>
        Blazing Fast Notion Blog with Next.js'{' '}
        <ExtLink
          href="https://github.com/vercel/next.js/issues/9524"
          className="dotted"
          style={{ color: 'inherit' }}
        >
          SSG
        </ExtLink>
      </h2>
    </div>
  </>
)
