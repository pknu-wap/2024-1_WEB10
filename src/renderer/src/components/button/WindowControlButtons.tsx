import { ComponentProps, ReactNode, useEffect } from 'react'

import { twMerge } from 'tailwind-merge'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
  fetchWindowIsMaximized,
  selectWindowIsMaximized,
  selectWindowType
} from '../../store/state/window'

import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore
} from 'react-icons/vsc'
import { themeClass } from '../../utils'

const WindowControlButton = ({
  className,
  children,
  ...props
}: ComponentProps<'button'>): ReactNode => {
  return (
    <button
      className={twMerge('w-[40px] h-[32px] flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export const WindowControlButtons = (): ReactNode => {
  const windowType = useAppSelector(selectWindowType)
  const maximized = useAppSelector(selectWindowIsMaximized)
  const dispatch = useAppDispatch()

  useEffect(() => {
    function handleResize(): void {
      dispatch(fetchWindowIsMaximized())
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const onMinimize = async (): Promise<void> => {
    window.ipc('request-minimize-window')
  }
  const onMaximizeOrRestore = async (): Promise<void> => {
    if (maximized) await window.ipc('request-restore-window')
    else await window.ipc('request-maximize-window')
  }
  const onClose = async (): Promise<void> => {
    if (windowType === 'workspace') {
      // todo : popup
    }
    window.ipc('request-close-window')
  }

  return window.electron.process.platform !== 'darwin' ? (
    <div className={'fixed top-0 right-0 justify-self-center flex flex-row items-center justify-center bg-inherit'}>
      <WindowControlButton onClick={onMinimize} className={themeClass.dust.control.minimize}>
        <VscChromeMinimize />
      </WindowControlButton>
      {
        windowType !== 'login' ? (
          <WindowControlButton
            onClick={onMaximizeOrRestore}
            className={themeClass.dust.control.maximize}
          >
            {maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
          </WindowControlButton>
        ) : (
          <></>
        )
      }
      <WindowControlButton onClick={onClose} className={themeClass.dust.control.close}>
        <VscChromeClose />
      </WindowControlButton>
    </div>
  ) : (
    <></>
  )
}
