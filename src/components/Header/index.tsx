import React, { useMemo, useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Search from '../Search'
import LogoIcon from '../../assets/ckb_logo.png'
import MobileLogoIcon from '../../assets/mobile_ckb_logo.png'
import SearchLogo from '../../assets/search_white.png'
import WhiteDropdownIcon from '../../assets/white_dropdown.png'
import BlueDropUpIcon from '../../assets/blue_drop_up.png'
import GreenDropUpIcon from '../../assets/green_drop_up.png'
import i18n, { currentLanguage } from '../../utils/i18n'
import {
  HeaderDiv,
  HeaderMobileDiv,
  HeaderMobilePanel,
  HeaderSearchPanel,
  HeaderSearchMobilePanel,
  HeaderBlockchainPanel,
  HeaderEmptyPanel,
  HeaderLanguagePanel,
  HeaderSearchBarPanel,
} from './styled'
import { isMobile, isScreen750to1440 } from '../../utils/screen'
import { useAppState, useDispatch } from '../../contexts/providers/index'
import { ComponentActions } from '../../contexts/providers/reducer'
import LanDropdown from '../Dropdown/Language'
import ChainDropdown from '../Dropdown/ChainType'
import { isMainnet } from '../../utils/chain'
import CONFIG from '../../config'

const handleVersion = (nodeVersion: string) => {
  if (nodeVersion && nodeVersion.indexOf('(') !== -1) {
    return `v${nodeVersion.slice(0, nodeVersion.indexOf('('))}`
  }
  return nodeVersion
}

const languageText = (lan: 'en' | 'zh' | null) => {
  return lan === 'en' ? i18n.t('navbar.language_en') : i18n.t('navbar.language_zh')
}

const getDropdownIcon = (showDropdown: boolean) => {
  if (!showDropdown) return WhiteDropdownIcon
  return isMainnet() ? GreenDropUpIcon : BlueDropUpIcon
}

enum LinkType {
  Inner,
  Outer,
}

const Menus = () => {
  const [t] = useTranslation()
  const MenuDataList = useMemo(() => {
    return [
      {
        type: LinkType.Inner,
        name: t('navbar.charts'),
        url: '/charts',
      },
      {
        type: LinkType.Inner,
        name: t('navbar.nervos_dao'),
        url: '/nervosdao',
      },
    ]
  }, [t])

  return (
    <div className="header__menus">
      {MenuDataList.map(menu => {
        return menu.type === LinkType.Inner ? (
          <Link className="header__menus__item" to={menu.url} key={menu.name}>
            {menu.name}
          </Link>
        ) : (
          <a className="header__menus__item" href={menu.url} target="_blank" rel="noopener noreferrer" key={menu.name}>
            {menu.name}
          </a>
        )
      })}
    </div>
  )
}

const LogoComp = () => {
  return (
    <Link to="/" className="header__logo">
      <img className="header__logo__img" src={isMobile() ? MobileLogoIcon : LogoIcon} alt="logo" />
    </Link>
  )
}

const BlockchainComp = () => {
  const { app } = useAppState()
  const { nodeVersion, language } = app
  const [showChainDropdown, setShowChainDropdown] = useState(false)
  const [chainDropdownLeft, setChainDropdownLeft] = useState(0)
  const [chainDropdownTop, setChainDropdownTop] = useState(0)

  useLayoutEffect(() => {
    if (showChainDropdown && language) {
      const chainDropdownComp = document.getElementById('header__blockchain__panel')
      if (chainDropdownComp) {
        const chainDropdownReact = chainDropdownComp.getBoundingClientRect()
        if (chainDropdownReact) {
          setChainDropdownLeft(chainDropdownReact.left - 34)
          setChainDropdownTop(chainDropdownReact.bottom + 6)
        }
      }
    }
  }, [showChainDropdown, language])
  return (
    <HeaderBlockchainPanel id="header__blockchain__panel">
      <div
        className="header__blockchain__flag"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowChainDropdown(true)
        }}
      >
        <div className="header__blockchain__content_panel">
          <div className="header__blockchain__content">
            {isMainnet() ? i18n.t('navbar.mainnet') : CONFIG.TESTNET_NAME.toUpperCase()}
          </div>
          <img src={getDropdownIcon(showChainDropdown)} alt="dropdown icon" />
        </div>
        <div className="header__blockchain__node__version">{handleVersion(nodeVersion)}</div>
      </div>
      {showChainDropdown && (
        <ChainDropdown setShowChainDropdown={setShowChainDropdown} left={chainDropdownLeft} top={chainDropdownTop} />
      )}
    </HeaderBlockchainPanel>
  )
}

