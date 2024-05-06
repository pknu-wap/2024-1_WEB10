import { useEffect } from 'react'

import { FileContent, FileNode } from '@common/workspace/files'
import { IpcSocket } from '@common/socket'

import { useAppDispatch, useProjectFileStructure } from '@view/hooks'

import { Column, Row } from '@view/components/layout/utils/Layout'

import { registerFileContent } from '@view/store/workspace/ProjectFileEditor'

export const WorkspaceProjectFileStructureSidebarView = (): JSX.Element => {
  const { rootNode, fetchRootNode } = useProjectFileStructure()

  useEffect(() => {
    fetchRootNode()
  }, [])

  const dispatcher = useAppDispatch()

  const onFileNodeSelected = async (node: FileNode): Promise<void> => {
    if (node?.type === 'DIRECTORY') return
    const response: FileContent = await IpcSocket.requester.request('workspace', 'readFile', node)
    dispatcher(registerFileContent(response))
  }

  const RenderSingleNode = ({ node }: { node: FileNode }): JSX.Element => {
    return (
      <Row className={'h-auto w-auto gap-1'}>
        <p>ㄴ</p>
        <button
          className={'flex items-center'}
          onDoubleClick={(): Promise<void> => onFileNodeSelected(node)}
        >
          {node?.name}
        </button>
      </Row>
    )
  }

  const RenderDirectory = ({ node }: { node: FileNode }): JSX.Element => {
    if (node.type !== 'DIRECTORY') return <RenderSingleNode node={node} />

    return (
      <Column>
        <Row className={'h-auto w-auto gap-1'}>
          <p>ㄴ</p>
          <button className={'flex items-center'}>{node.name}</button>
        </Row>
        <Column className={'h-auto pl-2'}>
          {...node?.children.map((child) => (
            <RenderDirectory key={`project-file-structure-node-[${child.path}]`} node={child} />
          ))}
        </Column>
      </Column>
    )
  }

  return (
    <Column
      className={
        'w-[180px] h-full p-2 bg-dust-secondary border-l-[1px] border-gray-500 text-xs overflow-x-hidden overflow-y-scroll'
      }
    >
      {rootNode !== null ? <RenderDirectory node={rootNode} /> : <></>}
    </Column>
  )
}
