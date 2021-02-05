import dynamic from 'next/dynamic'
import ExtLink from './ext-link'

export default {
  // default tag
  ol: 'ol',
  ul: 'ul',
  li: 'li',
  p: 'p',
  blockquote: 'blockquote',
  a: ExtLink,

  Code: dynamic(() => import('./code')),
  Counter: dynamic(() => import('./counter')),
  Equation: dynamic(() => import('./equation')),
}