const LanguageComp = () => {
  const { app } = useAppState()
  const { language } = app
  const [showLanguage, setShowLanguage] = useState(false)
  const [languageDropdownLeft, setLanguageDropdownLeft] = useState(0)
  const [languageDropdownTop, setLanguageDropdownTop] = useState(0)

  useLayoutEffect(() => {
    if (showLanguage && language) {
      const languageDropdownComp = document.getElementById('header__language__panel')
      if (languageDropdownComp) {
        const languageDropdownReact = languageDropdownComp.getBoundingClientRect()
        if (languageDropdownReact) {
          setLanguageDropdownLeft(languageDropdownReact.left - 6)
          setLanguageDropdownTop(languageDropdownReact.bottom + 13)
        }
      }
    }
  }, [showLanguage, language])

  return (
    <HeaderLanguagePanel id="header__language__panel" showLanguage={showLanguage}>
      <div
        className="header__language__flag"
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          setShowLanguage(true)
        }}
      >
        <div className="header__language__content_panel">
          <div className="header__language__content">{languageText(currentLanguage())}</div>
          <img src={getDropdownIcon(showLanguage)} alt="dropdown icon" />
        </div>
      </div>
      {showLanguage && (
        <LanDropdown setShowLanguage={setShowLanguage} left={languageDropdownLeft} top={languageDropdownTop} />
      )}
    </HeaderLanguagePanel>
  )
}

const SearchComp = () => {
  const dispatch = useDispatch()
  const { components } = useAppState()
  const { searchBarEditable } = components

  if (isScreen750to1440() && !searchBarEditable) {
    return (
      <HeaderSearchBarPanel
        role="button"
        tabIndex={-1}
        onKeyDown={() => {}}
        onClick={() => {
          dispatch({
            type: ComponentActions.UpdateHeaderSearchEditable,
            payload: {
              searchBarEditable: true,
            },
          })
        }}
      >
        <img alt="header search bar" src={SearchLogo} />
      </HeaderSearchBarPanel>
    )
  }
  return (
    <HeaderSearchPanel>
      <div className="header__search__component">
        <Search />
      </div>
    </HeaderSearchPanel>
  )
}

export default ({ hasSearch }: { hasSearch?: boolean }) => {
  const { components } = useAppState()
  const dispatch = useDispatch()
  const { searchBarEditable } = components

  return (
    <React.Fragment>
      {isMobile() ? (
        <>
          {hasSearch && (
            <HeaderSearchMobilePanel searchBarEditable={searchBarEditable}>
              <Search />
            </HeaderSearchMobilePanel>
          )}
          <HeaderMobilePanel searchBarEditable={searchBarEditable}>
            <HeaderMobileDiv>
              <LogoComp />
              <Menus />
              {hasSearch && (
                <div className="header__search">
                  <div
                    className="header__search__component"
                    onKeyDown={() => {}}
                    onClick={() => {
                      dispatch({
                        type: ComponentActions.UpdateHeaderSearchEditable,
                        payload: {
                          searchBarEditable: true,
                        },
                      })
                    }}
                    role="button"
                    tabIndex={-1}
                  >
                    <img className="header__search__image" src={SearchLogo} alt="search" />
                  </div>
                  <div className="header__search__separate" />
                </div>
              )}
              <BlockchainComp />
            </HeaderMobileDiv>
            <HeaderSearchPanel>{hasSearch && searchBarEditable && <Search />}</HeaderSearchPanel>
          </HeaderMobilePanel>
        </>
      ) : (
        <>
          <HeaderDiv>
            <LogoComp />
            {!(isScreen750to1440() && searchBarEditable) && <Menus />}
            <HeaderEmptyPanel />
            {hasSearch && <SearchComp />}
            <BlockchainComp />
            <LanguageComp />
          </HeaderDiv>
        </>
      )}
    </React.Fragment>
  )
}
