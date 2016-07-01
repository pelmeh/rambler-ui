/**
 * Плейграунд
 */
import { PropTypes, Component } from 'react'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'
import { debounce } from 'core-decorators'
import classnames from 'classnames'
import pure from 'recompose/pure'
import { result, compact } from 'lodash'
import { css } from './index.css'
import rui from 'build/rambler-ui'

const LIB_NAME = 'rambler-ui'

@pure
export default class Playground extends Component {

  static propTypes = {
    /**
     * Код для отображения
     */
    code: PropTypes.string.isRequired,
    /**
     * Можно редактировать код
     */
    canEdit: PropTypes.bool,
    /**
     * Показывать превью
     */
    showPreview: PropTypes.bool,
    /**
     * Открытая вкладка
     */
    mode: PropTypes.string
  }

  static defaultProps = {
    canEdit: true,
    showPreview: true,
    mode: 'read'
  }

  state = {
    mode: 'read' // read or write
  }

  componentWillMount() {
    const { code, mode, canEdit } = this.props
    if (!canEdit)
      mode = 'read'
    this.setState({ code, mode })
    this.initialCode = code
  }

  setMode(mode) {
    this.setState({ mode })
    if (mode === 'read')
      this.setState({ code: this.initialCode })
  }

  @debounce(1000)
  onCodeChange(code) {
    this.setState({ code })
  }

  renderPreview() {
    const { code } = this.state
    const resCode = transform(code, { presets: ['es2015', 'stage-0', 'stage-1', 'stage-2', 'react'] }).code
    const resModule = new Function('module', 'exports', 'require', resCode)

    let ResComponent = null
    let error = null

    try {
      let _module = { exports: {} }
      let _require = function (moduleName) {
        if (moduleName.indexOf(LIB_NAME) === 0 && moduleName.indexOf('/') !== -1) {
          let _path = compact(moduleName.replace(LIB_NAME, '').split('/')).join('.')
          return result(rui, _path)
        }
        return rui
      }
      resModule(_module, _module.exports, _require)
      ResComponent = _module.exports.default
    } catch (e) {
      error = e.toString()
    }

    return (
      <div className={ css.Preview }>
        { ResComponent && <ResComponent /> }
        { error && <pre className={ css.Preview__error }>{ error }</pre>}
      </div>
    )
  }

  render() {
    const { code, mode } = this.state
    const { showPreview, canEdit } = this.props
    const output = mode === 'read' ?
      <pre>{ code }</pre> :
      <Codemirror
        options={{ mode: 'javascript' }}
        onChange={ ::this.onCodeChange }
        autoSave={ true }
        value={ code }
        />

    return (
      <div className={ css.Wrapper }>
        <div className={ css.Header }>
          <div
            onClick={() => this.setMode('read')}
            className={ classnames(css.Header__tab, { css.isActive: mode === 'read' }) }>Код</div>
          {
            canEdit && <div
              onClick={() => this.setMode('write')}
              className={ classnames(css.Header__tab, { css.isActive: mode === 'write' }) }>Редактировать</div>
          }
        </div>
        <div className={ css.Body }>
          <div className={ css.Code }>
            { code }
          </div>
          { showPreview && this.renderPreview() }
        </div>
      </div>
    )
  }

}
