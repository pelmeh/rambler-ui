import { Component } from 'react'
import SvgIcon from '../SvgIcon'
import pure from 'recompose/pure'

@pure
export default class RamblerAutoIcon extends Component {

  static displayName = 'RamblerAutoIcon'

  render() {
    return (
      <SvgIcon { ...this.props } >
        <g transform="matrix(1 0 0-1 0 20)">
          <path d="m9.74.74c-1.6.02-3.18.45-4.6 1.26-4.5 2.59-6 8.33-3.45 12.82 2.6 4.49 8.35 6 12.84 3.44 4.5-2.59 6-8.33 3.45-12.82-1.66-2.87-4.68-4.62-7.94-4.69h-.3-.01m.01 1.5h.28c2.73.06 5.27 1.53 6.66 3.95 2.18 3.77.88 8.59-2.9 10.77-3.78 2.18-8.61.88-10.79-2.89-2.18-3.77-.88-8.59 2.89-10.76 1.19-.68 2.52-1.04 3.87-1.06h-.01"/>
          <path d="m9.1 1.49v6.27.75h1.5v-.75-6.27-.75h-1.5v.75"/>
          <path d="m17.37 10.75h0 .63v-1.5h-.63-5.25-.63v1.5h.63"/>
          <path d="m1.9 10.75h5.2.65v-1.5h-.65-5.2-.65v1.5h.65"/>
          <path d="m9.81 6.96c-.54.01-1.07.15-1.55.43-1.52.87-2.04 2.81-1.16 4.33.88 1.52 2.82 2.03 4.33 1.16 1.52-.87 2.04-2.81 1.16-4.33-.56-.97-1.58-1.56-2.68-1.58h-.1-.01m.01 1.5h.08c.56.01 1.1.32 1.4.84.46.8.19 1.82-.61 2.28-.8.46-1.82.19-2.29-.61-.46-.8-.19-1.82.61-2.28.25-.15.53-.22.82-.23h-.01"/>
        </g>
      </SvgIcon>
    )
  }

}
