'use client';

import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

const graphData = {
  nodes: [
    { id: 'post-1', name: 'Ciência da Informação e Dados', group: 'post', val: 10 },
    { id: 'tag-1', name: 'SQL', group: 'tag', val: 5 },
    { id: 'tag-2', name: 'Governança', group: 'tag', val: 5 },
    { id: 'post-2', name: 'Tratamento de Dados com Python', group: 'post', val: 10 },
    { id: 'tag-3', name: 'Python', group: 'tag', val: 5 }
  ],
  links: [
    { source: 'post-1', target: 'tag-1' },
    { source: 'post-1', target: 'tag-2' },
    { source: 'post-2', target: 'tag-3' },
    { source: 'post-2', target: 'tag-1' }
  ]
};

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: 'white', minHeight: '100vh' }}>
      <h1>🌐 Meu Grafo de Conhecimento</h1>
      <p>Vermelho: Posts | Azul: Tags/Conceitos</p>
      
      <div style={{ height: '500px', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node.group === 'post' ? '#ef4444' : '#3b82f6')}
          backgroundColor="#0f172a"
        />
      </div>
    </main>
  );
}
