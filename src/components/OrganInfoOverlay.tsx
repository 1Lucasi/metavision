import { useLayoutEffect, useRef, type RefObject } from 'react'
import type { OrganInfo } from '../data/organs'

interface OrganInfoOverlayProps {
  title: string
  group?: string
  info: OrganInfo
  leftPanel: RefObject<HTMLDivElement>
  rightPanel: RefObject<HTMLDivElement>
}

export function OrganInfoOverlay({ title, group, info, leftPanel, rightPanel }: OrganInfoOverlayProps) {
  const overlay = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const element = overlay.current
    const left = leftPanel.current
    const right = rightPanel.current
    const container = element?.parentElement
    if (!element || !left || !right || !container) return

    // Mede somente o layout HTML; câmera e meshes não participam do posicionamento.
    const updateLayout = () => {
      element.style.setProperty('--organ-info-left', `${left.offsetLeft + left.offsetWidth + 24}px`)
      element.style.setProperty('--organ-info-right', `${container.clientWidth - right.offsetLeft + 24}px`)
      element.style.setProperty('--organ-info-below', `${Math.max(
        container.clientHeight,
        left.offsetTop + left.offsetHeight + 16,
        right.offsetTop + right.offsetHeight + 16,
      )}px`)
    }
    const observer = new ResizeObserver(updateLayout)
    observer.observe(container)
    observer.observe(left)
    observer.observe(right)
    updateLayout()
    return () => observer.disconnect()
  }, [leftPanel, rightPanel])

  return (
    <section ref={overlay} className="organ-info-overlay" aria-labelledby="organ-info-title">
      <h2 id="organ-info-title" className="organ-info-title">
        {group && <span className="selecao-grupo">{group}</span>}
        {title}
      </h2>
      <dl className="organ-info">
        <div className="organ-info-box organ-info-location">
          <dt>Localização</dt>
          <dd>{info.localizacao}</dd>
        </div>
        <div className="organ-info-box organ-info-function">
          <dt>Função</dt>
          <dd>{info.funcao}</dd>
        </div>
        <div className="organ-info-box organ-info-detail">
          <dt>Detalhe anatômico</dt>
          <dd>{info.detalheAnatomico}</dd>
        </div>
      </dl>
    </section>
  )
}
