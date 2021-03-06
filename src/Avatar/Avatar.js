import React, { Component, cloneElement, isValidElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import omit from 'lodash/omit'
import pure from 'recompose/pure'
import * as profileIcons from '../icons/profiles'
import { injectSheet } from '../theme'
import { isolateMixin, middleMixin } from '../style/mixins'

@pure
@injectSheet(() => ({
  avatar: {
    ...isolateMixin,
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'middle',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, .15)'
  },
  circle: {
    borderRadius: '50%',
    '& $profile': {
      transform: 'translate(20%, 20%)'
    }
  },
  rounded: {
    borderRadius: '7%'
  },
  profile: {
    ...middleMixin,
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: 'translate(50%, 50%)',
    boxShadow: '0 0 0 1px #fff',
    borderRadius: '50%',
    width: '40%',
    height: '40%',
    fontSize: 0,
    textAlign: 'center'
  },
  facebook: {
    backgroundColor: '#4661a3'
  },
  championat: {
    backgroundColor: '#ff790e'
  },
  google: {
    backgroundColor: '#ea4335'
  },
  instagram: {
    backgroundColor: '#c9008b'
  },
  livejournal: {
    backgroundColor: '#13374d'
  },
  mailru: {
    backgroundColor: '#ffa930'
  },
  odnoklassniki: {
    backgroundColor: '#f78408'
  },
  pgumosru: {
    backgroundColor: '#ab272b'
  },
  rambler: {
    backgroundColor: '#262626'
  },
  twitter: {
    backgroundColor: '#5d9ec9'
  },
  vkontakte: {
    backgroundColor: '#5c7da4'
  },
  icon: {
    width: '62.5% !important',
    height: '62.5% !important'
  }
}))
export default class Avatar extends Component {

  static propTypes = {
    /**
     * CSS-класс аватарки
     */
    className: PropTypes.string,
    /**
     * Inline-стили
     */
    style: PropTypes.object,
    /**
     * Цвет фона
     */
    backgroundColor: PropTypes.string,
    /**
     * URL картинки
     */
    src: PropTypes.string.isRequired,
    /**
     * Размер аватарки
     */
    size: PropTypes.number,
    /**
     * Форма аватарки
     */
    shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
    /**
     * Тип профиля для отображения иконки
     */
    profileType: PropTypes.oneOf([
      'facebook',
      'championat',
      'google',
      'instagram',
      'livejournal',
      'mailru',
      'odnoklassniki',
      'pgumosru',
      'rambler',
      'twitter',
      'vkontakte'
    ]),
    /**
     * Если указан, аватар будет ссылкой
     */
    href: PropTypes.string,
    /**
     * Элемент, который содержит контент, например `<Link />` в случае с `react-router`
     */
    container: PropTypes.element
  }

  static defaultProps = {
    size: 40,
    shape: 'circle'
  }

  get css() {
    return this.props.sheet.classes
  }

  getContainer() {
    const {
      href,
      container
    } = this.props

    if (isValidElement(container))
      return container

    if (href)
      return (
        <a href={href} />
      )

    return <div />
  }

  render() {
    const {
      className,
      style,
      backgroundColor,
      src,
      size,
      shape,
      profileType,
      ...other
    } = omit(this.props, 'sheet', 'theme', 'href', 'container')

    const styles = Object.assign({}, style, {
      backgroundColor,
      width: size,
      height: size,
      backgroundImage: `url(${src})`
    })

    const ProfileIcon = profileType &&
      profileIcons[`${profileType.replace(/^\w/, m => m.toUpperCase())}Icon`]

    const children = profileType && (
      <div className={classnames(this.css.profile, this.css[profileType])}>
        <ProfileIcon color="white" className={this.css.icon} />
      </div>
    )

    return cloneElement(
      this.getContainer(),
      {
        ...other,
        style: styles,
        className: classnames(this.css.avatar, this.css[shape], className)
      },
      children
    )
  }

}
