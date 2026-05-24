import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RouteIQ — Pathfinding Algorithm Visualizer',
  description: 'Interactive pathfinding visualizer. Explore BFS, DFS, Dijkstra, A*, and Bellman-Ford algorithms on virtual grids and real-world maps.',
  keywords: ['pathfinding', 'algorithm visualizer', 'BFS', 'DFS', 'Dijkstra', 'A*', 'graph algorithms', 'DAA'],
  openGraph: {
    title: 'RouteIQ — Pathfinding Visualizer',
    description: 'Visualize and compare graph algorithms in real time on interactive grids and real-world maps.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
