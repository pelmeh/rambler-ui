import React, { Component, PropTypes, cloneElement } from 'react'
import classnames from 'classnames'
import pure from 'recompose/pure'
import QuestionIcon from '../icons/forms/QuestionIcon'
import { FixedOverlay } from '../Overlay'
import { POINTS_X } from '../constants/overlay'
import { injectSheet } from '../theme'
import { fontStyleMixin, isolateMixin } from '../style/mixins'

@pure
@injectSheet((theme) => ({
  hint: {
    ...isolateMixin,
    ...fontStyleMixin(theme.font),
    position: 'relative',
    top: -14,
    boxSizing: 'border-box',
    boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.1), 0 -2px 6px 0 rgba(0, 0, 0, 0.1)',
    paddingTop: 15,
    paddingBottom: 20,
    width: 275,
    backgroundColor: '#fff',
    fontSize: 13,
    opacity: 0.01,
    transitionDuration: `${theme.hint.animationDuration}ms`,
    transitionProperty: 'opacity'
  },
  isVisible: {
    opacity: 1
  },
  icon: {
    position: 'absolute',
    top: 14,
    fill: theme.button.types.primary.defaultBg
  },
  left: {
    left: -15,
    paddingLeft: 47,
    paddingRight: 24,
    '& $icon': {
      left: 15
    }
  },
  right: {
    left: 15,
    paddingLeft: 24,
    paddingRight: 47,
    '& $icon': {
      right: 15
    }
  }
}))
class HintContent extends Component {

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    isVisible: PropTypes.bool.isRequired,
    pointX: PropTypes.oneOf(POINTS_X),
    onMouseLeave: PropTypes.func,
    onBecomeVisible: PropTypes.func,
    onBecomeInvisible: PropTypes.func
  }

  status = null
  state = {}

  get css() {
    return this.props.sheet.classes
  }

  componentWillReceiveProps({ isVisible }) {
    if (isVisible !== this.props.isVisible) {
      this.clearDelayTimeout()

      if (isVisible)
        this.delayTimeout = setTimeout(this.show, 60)
      else
        this.hide()
    }
  }

  componentWillUnmount() {
    this.clearAnimationTimeout()
    this.clearDelayTimeout()
  }

  clearDelayTimeout() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
      this.delayTimeout = null
    }
  }

  clearAnimationTimeout() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout)
      this.animationTimeout = null
    }
  }

  hide = () => {
    if (this.status === 'hiding') return
    this.status = 'hiding'
    this.clearAnimationTimeout()

    this.setState({
      isVisible: false
    })

    this.animationTimeout = setTimeout(() => {
      this.status = null
      this.props.onBecomeInvisible()
    }, this.props.theme.hint.animationDuration)
  }

  show = () => {
    if (this.status === 'showing') return
    this.status = 'showing'
    this.clearAnimationTimeout()

    this.setState({
      isVisible: true
    })

    this.animationTimeout = setTimeout(() => {
      this.status = null
      this.props.onBecomeVisible()
    }, this.props.theme.hint.animationDuration)
  }

  render() {
    const { isVisible } = this.state

    const {
      className,
      style,
      icon,
      children,
      pointX,
      onMouseLeave
    } = this.props

    const css = this.css
    const anchor = cloneElement(icon, { className: css.icon })

    return (
      <div
        className={classnames(css.hint, css[pointX], isVisible && css.isVisible, className)}
        style={style}
        onMouseLeave={onMouseLeave}>
        {anchor}
        {children}
      </div>
    )
  }
}

@pure
@injectSheet(theme => ({
  icon: {
    display: 'inline-block',
    fill: theme.button.types.primary.defaultBg
  }
}))
export default class Hint extends Component {

  static propTypes = {
    /**
     * Класс якоря
     */
    className: PropTypes.string,
    /**
     * Стили якоря
     */
    style: PropTypes.object,
    /**
     * Иконка, по-умолчанию `<QuestionIcon />`
     */
    icon: PropTypes.node.isRequired,
    /**
     * Класс контента подсказки
     */
    contentClassName: PropTypes.string,
    /**
     * Стили контента посказки
     */
    contentStyle: PropTypes.object,
    /**
     * Контент для подсказки
     */
    children: PropTypes.node.isRequired,
    /**
     * Флаг показа подсказки. Если ничего не указано, подсказка будет показываться при hover
     */
    isOpened: PropTypes.bool,
    /**
     * Позиция тултипа по оси X: left - слева от якоря, right - справа
     */
    positionX: PropTypes.oneOf(['left', 'right']),
    /**
     * Скрывать при скролле страницы
     */
    closeOnScroll: PropTypes.bool
  };

  static defaultProps = {
    positionX: 'right',
    closeOnScroll: true,
    icon: (
      <QuestionIcon size={16} />
    )
  };

  constructor(props) {
    super(props)

    this.state = {
      isOpened: props.isOpened || false
    }
  }

  get css() {
    return this.props.sheet.classes
  }

  componentWillReceiveProps({ isOpened }) {
    if (isOpened !== undefined && isOpened !== this.props.isOpened)
      if (isOpened)
        this.show()
      else
        this.hide()
  }

  show = () => {
    if (!this.state.isOpened)
      this.setState({
        isOpened: true
      })
  }

  hide = () => {
    if (this.state.isOpened)
      this.setState({
        isOpened: false
      })
  }

  render() {
    const {
      className,
      style,
      contentClassName,
      contentStyle,
      icon,
      children,
      positionX,
      closeOnScroll
    } = this.props

    const css = this.css
    const pointX = positionX === 'left' ? 'right' : 'left'

    const anchor = cloneElement(icon, {
      style,
      className: classnames(css.icon, className),
      onMouseEnter: this.show
    })

    return (
      <FixedOverlay
        isOpened={this.state.isOpened}
        anchor={anchor}
        content={
          <HintContent
            className={contentClassName}
            style={contentStyle}
            icon={icon}
            onMouseLeave={this.hide}>
            {children}
          </HintContent>
        }
        autoPositionX={true}
        anchorPointX={pointX}
        contentPointX={pointX}
        anchorPointY="top"
        contentPointY="top"
        cachePositionOptions={false}
        closeOnScroll={closeOnScroll} />
    )
  }

}