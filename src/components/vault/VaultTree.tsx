import { ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { buildTree, type TreeNode } from '@/src/lib/vault'
import { cn } from '@/src/lib/utils'

function Node({ node, depth, activePath }: { node: TreeNode; depth: number; activePath: string }) {
  // Una carpeta arranca abierta si es de primer nivel o si contiene la nota activa
  const [open, setOpen] = useState(depth < 1 || activePath.startsWith(`${node.path}/`))
  const pad = { paddingLeft: `${depth * 12 + 10}px` }

  if (node.kind === 'folder') {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={pad}
          className="text-fg-muted hover:bg-sunken hover:text-fg flex h-8 w-full cursor-pointer items-center gap-1.5 rounded-sm pr-2 text-left text-[13px]"
        >
          <ChevronRight
            aria-hidden="true"
            className={cn(
              'size-3.5 shrink-0 transition-transform duration-[var(--motion-fast)]',
              open && 'rotate-90',
            )}
          />
          {open ? (
            <FolderOpen aria-hidden="true" className="text-fg-faint size-3.5 shrink-0" />
          ) : (
            <Folder aria-hidden="true" className="text-fg-faint size-3.5 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>

        {open ? (
          <ul>
            {node.children.map((child) => (
              <Node key={child.path} node={child} depth={depth + 1} activePath={activePath} />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }

  return (
    <li>
      <NavLink
        to={`/boveda/nota/${encodeURIComponent(node.path)}`}
        style={pad}
        className={({ isActive }) =>
          cn(
            'flex h-8 items-center gap-1.5 rounded-sm pr-2 text-[13px]',
            isActive
              ? 'bg-accent-soft text-accent font-medium'
              : 'text-fg-subtle hover:bg-sunken hover:text-fg',
          )
        }
      >
        <FileText aria-hidden="true" className="size-3.5 shrink-0 opacity-60" />
        <span className="truncate">{node.name}</span>
      </NavLink>
    </li>
  )
}

export function VaultTree() {
  const tree = buildTree()
  const { pathname } = useLocation()
  const marker = '/boveda/nota/'
  const activePath = pathname.startsWith(marker)
    ? decodeURIComponent(pathname.slice(marker.length))
    : ''

  return (
    <ul className="space-y-px">
      {tree.map((node) => (
        <Node key={node.path} node={node} depth={0} activePath={activePath} />
      ))}
    </ul>
  )
}
