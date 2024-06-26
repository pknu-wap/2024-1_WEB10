import { useEffect } from 'react'

import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc'

import { useWindowControlFlow } from '@view/hooks/specific'

import { Button, FatalButton } from '@view/ui'

export const WindowControlButtons = (): JSX.Element => {
  // todo : safe close
  const { onClose, onMinimize, onMaximizeOrRestore, isWindowMaximized, fetchWindowMaximized, setWindowIsMaximized } = useWindowControlFlow()

  useEffect(() => {
    async function fetchIsMaximized(): Promise<void> {
      setWindowIsMaximized(await fetchWindowMaximized())
    }
    fetchIsMaximized()

    window.addEventListener('resize', fetchIsMaximized)
    return () => {
      window.removeEventListener('resize', fetchIsMaximized)
    }
  }, [])

  return window.electron.process.platform !== 'darwin' ? (
    <>
      <Button className={'w-[40px] h-[32px] flex items-center justify-center'} onClick={onMinimize}>
        <VscChromeMinimize />
      </Button>
      <Button className={'w-[40px] h-[32px] flex items-center justify-center'} onClick={onMaximizeOrRestore}>
        {isWindowMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
      </Button>
      <FatalButton className={'w-[40px] h-[32px] flex items-center justify-center'} onClick={onClose}>
        <VscChromeClose />
      </FatalButton>
    </>
  ) : (
    <></>
  )
}
